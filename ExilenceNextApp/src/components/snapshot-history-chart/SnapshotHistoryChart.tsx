import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  AreaSeries,
  makeWidthFlexible,
  GradientDefs,
  LineSeries,
  Crosshair,
  AreaSeriesPoint
} from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';
import { secondary } from '../../assets/themes/exilence-theme';

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

interface Props {}

const useStyles = makeStyles((theme: Theme) => ({
}));

const SnapshotHistoryChart: React.FC<Props> = (props: Props) => {
  const [value, setValue] = useState<AreaSeriesPoint | undefined>(undefined);
  const classes = useStyles();
  const { t } = useTranslation();

  const theme = useTheme();

  return (
    <>
      <FlexibleXYPlot height={180} onMouseLeave={() => setValue(undefined)}>
        <GradientDefs>
          <linearGradient id="primaryGradient" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor={theme.palette.primary.light}
              stopOpacity={0.4}
            />
            <stop
              offset="100%"
              stopColor={theme.palette.primary.main}
              stopOpacity={0.3}
            />
          </linearGradient>
        </GradientDefs>
        <HorizontalGridLines style={{ stroke: secondary.light }} />
        <VerticalGridLines style={{ stroke: secondary.light }} />
        <XAxis
          style={{
            line: { stroke: secondary.light },
            text: {
              stroke: 'none',
              fill: theme.palette.text.secondary,
              fontSize: '0.75rem'
            }
          }}
        />
        <YAxis
          style={{
            line: { stroke: secondary.light },
            text: {
              stroke: 'none',
              fill: theme.palette.text.secondary,
              fontSize: '0.75rem'
            }
          }}
        />
        <AreaSeries
          onNearestX={value => setValue(value)}
          color={'url(#primaryGradient)'}
          data={[
            { x: 1, y: 10 },
            { x: 2, y: 5 },
            { x: 3, y: 15 }
          ]}
        />
        {value && (
          <Crosshair
            style={{ line: { background: theme.palette.primary.main } }}
            values={[value]}
          />
        )}
      </FlexibleXYPlot>
    </>
  );
};

export default SnapshotHistoryChart;
