import React, { useRef } from 'react';
import useComponentSize from '@rehooks/component-size';
import { inject, observer } from 'mobx-react';

import { AccountStore } from '../../store/accountStore';
import { SignalrStore } from '../../store/signalrStore';
import SnapshotHistoryChart from './SnapshotHistoryChart';

type SnapshotHistoryChartContainerProps = {
  showIndividualTabs?: boolean;
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
};

const SnapshotHistoryChartContainer = ({
  accountStore,
  signalrStore,
  showIndividualTabs,
}: SnapshotHistoryChartContainerProps) => {
  const ref = useRef(null);
  const size = useComponentSize(ref);

  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  const { activeGroup } = signalrStore!;

  return (
    <div ref={ref} style={{ height: '100%', width: '100%' }}>
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

export default inject('accountStore', 'signalrStore')(observer(SnapshotHistoryChartContainer));
