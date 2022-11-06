import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useStores } from '../..';
import { TimespanType } from '../../types/timespan.type';
import ChartToolbox from './ChartToolbox';

const ChartToolboxContainer = () => {
  const { uiStateStore } = useStores();
  const options = useMemo((): TimespanType[] => ['1 day', '1 week', '1 month', 'All time'], []);

  return (
    <ChartToolbox
      options={options}
      handleChangeTimeSpan={(val) => uiStateStore.setChartTimeSpan(val)}
      selectedChartTimeSpan={uiStateStore.chartTimeSpan}
    />
  );
};

export default observer(ChartToolboxContainer);
