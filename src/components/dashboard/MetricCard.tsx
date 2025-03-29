import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'purple' | 'indigo' | 'red' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue' 
}) => {
  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50';
      case 'green': return 'bg-green-50';
      case 'purple': return 'bg-purple-50';
      case 'indigo': return 'bg-indigo-50';
      case 'red': return 'bg-red-50';
      case 'yellow': return 'bg-yellow-50';
      default: return 'bg-blue-50';
    }
  };
  
  const getIconColor = () => {
    switch (color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'purple': return 'text-purple-500';
      case 'indigo': return 'text-indigo-500';
      case 'red': return 'text-red-500';
      case 'yellow': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
      <div className={`rounded-full p-2 ${getBgColor()} mr-4 flex items-center justify-center w-10 h-10`}>
        <div className={getIconColor()}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 MetricCard-value">{value}</p>
        {trend !== undefined && (
          <p className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
