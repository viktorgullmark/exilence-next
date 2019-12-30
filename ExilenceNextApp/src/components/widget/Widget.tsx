import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React from 'react';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  }
}));

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  textColor?: string;
  height?: number;
}

const Widget: React.FC<WidgetProps> = ({
  children,
  backgroundColor,
  textColor,
  height = 100
}: WidgetProps) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} style={{ background: backgroundColor, color: textColor, height: height }}>
      {children}
    </Paper>
  );
};

export default observer(Widget);
