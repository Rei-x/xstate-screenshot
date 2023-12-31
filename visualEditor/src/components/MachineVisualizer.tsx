import { Box, ChakraProvider } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useInterpret } from '@xstate/react';
import { CanvasProvider } from '../components/CanvasContext';
import { CanvasView } from '../components/CanvasView';
import { SimulationProvider } from '../components/SimulationContext';
import { simulationMachine } from '../components/simulationMachine';
import { useInterpretCanvas } from '../components/useInterpretCanvas';
import Head from 'next/head';
import { styles } from '../components/styles';
import { StateNode } from 'xstate';
import Script from 'next/script';

export const MachineVisualizer = ({ machine }: { machine: StateNode }) => {
  // don't use `devTools: true` here as it would freeze your browser
  const simService = useInterpret(simulationMachine);

  const canvasService = useInterpretCanvas();

  useEffect(() => {
    simService.send({
      type: 'MACHINES.REGISTER',
      machines: [machine],
    });
  }, [machine]);

  console.log('MASZYNAAA', machine.toJSON());

  return (
    <>
      <Box sx={styles}>
        <SimulationProvider value={simService}>
          <Box
            data-viz-theme="dark"
            as="main"
            display="grid"
            gridTemplateColumns="1fr auto"
            gridTemplateAreas="canvas panels"
            height="100vh"
          >
            <CanvasProvider value={canvasService}>
              <CanvasView />
            </CanvasProvider>
          </Box>
        </SimulationProvider>
      </Box>
    </>
  );
};
