import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useStores } from '../..';
import { HistoryChartSeriesMode } from '../../types/history-chart-series-mode.type';
import { TimespanType } from '../../types/timespan.type';
import ChartToolbox from '../chart-toolbox/ChartToolbox';
import NetWorthSessionChartToolbox from './NetWorthSessionChartToolbox';

export interface HistoryChartSeriesModeWordings {
  mode: HistoryChartSeriesMode;
  wording: string;
}

const NetWorthSessionChartToolboxContainer = () => {
  const { uiStateStore } = useStores();
  const timespanOptions = useMemo(
    (): TimespanType[] => ['1 hour', '1 day', '1 week', 'All time'],
    []
  );
  const chartModeOptions = useMemo(
    (): HistoryChartSeriesModeWordings[] => [
      { mode: 'netWorth', wording: 'action.history-chart-net-worth-mode' },
      { mode: 'income', wording: 'action.history-chart-income-mode' },
      { mode: 'both', wording: 'action.history-chart-both-mode' },
    ],
    []
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={7}>
        <ChartToolbox
          options={timespanOptions}
          handleChangeTimeSpan={(val) => uiStateStore.setNetworthSessionChartTimeSpan(val)}
          selectedChartTimeSpan={uiStateStore.networthSessionChartTimeSpan}
        />
      </Grid>
      <Grid item xs={5}>
        <NetWorthSessionChartToolbox
          options={chartModeOptions}
          handleChangeMode={(val) => uiStateStore.setNetWorthSessionHistoryChartMode(val)}
          selectedChartMode={uiStateStore.netWorthSessionHistoryChartMode}
        />
      </Grid>
    </Grid>
  );
};

export default observer(NetWorthSessionChartToolboxContainer);
