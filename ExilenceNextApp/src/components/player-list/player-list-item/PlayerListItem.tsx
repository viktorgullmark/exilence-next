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

  // todo: refactor to use within store instead
  const [checked, setChecked] = React.useState<string[]>([]);
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <ListItem
      key={account.uuid}
      innerRef={ref}
      className={classes.root}
      button
      onClick={handleToggle(account.uuid)}
    >
      <ListItemAvatar>
        <Avatar>{account.name[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText id={account.uuid} primary={`${account.name}`} />
      <ListItemSecondaryAction>
        <Checkbox
          edge="end"
          color="primary"
          onChange={handleToggle(account.uuid)}
          checked={checked.indexOf(account.uuid) !== -1}
          inputProps={{ 'aria-labelledby': account.uuid }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

PlayerListItem.displayName = 'PlayerListItem';

export default PlayerListItem;
