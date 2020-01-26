import { Box } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Highcharts from './../highcharts-base/HighchartsBase';
import { primaryDarker } from '../../assets/themes/exilence-theme';
import HC from 'highcharts';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  chartData: number[][];
  seriesName: string | undefined;
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
  chartData,
  seriesName
}: Props) => {
  const theme = useTheme();
  const classes = useStyles();

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
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },
    series: [
      {
        type: 'area',
        name: seriesName,
        data: chartData
      }
    ]
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
