import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import PlayerList from './PlayerList';

interface Props {
  uiStateStore?: UiStateStore;
}

const PlayerListContainer: React.FC<Props> = ({ uiStateStore }: Props) => {
  return <PlayerList playerList={[{ uuid: '319873j3ni', name: 'Test' }]} />;
};

export default inject(
  'uiStateStore'
)(observer(PlayerListContainer));
