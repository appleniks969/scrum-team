import React, { useState } from 'react';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

interface ExpandableDataTableProps {
  data: any[];
  columns: Column[];
  keyField: string;
  renderExpanded: (row: any) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const ExpandableDataTable: React.FC<ExpandableDataTableProps> = ({
  data,
  columns,
  keyField,
  renderExpanded,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const isRowExpanded = (id: string) => expandedRows.has(id);

  if (isLoading) {
    return (
      <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 mb-2"></div>
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="h-12 bg-gray-100 mb-1"
              style={{opacity: 1 - index * 0.15}}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
        <div className="p-6 text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="relative px-3 py-3 w-10">
                <span className="sr-only">Expand</span>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.width ? column.width : ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => {
              const rowId = row[keyField].toString();
              const expanded = isRowExpanded(rowId);
              
              return (
                <React.Fragment key={rowId}>
                  <tr className={expanded ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-3 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleRow(rowId)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <svg
                          className={`h-5 w-5 transition-transform ${
                            expanded ? 'transform rotate-90' : ''
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                    {columns.map((column) => (
                      <td
                        key={`${rowId}-${column.key}`}
                        className={`px-6 py-4 whitespace-nowrap text-${column.align || 'left'}`}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                  {expanded && (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        {renderExpanded(row)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandableDataTable;
