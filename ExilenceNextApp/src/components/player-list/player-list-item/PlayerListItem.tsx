import {
  makeStyles,
  Theme,
  Paper,
  Box,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox
} from '@material-ui/core';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IApiAccount } from '../../../interfaces/api/api-account.interface';

interface Props {
  account: IApiAccount;
  selected: boolean;
  handleToggle: (uuid: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    color: theme.palette.text.primary
  }
}));

const PlayerListItem = forwardRef((props: Props, ref) => {
  const { account } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <ListItem
      key={account.uuid}
      innerRef={ref}
      className={classes.root}
      button
      onClick={() => props.handleToggle(account.uuid)}
    >
      <ListItemAvatar>
        <Avatar>{account.name[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText id={account.uuid} primary={`${account.name}`} />
      <ListItemSecondaryAction>
        <Checkbox
          edge="end"
          color="primary"
          onChange={() => props.handleToggle(account.uuid)}
          checked={props.selected}
          inputProps={{ 'aria-labelledby': account.uuid }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

PlayerListItem.displayName = 'PlayerListItem';

export default PlayerListItem;
