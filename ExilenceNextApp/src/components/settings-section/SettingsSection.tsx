import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React from 'react';
import { Typography, Paper } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  title: {}
}));

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

const SettingsSection: React.FC<Props> = ({ children, title }: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="overline" className={classes.title}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export default observer(SettingsSection);
