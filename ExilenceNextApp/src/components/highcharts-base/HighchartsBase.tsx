import React, { useRef } from 'react';
import Highcharts, { SeriesOptionsType } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type Props = Omit<HighchartsReact.Props, 'highcharts'>;

interface IProps extends Props {
  colors?: string[];
}

const HighchartsBase: React.FC<IProps> = (props: IProps) => {
  const chartRef = useRef(null);
  const { colors } = props;

  const afterChartCreated = (chart: any) => {
    chart.reflow();
    if (colors) {
      chart.update({ colors: colors })
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
