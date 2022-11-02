import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ISessionTimePieChartSeries } from '../../interfaces/connection-chart-series.interface';
import Highcharts from '../highcharts-base/HighchartsBase';
import useStyles from './SessionTimeHistoryPieChart.styles';

type SessionTimeHistoryPieChartProps = {
  width: number;
  height: number;
  seriesData?: ISessionTimePieChartSeries[];
};

const SessionTimeHistoryPieChart = ({ seriesData }: SessionTimeHistoryPieChartProps) => {
  const theme = useTheme();
  const classes = useStyles();

  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: '',
    },
    tooltip: {
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    legend: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          color: '#ffff',
        },
      },
    },
    series: seriesData,
  };

  return (
    <Box className={classes.root}>
      <Highcharts
        colors={undefined}
        options={options}
        containerProps={{
          style: {
            height: '100%',
            width: '100%',
            borderRadius: theme.spacing(0.5),
          },
        }}
      />
    </Box>
  );
};

export default SessionTimeHistoryPieChart;
