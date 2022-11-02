import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useStores } from '../..';
import { TimespanType } from '../../types/timespan.type';
import ChartToolbox from './ChartToolbox';

type SnapshotHistoryChartContainerProps = {
  isNetworthSessionTimespanChart?: boolean;
};

const SnapshotHistoryChartContainer = ({
  isNetworthSessionTimespanChart,
}: SnapshotHistoryChartContainerProps) => {
  const { uiStateStore } = useStores();
  const options = useMemo((): TimespanType[] => {
    if (uiStateStore.netWorthSessionOpen) {
      return ['1 hour', '1 day', '1 week', 'All time'];
    }
    return ['1 day', '1 week', '1 month', 'All time'];
  }, [uiStateStore.netWorthSessionOpen]);

  return (
    <ChartToolbox
      options={options}
      handleChangeTimeSpan={(val) =>
        uiStateStore.netWorthSessionOpen
          ? isNetworthSessionTimespanChart
            ? uiStateStore.setNetworthSessionChartTimeSpan(val)
            : uiStateStore.setNetworthSessionSnapshotChartTimeSpan(val)
          : uiStateStore.setChartTimeSpan(val)
      }
      selectedChartTimeSpan={
        uiStateStore.netWorthSessionOpen
          ? isNetworthSessionTimespanChart
            ? uiStateStore.networthSessionChartTimeSpan
            : uiStateStore.networthSessionSnapshotChartTimeSpan
          : uiStateStore.chartTimeSpan
      }
    />
  );
};

export default observer(SnapshotHistoryChartContainer);
