import React from 'react';
import { useTheme } from '@material-ui/core';
import Highcharts from 'highcharts';

const HighchartsTheme: React.FC = () => {
  const theme = useTheme();

  const highchartsTheme: Highcharts.Options = {
    colors: [theme.palette.primary.main],
    chart: {
      backgroundColor: theme.palette.background.default,
      style: {
        color: theme.palette.text.primary
      },
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
    }
  };

  Highcharts.setOptions(highchartsTheme);

  return null;
};

export default HighchartsTheme;
