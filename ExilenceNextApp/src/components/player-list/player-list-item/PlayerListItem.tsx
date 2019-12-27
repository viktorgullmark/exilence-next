import { makeStyles, Theme, Paper } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  player: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    background: theme.palette.secondary.main,
    height: 60
  }
}));

const PlayerListItem = (props: Props) => {
  const { player } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  return <Paper className={classes.paper}></Paper>;
};

export default PlayerListItem;
