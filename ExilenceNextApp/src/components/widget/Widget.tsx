import { Paper } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { cardHeight } from '../../routes/net-worth/NetWorth';
import useStyles from './Widget.styles';

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
  height = cardHeight,
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
