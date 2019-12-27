import React from 'react';
import PlayerListItem from './player-list-item/PlayerListItem';

interface Props {
  playerList: any[];
}

const PlayerList: React.FC<Props> = ({
  playerList
}: Props) => {
  return (
    <>
      {playerList.map(p => {
        return <PlayerListItem key={p.uuid} player={p} />;
      })}
    </>
  );
};

export default PlayerList;
