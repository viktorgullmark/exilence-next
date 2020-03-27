import { inject, observer } from 'mobx-react';
import React from 'react';
import { AccountStore } from '../../store/accountStore';
import ChartToolbox from './ChartToolbox';

interface Props {
  accountStore?: AccountStore;
  // todo: create store for chart settings?
}

const SnapshotHistoryChartContainer: React.FC<Props> = ({
  accountStore
}: Props) => {
  return <ChartToolbox />;
};

export default inject('accountStore')(observer(SnapshotHistoryChartContainer));
