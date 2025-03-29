import React from 'react';

export type DataSource = 'jira' | 'git' | 'integrated';

interface DataSourceToggleProps {
  value: DataSource;
  onChange: (value: DataSource) => void;
  className?: string;
}

const DataSourceToggle: React.FC<DataSourceToggleProps> = ({ 
  value, 
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex border border-gray-300 rounded-lg overflow-hidden shadow-sm ${className}`}>
      <button
        className={`flex-1 py-2 px-4 text-sm font-medium ${
          value === 'jira'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onChange('jira')}
      >
        <div className="flex items-center justify-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 3l9 9-9 9-9-9z" />
            <path d="M12 21V3" />
          </svg>
          <span>JIRA</span>
        </div>
      </button>
      
      <button
        className={`flex-1 py-2 px-4 text-sm font-medium ${
          value === 'git'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onChange('git')}
      >
        <div className="flex items-center justify-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M2 12.5C2 9.46 4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5a2.5 2.5 0 0 1 0-5H17" />
          </svg>
          <span>Git</span>
        </div>
      </button>
      
      <button
        className={`flex-1 py-2 px-4 text-sm font-medium ${
          value === 'integrated'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onChange('integrated')}
      >
        <div className="flex items-center justify-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="17 2 12 7 7 2" />
            <polyline points="2 17 7 12 2 7" />
            <polyline points="22 7 17 12 22 17" />
            <polyline points="7 22 12 17 17 22" />
          </svg>
          <span>Integrated</span>
        </div>
      </button>
    </div>
  );
};

export default DataSourceToggle;
