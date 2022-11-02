import useComponentSize from '@rehooks/component-size';
import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { useStores } from '../..';
import { chartHeight as _chartHeight } from '../../routes/net-worth/NetWorth';
import SessionTimeHistoryPieChart from './SessionTimeHistoryPieChart';

type SessionTimeHistoryPieChartContainerProps = {
  chartHeight?: number;
};

const SessionTimeHistoryPieChartContainer = ({
  chartHeight,
}: SessionTimeHistoryPieChartContainerProps) => {
  const { accountStore } = useStores();
  const ref = useRef(null);
  const size = useComponentSize(ref);

  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  return (
    <div ref={ref} style={{ height: chartHeight ?? _chartHeight, width: '100%' }}>
      <SessionTimeHistoryPieChart
        width={size.width}
        height={size.height}
        seriesData={activeProfile?.session.sessionTimePieChartData}
      />
    </div>
  );
};

export default observer(SessionTimeHistoryPieChartContainer);
