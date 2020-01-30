import {
  Avatar,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme
} from '@material-ui/core';
import React, { forwardRef } from 'react';
import { IApiAccount } from '../../../interfaces/api/api-account.interface';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    color: theme.palette.text.primary
  }
}));

interface Props {
  account: IApiAccount;
  selected: boolean;
  handleToggle: (uuid: string) => void;
}

const PlayerListItem = forwardRef(
  ({ account, selected, handleToggle }: Props, ref) => {
    const classes = useStyles();

    return (
      <ListItem
        key={account.uuid}
        innerRef={ref}
        className={classes.root}
        button
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
      </ListItem>
    );
  }
);

PlayerListItem.displayName = 'PlayerListItem';

export default PlayerListItem;
