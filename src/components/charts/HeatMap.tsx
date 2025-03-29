import React from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';

interface HeatMapProps {
  data: {
    name: string;
    x: number;
    y: number;
    value: number;
  }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  colorRange?: [string, string]; // [minColor, maxColor]
}

const HeatMap: React.FC<HeatMapProps> = ({
  data,
  title,
  xAxisLabel = 'X Axis',
  yAxisLabel = 'Y Axis',
  height = 300,
  colorRange = ['#e6f7ff', '#0050b3']
}) => {
  // Find min and max values
  const minValue = Math.min(...data.map(item => item.value));
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Function to get color based on value
  const getColor = (value: number) => {
    if (minValue === maxValue) return colorRange[1];
    
    const ratio = (value - minValue) / (maxValue - minValue);
    
    // Create interpolated color
    const startColor = colorRange[0];
    const endColor = colorRange[1];
    
    // Parse colors
    const startR = parseInt(startColor.substring(1, 3), 16);
    const startG = parseInt(startColor.substring(3, 5), 16);
    const startB = parseInt(startColor.substring(5, 7), 16);
    
    const endR = parseInt(endColor.substring(1, 3), 16);
    const endG = parseInt(endColor.substring(3, 5), 16);
    const endB = parseInt(endColor.substring(5, 7), 16);
    
    // Interpolate
    const r = Math.round(startR + ratio * (endR - startR));
    const g = Math.round(startG + ratio * (endG - startG));
    const b = Math.round(startB + ratio * (endB - startB));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 shadow-md rounded">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{`${xAxisLabel}: ${data.x}`}</p>
          <p className="text-sm">{`${yAxisLabel}: ${data.y}`}</p>
          <p className="text-sm font-medium">{`Value: ${data.value}`}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && (
        <h3 className="text-lg font-medium mb-4 text-gray-900">{title}</h3>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <XAxis
              type="number"
              dataKey="x"
              name={xAxisLabel}
              label={{ value: xAxisLabel, position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yAxisLabel}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#666" />
            <ReferenceLine y={0} stroke="#666" />
            <Scatter name="Values" data={data} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.value)} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HeatMap;
