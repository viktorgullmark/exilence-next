import React from 'react';
import { inject, observer } from 'mobx-react';

import { UiStateStore } from '../../store/uiStateStore';
import ChartToolbox from './ChartToolbox';

type SnapshotHistoryChartContainerProps = {
  uiStateStore?: UiStateStore;
};

const SnapshotHistoryChartContainer = ({ uiStateStore }: SnapshotHistoryChartContainerProps) => {
  return (
    <ChartToolbox
      handleChangeTimeSpan={(val) => uiStateStore!.setChartTimeSpan(val)}
      selectedChartTimeSpan={uiStateStore!.chartTimeSpan}
    />
  );
};

export default inject('accountStore', 'uiStateStore')(observer(SnapshotHistoryChartContainer));
