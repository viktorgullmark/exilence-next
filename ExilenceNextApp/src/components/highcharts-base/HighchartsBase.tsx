import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';

type HighchartsBaseProps = {
  colors?: string[];
} & Omit<HighchartsReact.Props, 'highcharts'>

const HighchartsBase = (props: HighchartsBaseProps) => {
  const chartRef = useRef(null);
  const { colors } = props;

  const afterChartCreated = (chart: any) => {
    chart.reflow();
    if (colors) {
      chart.update({ colors: colors });
    }
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      {...props}
      ref={chartRef}
      callback={afterChartCreated}
    />
  );
};

export default HighchartsBase;
