import React from 'react';
import { inject, observer } from 'mobx-react';

import { SignalrStore } from '../../store/signalrStore';
import PlayerList from './PlayerList';

type PlayerListContainerProps = {
  signalrStore?: SignalrStore;
};

const PlayerListContainer = ({ signalrStore }: PlayerListContainerProps) => {
  return (
    <>
      {signalrStore!.activeGroup && (
        <PlayerList connections={signalrStore!.activeGroup.connections} />
      )}
    </>
  );
};

export default inject('uiStateStore', 'signalrStore')(observer(PlayerListContainer));
