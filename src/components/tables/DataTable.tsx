import React, { useState, useMemo } from 'react';

export interface Column<T = any> {
  key: string;
  header: string;
  accessorFn?: (row: T) => any;
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

export interface ExpandableConfig<T = any> {
  expandedRowRender: (row: T) => React.ReactNode;
  expandedRowClassName?: string;
  rowExpandable?: (row: T) => boolean;
}

export interface RowAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  className?: string;
  confirmText?: string; // If provided, will show a confirmation dialog
}

interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  keyField: string;
  loading?: boolean;
  expandable?: ExpandableConfig<T>;
  pagination?: {
    pageSize: number;
    currentPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  className?: string;
  rowActions?: RowAction<T>[];
  actionsColumn?: {
    header?: string;
    width?: string;
    position?: 'start' | 'end';
  };
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const DataTable = <T extends Record<string, any>>({{
  data,
  columns,
  keyField,
  loading = false,
  expandable,
  pagination,
  onRowClick,
  className = '',
  rowActions = [],
  actionsColumn = { header: 'Actions', position: 'end' }
}: DataTableProps<T>) => {{
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const column = columns.find(col => col.key === sortField);
      const aValue = column?.accessorFn ? column.accessorFn(a) : a[sortField];
      const bValue = column?.accessorFn ? column.accessorFn(b) : b[sortField];

      // Handle different types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [data, sortField, sortDirection, columns]);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const { pageSize, currentPage } = pagination;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  // Handle sorting change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (rowKey: string) => {
    setExpandedRowKeys(keys => {
      if (keys.includes(rowKey)) {
        return keys.filter(key => key !== rowKey);
      } else {
        return [...keys, rowKey];
      }
    });
  };

  // Check if row is expandable
  const isRowExpandable = (row: T) => {
    if (!expandable) return false;
    if (expandable.rowExpandable) return expandable.rowExpandable(row);
    return true;
  };

  // Get row key
  const getRowKey = (row: T) => String(row[keyField]);

  // Handle action click with confirmation if needed
  const handleActionClick = (action: RowAction<T>, row: T) => {
    if (action.confirmText) {
      setConfirmDialog({
        isOpen: true,
        title: 'Confirm Action',
        message: action.confirmText,
        onConfirm: () => {
          action.onClick(row);
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      action.onClick(row);
    }
  };

  // Close the confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Render row actions dropdown
  const renderRowActions = (row: T) => {
    if (rowActions.length === 0) return null;
    
    return (
      <div className="flex justify-end items-center space-x-2">
        {rowActions.length <= 2 ? (
          // Render as buttons if 2 or fewer actions
          rowActions.map((action, index) => {
            const isDisabled = action.disabled ? action.disabled(row) : false;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDisabled) handleActionClick(action, row);
                }}
                disabled={isDisabled}
                className={`p-1.5 rounded-md text-sm font-medium ${
                  isDisabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                } ${action.className || ''}`}
                title={action.label}
              >
                {action.icon ? (
                  action.icon
                ) : (
                  <span>{action.label}</span>
                )}
              </button>
            );
          })
        ) : (
          // Render as dropdown if more than 2 actions
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id={`row-actions-menu-${getRowKey(row)}`}
                aria-expanded="true"
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  const menu = document.getElementById(`row-actions-${getRowKey(row)}`);
                  if (menu) {
                    menu.classList.toggle('hidden');
                  }
                }}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div
              id={`row-actions-${getRowKey(row)}`}
              className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby={`row-actions-menu-${getRowKey(row)}`}
              tabIndex={-1}
            >
              <div className="py-1" role="none">
                {rowActions.map((action, index) => {
                  const isDisabled = action.disabled ? action.disabled(row) : false;
                  return (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        const menu = document.getElementById(`row-actions-${getRowKey(row)}`);
                        if (menu) {
                          menu.classList.add('hidden');
                        }
                        if (!isDisabled) handleActionClick(action, row);
                      }}
                      disabled={isDisabled}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDisabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${action.className || ''}`}
                      role="menuitem"
                      tabIndex={-1}
                    >
                      <div className="flex items-center">
                        {action.icon && <span className="mr-2">{action.icon}</span>}
                        <span>{action.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render table header
  const renderTableHeader = () => {
    return (
      <thead className="bg-gray-50">
        <tr>
          {expandable && (
            <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="sr-only">Expand</span>
            </th>
          )}
          {actionsColumn.position === 'start' && rowActions.length > 0 && (
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${actionsColumn.width || 'w-24'}`}
            >
              {actionsColumn.header || 'Actions'}
            </th>
          )}
          
          {columns.map(column => (
            <th
              key={column.key}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                column.sortable ? 'cursor-pointer select-none' : ''
              } ${column.className || ''} ${column.width || ''}`}
              onClick={column.sortable ? () => handleSortChange(column.key) : undefined}
            >
              <div className="flex items-center group">
                {column.header}
                {column.sortable && (
                  <span className="ml-2">
                    {sortField === column.key ? (
                      sortDirection === 'asc' ? (
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      )
                    ) : (
                      <svg className="h-4 w-4 text-gray-300 group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                      </svg>
                    )}
                  </span>
                )}
              </div>
            </th>
          ))}
          
          {actionsColumn.position !== 'start' && rowActions.length > 0 && (
            <th
              className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${actionsColumn.width || 'w-24'}`}
            >
              {actionsColumn.header || 'Actions'}
            </th>
          )}
        </tr>
      </thead>
    );
  };

  // Render table rows
  const renderTableRows = () => {
    return paginatedData.map(row => {
      const rowKey = getRowKey(row);
      const isExpanded = expandedRowKeys.includes(rowKey);
      const canExpand = expandable && isRowExpandable(row);

      return (
        <React.Fragment key={rowKey}>
          <tr
            className={`bg-white hover:bg-gray-50 transition-colors ${
              onRowClick ? 'cursor-pointer' : ''
            }`}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {expandable && (
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {canExpand && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleRowExpansion(rowKey);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                  >
                    <svg
                      className={`h-4 w-4 text-gray-500 transition-transform ${
                        isExpanded ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </td>
            )}
            {actionsColumn.position === 'start' && rowActions.length > 0 && (
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                {renderRowActions(row)}
              </td>
            )}
            
            {columns.map(column => {
              const value = column.accessorFn ? column.accessorFn(row) : row[column.key];
              return (
                <td key={column.key} className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}>
                  {column.cell ? column.cell(value, row) : value}
                </td>
              );
            })}
            
            {actionsColumn.position !== 'start' && rowActions.length > 0 && (
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                {renderRowActions(row)}
              </td>
            )}
          </tr>
          {canExpand && isExpanded && (
            <tr className={`bg-gray-50 ${expandable.expandedRowClassName || ''}`}>
              <td colSpan={columns.length + (expandable ? 1 : 0)} className="px-6 py-4">
                {expandable.expandedRowRender(row)}
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });
  };

  // Render loading state
  const renderLoadingRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={`loading-${index}`} className="animate-pulse">
        {expandable && <td className="px-3 py-4">&nbsp;</td>}
        {actionsColumn.position === 'start' && rowActions.length > 0 && (
          <td className="px-3 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
        )}
        {columns.map(column => (
          <td key={`${column.key}-${index}`} className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
        ))}
        {actionsColumn.position !== 'start' && rowActions.length > 0 && (
          <td className="px-3 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
        )}
      </tr>
    ));
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    const { currentPage, totalItems, pageSize, onPageChange } = pagination;
    const totalPages = Math.ceil(totalItems / pageSize);

    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, totalItems)}
              </span>{' '}
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === 1
                    ? 'cursor-not-allowed'
                    : 'hover:text-blue-700'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Simplified pagination with just numbers */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === totalPages
                    ? 'cursor-not-allowed'
                    : 'hover:text-blue-700'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {renderTableHeader()}
          <tbody className="divide-y divide-gray-200">
            {loading ? renderLoadingRows() : renderTableRows()}
          </tbody>
        </table>
      </div>
      {renderPagination()}
      
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
};

export default DataTable;
