import React from 'react';
import { GetServerSideProps } from 'next';
import { parseMachine } from '../components/parseMachine';
import { visualizeMessage } from '../components/utils';
import dynamic from 'next/dynamic';
import { db } from '../lib/db';

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
  const { id } = context.params!;

  if (typeof id !== 'string') {
    throw new Error('Invalid machine ID');
  }

  const source = await db
    .selectFrom('machines')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();

  const machineSource =
    typeof source === 'undefined'
      ? visualizeMessage('Machine not found 😔')
      : source.fileContent;

  return {
    props: { machineSource },
  };
};
