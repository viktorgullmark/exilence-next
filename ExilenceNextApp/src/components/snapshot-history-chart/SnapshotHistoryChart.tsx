import {
  useTheme,
  makeStyles,
  Theme,
  createStyles
} from '@material-ui/core/styles';
import React from 'react';
import Highcharts from './../highcharts-base/HighchartsBase';
import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import { toolbarHeight, resizeHandleContainerHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';
import {
  cardHeight,
  netWorthGridSpacing
} from '../../routes/net-worth/NetWorth';
import { itemTableFilterHeight } from '../item-table/ItemTableContainer';
import { tabPanelSpacing } from '../tab-panel/TabPanel';
import { netWorthTabGroupHeight } from '../net-worth-tab-group/NetWorthTabGroup';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  chartData: number[][];
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: `calc(100vh - ${toolbarHeight}px - ${resizeHandleContainerHeight}px - ${innerToolbarHeight}px - ${cardHeight}px - ${itemTableFilterHeight}px - ${theme.spacing(
        netWorthGridSpacing * 1 + tabPanelSpacing * 2
      )}px - ${netWorthTabGroupHeight}px)`
    }
  })
);

const SnapshotHistoryChart: React.FC<Props> = ({ chartData }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const classes = useStyles();

  const options = {
    title: {
      text: t('title.snapshot_history_chart')
    },
    xAxis: {
      type: 'datetime'
    },
    series: [
      {
        data: chartData
      }
    ]
  };

  return (
    <Box className={classes.root}>
      <Highcharts
        options={options}
        containerProps={{ style: { height: '100%', width: '100%' } }}
      />
    </Box>
  );
};

export default SnapshotHistoryChart;
