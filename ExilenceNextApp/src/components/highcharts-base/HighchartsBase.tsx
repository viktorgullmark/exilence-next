import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type Props = Omit<HighchartsReact.Props, 'highcharts'>;

const HighchartsBase: React.FC<Props> = (props: Props) => {
  const chartRef = useRef(null);

  const afterChartCreated = (chart: any) => {
    chart.reflow();
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
