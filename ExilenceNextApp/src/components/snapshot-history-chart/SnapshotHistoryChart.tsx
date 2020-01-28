import { Box } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import HC from 'highcharts';
import React from 'react';
import { primaryDarker } from '../../assets/themes/exilence-theme';
import { IConnectionChartSeries } from '../../interfaces/connection-chart-series.interface';
import { IGroupChartSeries } from '../../interfaces/group-chart-series.interface';
import Highcharts from './../highcharts-base/HighchartsBase';
import { Group } from '../../store/domains/group';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  playerData?: IConnectionChartSeries;
  groupData?: IGroupChartSeries;
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      width: '100%'
    }
  })
);

const SnapshotHistoryChart: React.FC<Props> = ({
  playerData,
  groupData
}: Props) => {
  const theme = useTheme();
  const classes = useStyles(); 

  let seriesData = [{
    type: 'area',
    name: playerData ? playerData.seriesName : 'No data',
    data: playerData?.series
  }];

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
          radius: 2
        },
        lineWidth: 2,
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

  console.log(options);

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
