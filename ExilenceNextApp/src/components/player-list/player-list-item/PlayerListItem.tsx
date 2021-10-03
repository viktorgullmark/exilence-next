import {
  Avatar,
  Checkbox,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { IApiAccount } from '../../../interfaces/api/api-account.interface';
import useStyles from './PlayerListItem.styles';

interface Props {
  account: IApiAccount;
  selected: boolean;
  handleToggle: (uuid: string) => void;
}

const PlayerListItem = ({ account, selected, handleToggle }: Props) => {
  const classes = useStyles();

  return (
    <ListItemButton
      key={account.uuid}
      className={classes.root}
      onClick={() => handleToggle(account.uuid)}
    >
      <ListItemAvatar>
        <Avatar>{account.name[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText id={account.uuid} primary={`${account.name}`} />
      <ListItemSecondaryAction>
        <Checkbox
          edge="end"
          color="primary"
          onChange={() => handleToggle(account.uuid)}
          checked={selected}
          inputProps={{ 'aria-labelledby': account.uuid }}
        />
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

PlayerListItem.displayName = 'PlayerListItem';

export default PlayerListItem;
