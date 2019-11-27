import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React from 'react';

export const cardHeight = 100;

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: cardHeight
  }
}));

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  textColor?: string;
}

const Widget: React.FC<WidgetProps> = ({
  children,
  backgroundColor,
  textColor
}: WidgetProps) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} style={{ background: backgroundColor, color: textColor }}>
      {children}
    </Paper>
  );
};

export default observer(Widget);
