import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useStores } from '../..';
import ChartToolbox, { TimespanTypeWording } from './ChartToolbox';

const ChartToolboxContainer = () => {
  const { uiStateStore } = useStores();

  const options = useMemo(
    (): TimespanTypeWording[] => [
      {
        mode: '1 day',
        wording: 'action.timespan-one-day-type',
      },
      {
        mode: '1 week',
        wording: 'action.timespan-one-week-type',
      },
      {
        mode: '1 month',
        wording: 'action.timespan-one-month-type',
      },
      {
        mode: 'All time',
        wording: 'action.timespan-all-time-type',
      },
    ],
    []
  );

  return (
    <ChartToolbox
      options={options}
      handleChangeTimeSpan={(val) => uiStateStore.setChartTimeSpan(val)}
      selectedChartTimeSpan={uiStateStore.chartTimeSpan}
    />
  );
};

export default observer(ChartToolboxContainer);
