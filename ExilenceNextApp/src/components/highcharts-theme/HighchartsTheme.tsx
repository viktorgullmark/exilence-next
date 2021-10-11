import { useTheme } from '@mui/material';
import Highcharts from 'highcharts';

import { highchartsColors } from '../../assets/themes/exilence-theme';

const HighchartsTheme = () => {
  const theme = useTheme();

  const highchartsTheme: Highcharts.Options = {
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
    credits: {
      enabled: false,
    },
    colors: highchartsColors,
    chart: {
      backgroundColor: theme.palette.background.default,
      style: {
        color: theme.palette.text.primary,
        font: 'Roboto',
      },
    },
    title: {
      style: {
        color: theme.palette.text.primary,
        font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
      },
    },
    subtitle: {
      style: {
        color: theme.palette.text.primary,
        font: 'bold 12px "Trebuchet MS", Verdana, sans-serif',
      },
    },
    legend: {
      itemStyle: {
        font: '9pt Trebuchet MS, Verdana, sans-serif',
        color: theme.palette.text.primary,
      },
      itemHoverStyle: {
        color: 'gray',
      },
    },
    yAxis: {
      gridLineColor: theme.palette.secondary.light,
      lineColor: theme.palette.text.disabled,
      minorGridLineColor: theme.palette.secondary.light,
      title: {
        text: '',
        style: {
          color: theme.palette.text.primary,
        },
      },
      labels: {
        style: {
          color: theme.palette.text.primary,
        },
      },
    },
    xAxis: {
      gridLineColor: theme.palette.secondary.light,
      lineColor: theme.palette.text.disabled,
      minorGridLineColor: theme.palette.secondary.light,
      labels: {
        style: {
          color: theme.palette.text.primary,
        },
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
        },
      },
      spline: {
        marker: {
          enabled: true,
        },
      },
      area: {
        marker: {
          enabled: true,
        },
      },
      areaspline: {
        marker: {
          enabled: true,
        },
      },
      arearange: {
        marker: {
          enabled: true,
        },
      },
    },
  };

  Highcharts.setOptions(highchartsTheme);

  return null;
};

export default HighchartsTheme;
