import React from 'react';

interface LoadingStateProps {
  height?: string | number;
  message?: string;
  type?: 'spinner' | 'pulse' | 'skeleton';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  height = 200, 
  message = 'Loading...', 
  type = 'spinner',
  className = ''
}) => {
  // Convert height to string with 'px' if it's a number
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  const renderLoadingIndicator = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
          </div>
        );
      
      case 'pulse':
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-blue-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-3 bg-blue-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-blue-200 rounded"></div>
                  <div className="h-3 bg-blue-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
          </div>
        );
      
      case 'skeleton':
        return (
          <div className="flex flex-col w-full">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-8 bg-gray-200 rounded col-span-1"></div>
                <div className="h-8 bg-gray-200 rounded col-span-1"></div>
                <div className="h-8 bg-gray-200 rounded col-span-1"></div>
              </div>
            </div>
            {message && <p className="mt-4 text-sm text-gray-600 text-center">{message}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`} 
      style={{ height: heightStyle }}
    >
      {renderLoadingIndicator()}
    </div>
  );
};

export default LoadingState;
