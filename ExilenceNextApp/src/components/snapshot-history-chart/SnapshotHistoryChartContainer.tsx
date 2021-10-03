import useComponentSize from '@rehooks/component-size';
import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { useStores } from '../..';
import { chartHeight as _chartHeight } from '../../routes/net-worth/NetWorth';
import SnapshotHistoryChart from './SnapshotHistoryChart';

type SnapshotHistoryChartContainerProps = {
  showIndividualTabs?: boolean;
  chartHeight?: number;
};

const SnapshotHistoryChartContainer = ({
  showIndividualTabs,
  chartHeight,
}: SnapshotHistoryChartContainerProps) => {
  const { accountStore, signalrStore } = useStores();
  const ref = useRef(null);
  const size = useComponentSize(ref);

  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  const { activeGroup } = signalrStore!;

  return (
    <div ref={ref} style={{ height: chartHeight ?? _chartHeight, width: '100%' }}>
      <SnapshotHistoryChart
        width={size.width}
        height={size.height}
        groupData={showIndividualTabs ? undefined : activeGroup?.chartData}
        playerData={showIndividualTabs ? activeProfile?.tabChartData : activeProfile?.chartData}
        showIndividualTabs={showIndividualTabs}
      />
    </div>
  );
};

export default observer(SnapshotHistoryChartContainer);
