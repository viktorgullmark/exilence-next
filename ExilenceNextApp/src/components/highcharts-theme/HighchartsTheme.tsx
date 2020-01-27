import React from 'react';
import { useTheme } from '@material-ui/core';
import Highcharts from 'highcharts';

const HighchartsTheme: React.FC = () => {
  const theme = useTheme();

  const highchartsTheme: Highcharts.Options = {
    time: {
      timezoneOffset: new Date().getTimezoneOffset()
    },
    colors: [theme.palette.primary.main],
    chart: {
      backgroundColor: theme.palette.background.paper,
      style: {
        color: theme.palette.text.primary,
        font: 'Roboto'
      }
    },
    title: {
      style: {
        color: theme.palette.text.primary,
        font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
      }
    },
    subtitle: {
      style: {
        color: theme.palette.text.primary,
        font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
      }
    },
    legend: {
      itemStyle: {
        font: '9pt Trebuchet MS, Verdana, sans-serif',
        color: theme.palette.text.primary
      },
      itemHoverStyle: {
        color: 'gray'
      }
    },
    yAxis: {
      gridLineColor: theme.palette.text.hint,
      lineColor: theme.palette.text.hint,
      minorGridLineColor: theme.palette.text.hint,
      title: {
        text: '',
        style: {
          color: theme.palette.text.primary
        }
      },
      labels: {
        style: {
          color: theme.palette.text.primary
        }
      }
    },
    xAxis: {
      gridLineColor: theme.palette.text.hint,
      lineColor: theme.palette.text.hint,
      minorGridLineColor: theme.palette.text.hint,
      labels: {
        style: {
          color: theme.palette.text.primary
        }
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true
        }
      },
      spline: {
        marker: {
          enabled: true
        }
      },
      area: {
        marker: {
          enabled: true
        }
      },
      areaspline: {
        marker: {
          enabled: true
        }
      },
      arearange: {
        marker: {
          enabled: true
        }
      }
    }
  };

  Highcharts.setOptions(highchartsTheme);

  return null;
};

export default HighchartsTheme;
