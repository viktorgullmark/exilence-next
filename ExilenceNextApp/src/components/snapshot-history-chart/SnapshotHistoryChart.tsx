import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HC from 'highcharts';

import { primaryDarker } from '../../assets/themes/exilence-theme';
import { IConnectionChartSeries } from '../../interfaces/connection-chart-series.interface';
import { IGroupChartSeries } from '../../interfaces/group-chart-series.interface';
import Highcharts from './../highcharts-base/HighchartsBase';
import useStyles from './SnapshotHistoryChart.styles';

type SnapshotHistoryChartProps = {
  width: number;
  height: number;
  playerData?: IConnectionChartSeries[];
  groupData?: IGroupChartSeries[];
  showIndividualTabs?: boolean;
};

type ChartSeries = {
  type: string;
  name: string;
  data: number[][];
};

const SnapshotHistoryChart = ({
  playerData,
  groupData,
  showIndividualTabs,
}: SnapshotHistoryChartProps) => {
  const theme = useTheme();
  const classes = useStyles();

  let seriesData: ChartSeries[] = playerData
    ? playerData.map((pd) => {
        return {
          type: showIndividualTabs ? 'spline' : 'area',
          name: pd.seriesName,
          data: pd.series,
        };
      })
    : [
        {
          type: showIndividualTabs ? 'spline' : 'area',
          name: 'No data',
          data: [],
        },
      ];

  if (groupData) {
    const data: ChartSeries[] = [];

    groupData.map((gd) => {
      gd.connections.map((player) => {
        const playerData = {
          type: showIndividualTabs ? 'spline' : 'area',
          name: player.seriesName,
          data: player.series,
        };
        data.push(playerData);
      });
    });

    seriesData = data;
  }

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
    },
    legend: {
      enabled: showIndividualTabs ? true : false,
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: showIndividualTabs
            ? []
            : [
                [0, HC.color(theme.palette.primary.main).setOpacity(0.25).get('rgba')],
                [1, HC.color(primaryDarker).setOpacity(0).get('rgba')],
              ],
        },
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
        colors={undefined} //showIndividualTabs ? stashTabColors : undefined
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

export default SnapshotHistoryChart;
