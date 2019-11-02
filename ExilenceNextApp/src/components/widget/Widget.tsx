import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React from 'react';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {}

const Widget: React.FC<WidgetProps> = ({ children }: WidgetProps) => {
  const classes = useStyles();

  return <Paper className={classes.paper}>{children}</Paper>;
};

export default observer(Widget);
