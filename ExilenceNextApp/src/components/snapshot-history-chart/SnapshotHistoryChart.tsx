import { Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import HC from 'highcharts';
import React from 'react';
import { primaryDarker } from '../../assets/themes/exilence-theme';
import { IConnectionChartSeries } from '../../interfaces/connection-chart-series.interface';
import { IGroupChartSeries } from '../../interfaces/group-chart-series.interface';
import Highcharts from './../highcharts-base/HighchartsBase';
import useStyles from './SnapshotHistoryChart.styles';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  playerData?: IConnectionChartSeries;
  groupData?: IGroupChartSeries;
}

const SnapshotHistoryChart: React.FC<Props> = ({
  playerData,
  groupData
}: Props) => {
  const theme = useTheme();
  const classes = useStyles();

  let seriesData = [
    {
      type: 'area',
      name: playerData ? playerData.seriesName : 'No data',
      data: playerData ? playerData.series : []
    }
  ];

  if (groupData) {
    seriesData = groupData.connections.map(player => {
      return {
        type: 'area',
        name: player.seriesName,
        data: player.series
      };
    });
  }

  const options = {
    chart: {
      zoomType: 'x'
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime'
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [
              0,
              HC.color(theme.palette.primary.main)
                .setOpacity(0.5)
                .get('rgba')
            ],
            [
              1,
              HC.color(primaryDarker)
                .setOpacity(0)
                .get('rgba')
            ]
          ]
        },
        marker: {
          radius: 1
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },
    series: seriesData
  };

  return (
    <Box className={classes.root}>
      <Highcharts
        options={options}
        containerProps={{
          style: {
            height: '100%',
            width: '100%',
            borderRadius: theme.spacing(0.5)
          }
        }}
      />
    </Box>
  );
};

export default SnapshotHistoryChart;
