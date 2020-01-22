import { Box } from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { localPoint } from '@vx/event';
import { LinearGradient } from '@vx/gradient';
import { GridColumns, GridRows } from '@vx/grid';
import { Group } from '@vx/group';
import { appleStock } from '@vx/mock-data';
import { scaleLinear, scaleTime } from '@vx/scale';
import { AreaClosed, Bar, Line } from '@vx/shape';
import { Tooltip, withTooltip } from '@vx/tooltip';
import { bisector, extent, max } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import React from 'react';
import { AreaSeriesPoint } from 'react-vis';
import '../../../node_modules/react-vis/dist/style.css';
import {
  primaryDarker,
  primaryLighter
} from '../../assets/themes/exilence-theme';

export interface DataPoint {
  date: any;
  value: any;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  chartData: DataPoint[];
  width: number;
  height: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: 15
  }
}));

const areEqual = (prevProps: any, nextProps: any) => {
  if (nextProps.tooltipLeft && prevProps.tooltipLeft) {
    if (nextProps.tooltipLeft !== prevProps.tooltipLeft) {
      return false;
    }
  }
  if (nextProps.tooltipTop && prevProps.tooltipTop) {
    if (nextProps.tooltipTop !== prevProps.tooltipTop) {
      return false;
    }
  }
  return false;
};

const SnapshotHistoryChart: React.FC<any & Props> = React.memo(
  ({ width, height, chartData, ...props }) => {
    const theme = useTheme();

    const formatDate = timeFormat("%b %d, %I:%M");
    const data: DataPoint[] = chartData;

    const margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const x = (d: { date: string | number | Date }) => new Date(d.date);
    const y = (d: { value: any }) => d.value;
    const bisectDate = bisector(
      (d: { date: string | number | Date }) => new Date(d.date)
    ).left;

    const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(data, x) as any
    });

    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: [0, max(data, y) + yMax / 3],
      nice: true
    });

    const handleTooltip = (
      event: any,
      data: any,
      xStock: any,
      xScale: any,
      yScale: any
    ) => {
      const point: any = localPoint(event);
      const x0 = xScale.invert(point.x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && d1.date) {
        d = x0 - xStock(d0.date) > xStock(d1.date) - x0 ? d1 : d0;
      }

      if (d) {
        props.showTooltip({
          tooltipData: d,
          tooltipLeft: point.x,
          tooltipTop: yScale(d.value)
        });
      }
    };

    const calculateLeftTooltip = () => {
      return props.tooltipLeft + 100 < width
        ? props.tooltipLeft + 12
        : props.tooltipLeft - 80;
    };

    const chart = (
      <svg width={width} height={height} style={{ borderRadius: 4 }}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={theme.palette.background.default}
          rx={14}
        />
        <defs>
          <LinearGradient
            from={primaryDarker}
            to={primaryLighter}
            id="gradient"
          >
            <stop offset="0%" stopColor={primaryDarker} stopOpacity={1} />
            <stop offset="100%" stopColor={primaryLighter} stopOpacity={0.3} />
          </LinearGradient>
        </defs>
        <Group top={margin.top} left={margin.left}>
          <AxisLeft
            scale={yScale}
            top={0}
            left={0}
            label={'Value '}
            stroke={'#1b1a1e'}
            tickStroke={'#1b1a1e'}
          />
          <AxisBottom
            scale={xScale}
            top={yMax}
            label={'Years'}
            stroke={'#1b1a1e'}
            tickStroke={'#1b1a1e'}
          />
          <GridRows
            lineStyle={{ pointerEvents: 'none' }}
            scale={yScale}
            width={xMax}
            strokeDasharray="1,1"
            stroke="rgba(255,255,255,0.1)"
          />
          <GridColumns
            lineStyle={{ pointerEvents: 'none' }}
            scale={xScale}
            height={yMax}
            strokeDasharray="1,1"
            stroke="rgba(255,255,255,0.1)"
          />
          <AreaClosed
            data={data}
            yScale={yScale}
            x={d => xScale(x(d))}
            y={d => yScale(y(d))}
            fill={'url(#gradient)'}
          />
          <Bar
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            rx={14}
            onTouchStart={event =>
              handleTooltip(event, data, x, xScale, yScale)
            }
            onTouchMove={event => handleTooltip(event, data, x, xScale, yScale)}
            onMouseMove={event => handleTooltip(event, data, x, xScale, yScale)}
            onMouseLeave={event => props.hideTooltip()}
          />
          {props.tooltipData && (
            <g>
              <Line
                from={{ x: props.tooltipLeft, y: 0 }}
                to={{ x: props.tooltipLeft, y: yMax }}
                stroke="rgba(92, 119, 235, 1.000)"
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
                strokeDasharray="2,2"
              />
              <circle
                cx={props.tooltipLeft}
                cy={props.tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
              />
              <circle
                cx={props.tooltipLeft}
                cy={props.tooltipTop}
                r={4}
                fill="rgba(92, 119, 235, 1.000)"
                stroke="white"
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
              />
            </g>
          )}
        </Group>
      </svg>
    );
    return (
      <Box>
        {chart}
        {props.tooltipData && (
          <div>
            <Tooltip
              top={props.tooltipTop - 12}
              left={calculateLeftTooltip()}
              style={{
                backgroundColor: 'rgba(92, 119, 235, 1.000)',
                color: 'white'
              }}
            >
              {y(props.tooltipData)}
            </Tooltip>
            <Tooltip top={yMax - 14} left={calculateLeftTooltip() - 25}>
              {formatDate(x(props.tooltipData))}
            </Tooltip>
          </div>
        )}
      </Box>
    );
  },
  areEqual
);

export default React.memo(withTooltip(SnapshotHistoryChart), areEqual);
