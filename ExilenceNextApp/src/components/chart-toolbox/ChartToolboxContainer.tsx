import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import ChartToolbox from './ChartToolbox';

const SnapshotHistoryChartContainer = () => {
  const { uiStateStore } = useStores();
  return (
    <ChartToolbox
      handleChangeTimeSpan={(val) => uiStateStore!.setChartTimeSpan(val)}
      selectedChartTimeSpan={uiStateStore!.chartTimeSpan}
    />
  );
};

export default observer(SnapshotHistoryChartContainer);
