import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable, { Column } from '../DataTable';

interface TestData {
  id: number;
  name: string;
  age: number;
  email: string;
}

describe('DataTable Component', () => {
  const testData: TestData[] = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 40, email: 'bob@example.com' }
  ];

  const columns: Column<TestData>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'age', header: 'Age', sortable: true },
    { key: 'email', header: 'Email' }
  ];

  it('renders the table with data', () => {
    render(
      <DataTable
        data={testData}
        columns={columns}
        keyField="id"
      />
    );

    // Check column headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();

    // Check data rows
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    render(
      <DataTable
        data={testData}
        columns={columns}
        keyField="id"
        loading={true}
      />
    );

    expect(screen.getAllByClassName('animate-pulse').length).toBeGreaterThan(0);
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('sorts the table when clicking on a sortable column header', () => {
    render(
      <DataTable
        data={testData}
        columns={columns}
        keyField="id"
      />
    );

    // Get the first sortable column (Name)
    const nameColumnHeader = screen.getByText('Name').closest('th');
    
    // Initial order: John, Jane, Bob
    const rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('John Doe');
    expect(rows[2].textContent).toContain('Jane Smith');
    expect(rows[3].textContent).toContain('Bob Johnson');

    // Click to sort
    if (nameColumnHeader) {
      fireEvent.click(nameColumnHeader);
    }

    // After sort (asc): Bob, Jane, John
    const sortedRows = screen.getAllByRole('row');
    expect(sortedRows[1].textContent).toContain('Bob Johnson');
    expect(sortedRows[2].textContent).toContain('Jane Smith');
    expect(sortedRows[3].textContent).toContain('John Doe');
  });

  it('calls onRowClick when a row is clicked', () => {
    const mockOnRowClick = jest.fn();
    render(
      <DataTable
        data={testData}
        columns={columns}
        keyField="id"
        onRowClick={mockOnRowClick}
      />
    );

    // Find the first row and click it
    const rows = screen.getAllByRole('row');
    fireEvent.click(rows[1]); // First data row (index 0 is header)

    expect(mockOnRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('renders row actions correctly', () => {
    const mockActionClick = jest.fn();
    const rowActions = [
      {
        label: 'Edit',
        onClick: mockActionClick
      },
      {
        label: 'Delete',
        onClick: mockActionClick,
        confirmText: 'Are you sure you want to delete this item?'
      }
    ];

    render(
      <DataTable
        data={testData}
        columns={columns}
        keyField="id"
        rowActions={rowActions}
      />
    );

    // Check if actions column is present
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    // Check if action buttons are rendered
    expect(screen.getAllByText('Edit').length).toBe(testData.length);
    expect(screen.getAllByText('Delete').length).toBe(testData.length);

    // Click an action
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockActionClick).toHaveBeenCalledWith(testData[0]);
  });
});
