import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import PlayerList from './PlayerList';
import { SignalrStore } from '../../store/signalrStore';

interface Props {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
}

const PlayerListContainer: React.FC<Props> = ({
  uiStateStore,
  signalrStore
}: Props) => {
  return (
    <>
      {signalrStore!.activeGroup && (
        <PlayerList connections={signalrStore!.activeGroup.connections} />
      )}
    </>
  );
};

export default inject(
  'uiStateStore',
  'signalrStore'
)(observer(PlayerListContainer));
