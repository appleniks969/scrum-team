import React from 'react';
import { CorrelationInsight } from '../../hooks/useIntegratedMetrics';

interface InsightCardProps {
  insight: CorrelationInsight;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, className = '' }) => {
  // Color and icon mapping based on severity
  const severityMap = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
    critical: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    },
    positive: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    }
  };
  
  // Trend icon
  const getTrendIcon = () => {
    switch (insight.trend) {
      case 'up':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 ${insight.severity === 'warning' || insight.severity === 'critical' ? 'text-red-500' : 'text-green-500'}`}
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        );
      case 'down':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 ${insight.severity === 'warning' || insight.severity === 'critical' ? 'text-green-500' : 'text-red-500'}`}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        );
      case 'stable':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-gray-500"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  const severity = severityMap[insight.severity];
  
  return (
    <div 
      className={`p-4 rounded-lg border ${severity.bgColor} ${severity.borderColor} ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 p-1.5 rounded-full ${severity.iconBg} ${severity.iconColor}`}>
          {severity.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${severity.textColor}`}>
              {insight.metricName}
            </h3>
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              {insight.trendPercentage && (
                <span className="text-xs font-medium">
                  {insight.trendPercentage}%
                </span>
              )}
            </div>
          </div>
          
          <p className="mt-1 text-sm text-gray-700">
            {insight.insightText}
          </p>
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {insight.type === 'team' ? 'Team: ' : 'Member: '}
              {insight.targetName}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(insight.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
