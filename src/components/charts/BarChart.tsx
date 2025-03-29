import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DataPoint {
  [key: string]: any;
}

interface BarChartProps {
  data: DataPoint[];
  xAxisKey: string;
  bars: {
    key: string;
    name: string;
    color: string;
  }[];
  title?: string;
  height?: number;
  layout?: 'vertical' | 'horizontal';
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisKey,
  bars,
  title,
  height = 300,
  layout = 'horizontal'
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && (
        <h3 className="text-lg font-medium mb-4 text-gray-900">{title}</h3>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {layout === 'horizontal' ? (
            <RechartsBarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {bars.map((bar) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={bar.color}
                />
              ))}
            </RechartsBarChart>
          ) : (
            <RechartsBarChart
              layout="vertical"
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey={xAxisKey} type="category" width={100} />
              <Tooltip />
              <Legend />
              {bars.map((bar) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={bar.color}
                />
              ))}
            </RechartsBarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
