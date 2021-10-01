import React, { ReactNode } from 'react';
import { Paper } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { cardHeight } from '../../routes/net-worth/NetWorth';
import useStyles from './Widget.styles';
import { Skeleton } from '@mui/material';

type WidgetProps = {
  backgroundColor?: string;
  textColor?: string;
  height?: number;
  compact?: boolean;
  center?: boolean;
  loading?: boolean;
  children: ReactNode;
};

const Widget = ({
  children,
  backgroundColor,
  textColor,
  height = cardHeight,
  compact,
  loading,
  center,
}: WidgetProps) => {
  const classes = useStyles();

  return <>
    {loading ? (
      <Skeleton variant="rectangular" height={height} />
    ) : (
      <Paper
        className={clsx(classes.paper, {
          [classes.noPadding]: compact,
          [classes.centered]: center,
        })}
        style={{ background: backgroundColor, color: textColor, height: height }}
      >
        {children}
      </Paper>
    )}
  </>;
};

export default observer(Widget);
