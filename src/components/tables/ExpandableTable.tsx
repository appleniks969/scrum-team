import React, { useState } from 'react';

interface Column {
  key: string;
  header: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ExpandableTableProps {
  data: any[];
  columns: Column[];
  renderExpandedRow: (row: any) => React.ReactNode;
  keyField: string;
  className?: string;
  emptyMessage?: string;
  initialExpandedRows?: string[];
  loading?: boolean;
}

const ExpandableTable: React.FC<ExpandableTableProps> = ({
  data,
  columns,
  renderExpandedRow,
  keyField,
  className = '',
  emptyMessage = 'No data available',
  initialExpandedRows = [],
  loading = false
}) => {
  const [expandedRows, setExpandedRows] = useState<string[]>(initialExpandedRows);

  const toggleRowExpansion = (rowKey: string) => {
    if (expandedRows.includes(rowKey)) {
      setExpandedRows(expandedRows.filter(key => key !== rowKey));
    } else {
      setExpandedRows([...expandedRows, rowKey]);
    }
  };

  const isRowExpanded = (rowKey: string) => {
    return expandedRows.includes(rowKey);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 w-full"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center py-4 space-x-4 px-6 border-t border-gray-200">
              <div className="h-10 bg-gray-200 w-full rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Expand</span>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row) => {
                const rowKey = row[keyField]?.toString() || '';
                const expanded = isRowExpanded(rowKey);
                
                return (
                  <React.Fragment key={rowKey}>
                    <tr className={expanded ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRowExpansion(rowKey)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          aria-expanded={expanded}
                        >
                          <svg
                            className={`h-5 w-5 transform transition-transform duration-200 ${
                              expanded ? 'rotate-90' : ''
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
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
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key]}
                        </td>
                      ))}
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={columns.length + 1} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                          {renderExpandedRow(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandableTable;
