import { inject, observer } from 'mobx-react';
import React from 'react';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import SnapshotHistoryChart from './SnapshotHistoryChart';
import { SignalrStore } from '../../store/signalrStore';
import useChartSize from '../../hooks/use-chart-size';
import { useWindowSize } from '../../hooks/use-window-size';

interface Props {
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
  uiStateStore?: UiStateStore;
}

const SnapshotHistoryChartContainer: React.FC<Props> = ({
  accountStore,
  signalrStore,
  uiStateStore
}: Props) => {
  const [windowWidth,] = useWindowSize();
  const { width, height, ref } = useChartSize(windowWidth);
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  const chartData = () => {
    return activeProfile ? activeProfile.chartData : [];
  };

  const { activeGroup } = signalrStore!;

  return (
    <div ref={ref} style={{ height: '100%', width: '100%'}}>
      <SnapshotHistoryChart
        width={width}
        height={height}
        data={activeGroup ? activeGroup.chartData : chartData()}
      />
    </div>
  );
};

export default inject(
  'accountStore',
  'signalrStore',
  'uiStateStore'
)(observer(SnapshotHistoryChartContainer));
