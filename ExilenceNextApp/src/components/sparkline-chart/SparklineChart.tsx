import React from 'react';
import { VictoryGroup, VictoryArea } from 'victory';
import { Box } from '@mui/material';

const SparklineChart = ({
  data,
  internalName,
  color,
  height,
  width,
  domainPadding = { x: 0, y: 0 },
}: any) => (
  <Box width={width} height={height} position="relative">
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={internalName} x1="0%" y="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
    <VictoryGroup
      width={width}
      height={height}
      animate={{
        duration: 2000,
        onLoad: { duration: 1000 },
      }}
      domainPadding={domainPadding}
      padding={{ top: 0, bottom: 0, right: 0, left: 0 }}
      data={data}
      style={{
        parent: { position: 'absolute', top: 0 },
        data: { strokeWidth: 2, fillOpacity: 0.4, fill: `url(#${internalName})`, stroke: color },
      }}
    >
      <VictoryArea interpolation="basis" />
    </VictoryGroup>
  </Box>
);

export default SparklineChart;
