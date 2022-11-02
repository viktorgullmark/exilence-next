import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ISessionTimeChartSeries } from '../../interfaces/connection-chart-series.interface';
import Highcharts from './../highcharts-base/HighchartsBase';
import useStyles from './SessionTimeHistoryChart.styles';

type SessionTimeHistoryChartProps = {
  width: number;
  height: number;
  seriesData?: ISessionTimeChartSeries[];
};

const SessionTimeHistoryChart = ({ seriesData }: SessionTimeHistoryChartProps) => {
  const theme = useTheme();
  const classes = useStyles();

  const options = {
    chart: {
      zoomType: 'x',
      resetZoomButton: {
        position: {
          align: 'left',
          verticalAlign: 'top',
          x: 15,
        },
      },
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      crosshair: true,
    },
    tooltip: {
      crosshairs: true,
      shared: true,
    },
    legend: {
      enabled: false,
    },
    colors: [
      '#3ed914', // 'start'
      '#e8952e', // 'pause'
      '#eb2f26', // 'offline'
      '#de23de', // 'notActive'
    ],
    plotOptions: {
      area: {
        marker: {
          radius: 1,
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 2,
          },
        },
        threshold: null,
      },
      spline: {
        marker: {
          radius: 1,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
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

export default SessionTimeHistoryChart;
