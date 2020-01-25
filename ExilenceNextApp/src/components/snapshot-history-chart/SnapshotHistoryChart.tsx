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
  seriesName,
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
    series: [
      {
        name: seriesName,
        data: chartData
      }
    ],
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
