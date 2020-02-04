import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

type Props = Omit<HighchartsReact.Props, 'highcharts'>;

const HighchartsBase: React.FC<Props> = (props: Props) => {
  return <HighchartsReact highcharts={Highcharts} {...props} />;
};

export default HighchartsBase;
