import React from 'react';
import { GetServerSideProps } from 'next';
import { parseMachine } from '../components/parseMachine';
// import { MachineVisualizer } from '../components/MachineVisualizer';
import { visualizeMessage } from '../components/utils';
import dynamic from 'next/dynamic';

const MachineVisualizer = dynamic(
  () =>
    import('../components/MachineVisualizer').then(
      (mod) => mod.MachineVisualizer,
    ),
  {
    ssr: false,
  },
);

function App(props: { machineSource: string }) {
  const machine = parseMachine(props.machineSource);

  return <MachineVisualizer machine={machine} />;
}

export default App;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const RAW_MACHINE_PATH =
    'https://gist.githubusercontent.com/Rei-x/ad215452ff4722552be57f1a1daf3696/raw/209f2d69af0fefc78dc91b61116a7b57f756bcc4/machine.ts';
  const machinePath = RAW_MACHINE_PATH;

  const fileContent = await fetch(machinePath).then((r) => r.text());

  const invalidComponent = fileContent === '404: Not Found';

  const machineSource = invalidComponent
    ? visualizeMessage('Machine not found 😔')
    : fileContent;

  return {
    props: { machineSource },
  };
};
