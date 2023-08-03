import * as XState from 'xstate';
import * as XStateModel from 'xstate/lib/model.js';
import * as XStateActions from 'xstate/lib/actions.js';
import realmsShim from 'realms-shim';
import * as parser from '@xstate/machine-extractor';

const realm = realmsShim.makeRootRealm();

const wrapCallbackToPreventThis =
  (callback: (...args: any[]) => void) =>
  (...args: any[]) => {
    return callback(...args);
  };

const windowShim = {
  setInterval: (callback: (...args: any[]) => void, ...args: any[]) => {
    return setInterval(wrapCallbackToPreventThis(callback), ...args);
  },
  setTimeout: (callback: (...args: any[]) => void, ...args: any[]) => {
    return setTimeout(wrapCallbackToPreventThis(callback), ...args);
  },
  clearTimeout: (...args: any[]) => {
    return clearTimeout(...args);
  },
  clearInterval: (...args: any[]) => {
    return clearInterval(...args);
  },
};

const resolveConditionalInitial = (source: string) => {
  const conditionalInitialStateRegex = /initial:(.*)\?(.*):(.*),/;
  const isConditionalInitial = source.search(conditionalInitialStateRegex);
  if (!isConditionalInitial) return source;

  const defaultInitialState = source.match(conditionalInitialStateRegex)?.[3];
  const newSource = source.replace(
    conditionalInitialStateRegex,
    `initial: ${defaultInitialState},`,
  );
  return newSource;
};

export const parseMachine = (sourceCode: string) => {
  const source = resolveConditionalInitial(sourceCode);
  const newSource = parser.extractMachinesFromFile(source);

  const machine = newSource?.machines[0];

  const sourcWithCreateMachine = `
  const { createMachine, assign, actions } = require("xstate");

  const machineDefinition = ${JSON.stringify(machine?.toConfig())};

  if (!machineDefinition.context) {
    machineDefinition.context = {};
  }

  machineDefinition.context = {
    ...machineDefinition.context,
    ${newSource?.machines[0]?.getAllConds().map((cond) => {
      return `${cond.name}: false`;
    })}
  };

  if (!machineDefinition.on) {
    machineDefinition.on = {};
  }

  machineDefinition.on = {
    UPDATE_CONTEXT: {
      actions: "updateContext",
    },
    ...machineDefinition.on,
  }

  

  const machine = createMachine(machineDefinition, {
    actions: {
      updateContext: assign((context, event) => {
        return {
          [event.contextKey]: true
        };
      }),
    },
    guards: {
      ${newSource?.machines[0]?.getAllConds().map((cond) => {
        return `${cond.name}: (ctx) => ctx.${cond.name}`;
      })}
    }
  });
  `;

  const machines: Array<XState.StateNode> = [];

  const createMachineCapturer =
    (machineFactory: any) =>
    (...args: any[]) => {
      const machine = machineFactory(...args);
      machines.push(machine);
      return machine;
    };

  realm.evaluate(sourcWithCreateMachine, {
    // we just allow for export statements to be used in the source code
    // we don't have any use for the exported values so we just mock the `exports` object
    exports: {},
    require: (sourcePath: string) => {
      switch (sourcePath) {
        case 'console':
          return console;
        case 'xstate':
          return {
            ...XState,
            createMachine: createMachineCapturer(XState.createMachine),
            Machine: createMachineCapturer(XState.Machine),
          };
        case 'xstate/lib/actions':
          return XStateActions;
        case 'xstate/lib/model':
          const { createModel } = XStateModel;
          return {
            ...XStateModel,
            createModel(initialContext: any, creators: any) {
              const model = createModel(initialContext, creators);
              return {
                ...model,
                createMachine: createMachineCapturer(model.createMachine),
              };
            },
          };
        default:
          throw new Error(`External module ("${sourcePath}") can't be used.`);
      }
    },
    ...windowShim,
  });

  return machines[0];
};
