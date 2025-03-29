import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  title?: string;
  colorScheme?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  valueFormatter?: (value: number, max: number) => string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  title,
  colorScheme = 'blue',
  size = 'md',
  showValue = true,
  valueFormatter,
  className = ''
}) => {
  // Calculate percentage
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  // Default value formatter
  const defaultFormatter = (value: number, max: number) => `${value} / ${max}`;
  
  // Format value
  const formattedValue = valueFormatter ? valueFormatter(value, max) : defaultFormatter(value, max);
  
  // Color mapping
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };
  
  // Size mapping
  const sizeMap = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };
  
  // Calculate color based on percentage
  const getColorByPercentage = () => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  // Use provided color or calculate based on percentage
  const barColor = colorScheme === 'blue' ? getColorByPercentage() : colorMap[colorScheme];
  
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {showValue && (
            <span className="text-sm text-gray-600">{formattedValue}</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <div
          className={`${barColor} rounded-full transition-all duration-300 ease-in-out ${sizeMap[size]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      
      {!title && showValue && (
        <div className="mt-1 text-sm text-right text-gray-600">
          {formattedValue}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
