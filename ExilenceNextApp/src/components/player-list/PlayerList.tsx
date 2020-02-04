import { List } from '@material-ui/core';
import React from 'react';
import { IApiConnection } from '../../interfaces/api/api-connection.interface';
import PlayerListItemContainer from './player-list-item/PlayerListItemContainer';
import useStyles from './PlayerList.styles';

interface Props {
  connections: IApiConnection[];
}

const PlayerList: React.FC<Props> = ({ connections }: Props) => {
  const classes = useStyles();
  return (
    <List dense className={classes.root}>
      {connections.map(c => {
        return (
          <PlayerListItemContainer key={c.account.uuid} account={c.account} />
        );
      })}
    </List>
  );
};

export default PlayerList;
