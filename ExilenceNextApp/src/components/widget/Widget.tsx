import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  noPadding: {
    padding: 0
  }
}));

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  textColor?: string;
  height?: number;
  compact?: boolean;
}

const Widget: React.FC<WidgetProps> = ({
  children,
  backgroundColor,
  textColor,
  height = 100,
  compact
}: WidgetProps) => {
  const classes = useStyles();

  return (
    <Paper
      className={clsx(classes.paper, { [classes.noPadding]: compact })}
      style={{ background: backgroundColor, color: textColor, height: height }}
    >
      {children}
    </Paper>
  );
};

export default observer(Widget);
