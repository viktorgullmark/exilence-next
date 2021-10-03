import React from 'react';
import { List } from '@mui/material';

import { IApiConnection } from '../../interfaces/api/api-connection.interface';
import PlayerListItemContainer from './player-list-item/PlayerListItemContainer';
import useStyles from './PlayerList.styles';

type PlayerListProps = {
  connections: IApiConnection[];
};

const PlayerList = ({ connections }: PlayerListProps) => {
  const classes = useStyles();
  return (
    <List dense className={classes.root}>
      {connections.map((c) => {
        return <PlayerListItemContainer key={c.account.uuid} account={c.account} />;
      })}
    </List>
  );
};

export default PlayerList;
