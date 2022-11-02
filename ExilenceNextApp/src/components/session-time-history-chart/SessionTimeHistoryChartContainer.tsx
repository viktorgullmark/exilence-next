import useComponentSize from '@rehooks/component-size';
import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { useStores } from '../..';
import { chartHeight as _chartHeight } from '../../routes/net-worth/NetWorth';
import SessionTimeHistoryChart from './SessionTimeHistoryChart';

type SnapshotHistoryChartContainerProps = {
  chartHeight?: number;
};

const SessionTimeHistoryChartContainer = ({ chartHeight }: SnapshotHistoryChartContainerProps) => {
  const { accountStore } = useStores();
  const ref = useRef(null);
  const size = useComponentSize(ref);

  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  return (
    <div ref={ref} style={{ height: chartHeight ?? _chartHeight, width: '100%' }}>
      <SessionTimeHistoryChart
        width={size.width}
        height={size.height}
        seriesData={activeProfile?.session.sessionTimeChartData}
      />
    </div>
  );
};

export default observer(SessionTimeHistoryChartContainer);
