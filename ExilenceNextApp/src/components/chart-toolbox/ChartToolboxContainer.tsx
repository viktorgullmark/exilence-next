import { inject, observer } from 'mobx-react';
import React from 'react';
import { AccountStore } from '../../store/accountStore';
import ChartToolbox from './ChartToolbox';
import { UiStateStore } from '../../store/uiStateStore';

interface Props {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

const SnapshotHistoryChartContainer: React.FC<Props> = ({
  accountStore,
  uiStateStore
}: Props) => {
  return (
    <ChartToolbox
      handleChangeTimeSpan={val => uiStateStore!.setChartTimeSpan(val)}
      selectedChartTimeSpan={uiStateStore!.chartTimeSpan}
    />
  );
};

export default inject(
  'accountStore',
  'uiStateStore'
)(observer(SnapshotHistoryChartContainer));
