import React from 'react';
import PlayerListItem from './player-list-item/PlayerListItem';
import { List, makeStyles, Theme } from '@material-ui/core';
import { IApiConnection } from '../../interfaces/api/api-connection.interface';

interface Props {
  connections: IApiConnection[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: theme.palette.background.paper
  }
}));

const PlayerList: React.FC<Props> = ({ connections }: Props) => {
  const classes = useStyles();
  return (
    <List dense className={classes.root}>
      {connections.map(c => {
        return <PlayerListItem key={c.account.uuid} account={c.account} />;
      })}
    </List>
  );
};

export default PlayerList;
