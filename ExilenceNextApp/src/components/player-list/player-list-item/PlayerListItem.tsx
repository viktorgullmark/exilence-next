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

interface Props {
  player: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    color: theme.palette.text.primary
  }
}));

const PlayerListItem = forwardRef((props: Props, ref) => {
  const { player } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  // todo: refactor to use within store instead
  const [checked, setChecked] = React.useState([1]);
  const handleToggle = (value: number) => () => {
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
      key={player.uuid}
      innerRef={ref}
      className={classes.root}
      button
      onClick={handleToggle(player.uuid)}
    >
      <ListItemAvatar>
        <Avatar>{player.name[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText id={player.uuid} primary={`${player.name}`} />
      <ListItemSecondaryAction>
        <Checkbox
          edge="end"
          color="primary"
          onChange={handleToggle(player.uuid)}
          checked={checked.indexOf(player.uuid) !== -1}
          inputProps={{ 'aria-labelledby': player.uuid }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

PlayerListItem.displayName = 'PlayerListItem';

export default PlayerListItem;
