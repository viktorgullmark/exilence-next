import React, { forwardRef } from 'react';
import {
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';

import { IApiAccount } from '../../../interfaces/api/api-account.interface';
import useStyles from './PlayerListItem.styles';

interface Props {
  account: IApiAccount;
  selected: boolean;
  handleToggle: (uuid: string) => void;
}

const PlayerListItem = forwardRef(({ account, selected, handleToggle }: Props, ref) => {
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
});

PlayerListItem.displayName = 'PlayerListItem';

export default PlayerListItem;
