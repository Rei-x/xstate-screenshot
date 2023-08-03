import React from 'react';
import { GetServerSideProps } from 'next';
import { parseMachine } from '../../components/parseMachine';
import dynamic from 'next/dynamic.js';
import { z } from 'zod';
import lzstring from 'lz-string';

const MachineVisualizer = dynamic(
  () =>
    import('../../components/MachineVisualizer').then(
      (mod) => mod.MachineVisualizer,
    ),
  {
    ssr: false,
  },
);

function App(props: { sourceCode: string }) {
  const machine = parseMachine(props.sourceCode);

  return <MachineVisualizer machine={machine} />;
}

export default App;

const paramsSchema = z.object({
  machineContent: z.string(),
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { machineContent } = paramsSchema.parse(context.params);

  const decompressed =
    lzstring.decompressFromEncodedURIComponent(machineContent);

  const sourceCode = `const { createMachine, assign, actions } = require("xstate");
  const machine = createMachine(${decompressed});
  `;

  return {
    props: { sourceCode },
  };
};
