import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import PlayerList from './PlayerList';

const PlayerListContainer = () => {
  const { signalrStore } = useStores();
  return (
    <>
      {signalrStore!.activeGroup && (
        <PlayerList connections={signalrStore!.activeGroup.connections} />
      )}
    </>
  );
};

export default observer(PlayerListContainer);
