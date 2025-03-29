// Utility functions for data export

/**
 * Convert data to CSV format
 * @param data Array of objects to convert to CSV
 * @param headers Optional custom headers (defaults to object keys)
 * @returns CSV string
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Use provided headers or extract from first data object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = csvHeaders.join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return csvHeaders.map(header => {
      // Handle nested properties (e.g., "team.name")
      const value = header.split('.').reduce((obj, key) => obj && obj[key], item);
      
      // Format the value for CSV
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if needed
        const escaped = value.replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') 
          ? `"${escaped}"` 
          : escaped;
      } else if (typeof value === 'object') {
        // Stringify objects/arrays and escape
        const escaped = JSON.stringify(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }
      return String(value);
    }).join(',');
  });
  
  // Combine header and data rows
  return [headerRow, ...rows].join('\n');
}

/**
 * Generate a downloadable CSV file from data
 * @param data The data to export
 * @param filename The name of the file to download
 * @param headers Optional custom headers
 */
export function downloadCSV(data: any[], filename: string, headers?: string[]): void {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format data for Excel export via XLSX library
 * Note: In a real application, you would use a library like xlsx or exceljs
 * This is a simplified version that creates a CSV that Excel can open
 */
export function downloadExcel(data: any[], filename: string, headers?: string[]): void {
  // For now, reuse CSV functionality - in a real app, use a proper Excel library
  downloadCSV(data, `${filename}.xlsx`, headers);
}

/**
 * Format object for PDF export
 * Note: In a real application, you would use a library like jsPDF or pdfmake
 * @param data The data to format for PDF
 * @param title The title for the PDF document
 */
export function formatForPDF(data: any[], title: string): any {
  // This is just a placeholder - in a real app, use a proper PDF generation library
  return {
    title,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Helper function to normalize export parameters
 * @param type Export format (csv, excel, pdf)
 * @param dataSource Data source to export (jira, git, team, member, sprint, all)
 * @param dateRange Date range for data (week, month, quarter, year, custom)
 * @param teamId Optional team ID to filter data
 * @param startDate Optional start date for custom range
 * @param endDate Optional end date for custom range
 */
export function normalizeExportParams(
  type: string,
  dataSource: string,
  dateRange: string,
  teamId?: string,
  startDate?: string,
  endDate?: string
): any {
  // Validate export type
  const validTypes = ['csv', 'excel', 'pdf'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid export type: ${type}. Must be one of: ${validTypes.join(', ')}`);
  }
  
  // Validate data source
  const validSources = ['jira', 'git', 'team', 'member', 'sprint', 'all'];
  if (!validSources.includes(dataSource)) {
    throw new Error(`Invalid data source: ${dataSource}. Must be one of: ${validSources.join(', ')}`);
  }
  
  // Validate date range
  const validRanges = ['week', 'month', 'quarter', 'year', 'custom'];
  if (!validRanges.includes(dateRange)) {
    throw new Error(`Invalid date range: ${dateRange}. Must be one of: ${validRanges.join(', ')}`);
  }
  
  // If custom date range, ensure both start and end dates are provided
  if (dateRange === 'custom' && (!startDate || !endDate)) {
    throw new Error('Custom date range requires both startDate and endDate parameters');
  }
  
  // Calculate dates if not custom range
  let calculatedStartDate: string | undefined;
  let calculatedEndDate: string | undefined;
  
  if (dateRange !== 'custom') {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }
    
    calculatedStartDate = startDate.toISOString().split('T')[0];
    calculatedEndDate = endDate.toISOString().split('T')[0];
  } else {
    calculatedStartDate = startDate;
    calculatedEndDate = endDate;
  }
  
  return {
    type,
    dataSource,
    dateRange,
    teamId,
    startDate: calculatedStartDate,
    endDate: calculatedEndDate
  };
}
