import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useStores } from '../..';
import ChartToolbox, { TimespanTypeWording } from '../chart-toolbox/ChartToolbox';
import NetWorthSessionChartToolbox, {
  HistoryChartSeriesModeWording,
} from './NetWorthSessionChartToolbox';

const NetWorthSessionChartToolboxContainer = () => {
  const { uiStateStore } = useStores();
  const timespanOptions = useMemo(
    (): TimespanTypeWording[] => [
      {
        mode: '1 hour',
        wording: 'action.timespan-one-hour-type',
      },
      {
        mode: '1 day',
        wording: 'action.timespan-one-day-type',
      },
      {
        mode: '1 week',
        wording: 'action.timespan-one-week-type',
      },
      {
        mode: 'All time',
        wording: 'action.timespan-all-time-type',
      },
    ],
    []
  );
  const chartModeOptions = useMemo(
    (): HistoryChartSeriesModeWording[] => [
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
          handleChangeTimeSpan={(val) => uiStateStore.setNetWorthSessionChartTimeSpan(val)}
          selectedChartTimeSpan={uiStateStore.netWorthSessionChartTimeSpan}
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
