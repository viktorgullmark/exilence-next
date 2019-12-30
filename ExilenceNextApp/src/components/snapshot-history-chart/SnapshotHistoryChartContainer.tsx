import { inject, observer } from 'mobx-react';
import React from 'react';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import SnapshotHistoryChart from './SnapshotHistoryChart';

interface Props {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

const SnapshotHistoryChartContainer: React.FC<Props> = ({
  accountStore,
  uiStateStore,
}: Props) => {

  return (
    <SnapshotHistoryChart />
  );
};

export default inject('accountStore', 'uiStateStore')(
  observer(SnapshotHistoryChartContainer)
);
