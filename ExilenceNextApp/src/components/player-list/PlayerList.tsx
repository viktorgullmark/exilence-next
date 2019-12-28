import React from 'react';
import PlayerListItem from './player-list-item/PlayerListItem';
import { List, makeStyles, Theme } from '@material-ui/core';

interface Props {
  playerList: any[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: theme.palette.background.paper
  }
}));

const PlayerList: React.FC<Props> = ({ playerList }: Props) => {
  const classes = useStyles();
  return (
    <List dense className={classes.root}>
      {playerList.map(p => {
        return <PlayerListItem key={p.uuid} player={p} />;
      })}
    </List>
  );
};

export default PlayerList;
