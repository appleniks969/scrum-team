import React from 'react';
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis
} from 'recharts';

interface DataPoint {
  [key: string]: any;
}

interface ScatterChartProps {
  data: DataPoint[];
  xAxisKey: string;
  yAxisKey: string;
  zAxisKey?: string;
  name: string;
  color: string;
  title?: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const CustomTooltip = ({ active, payload, label, xAxisKey, yAxisKey, zAxisKey }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-semibold">{data.name || 'Point'}</p>
        <p className="text-sm">
          {xAxisKey}: <span className="font-medium">{data[xAxisKey]}</span>
        </p>
        <p className="text-sm">
          {yAxisKey}: <span className="font-medium">{data[yAxisKey]}</span>
        </p>
        {zAxisKey && (
          <p className="text-sm">
            {zAxisKey}: <span className="font-medium">{data[zAxisKey]}</span>
          </p>
        )}
      </div>
    );
  }

  return null;
};

const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  xAxisKey,
  yAxisKey,
  zAxisKey,
  name,
  color,
  title,
  height = 300,
  xAxisLabel,
  yAxisLabel
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && (
        <h3 className="text-lg font-medium mb-4 text-gray-900">{title}</h3>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey={xAxisKey} 
              name={xAxisLabel || xAxisKey} 
              label={{ 
                value: xAxisLabel || xAxisKey, 
                position: 'insideBottom', 
                offset: -10 
              }} 
            />
            <YAxis 
              type="number" 
              dataKey={yAxisKey} 
              name={yAxisLabel || yAxisKey} 
              label={{ 
                value: yAxisLabel || yAxisKey, 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            {zAxisKey && (
              <ZAxis type="number" dataKey={zAxisKey} range={[50, 500]} />
            )}
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              content={<CustomTooltip xAxisKey={xAxisKey} yAxisKey={yAxisKey} zAxisKey={zAxisKey} />} 
            />
            <Legend />
            <Scatter name={name} data={data} fill={color} />
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterChart;
