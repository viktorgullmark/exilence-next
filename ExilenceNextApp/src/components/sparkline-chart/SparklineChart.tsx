import React from 'react';
import { VictoryGroup, VictoryArea } from 'victory';

const SparklineChart = ({ data, internalName, color, height, width }: any) => (
  <VictoryGroup
    width={width}
    height={height}
    animate={{
      duration: 2000,
      onLoad: { duration: 1000 },
    }}
    domainPadding={{ x: 0, y: 5 }}
    padding={{ top: 0, bottom: 0, right: 0, left: 0 }}
    data={data}
    style={{
      data: { strokeWidth: 1, fillOpacity: 0.4, fill: `url(#${internalName})`, stroke: color },
    }}
  >
    <defs>
      <linearGradient id={internalName} x1="0%" y="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <VictoryArea interpolation="natural" />
  </VictoryGroup>
);

export default SparklineChart;
