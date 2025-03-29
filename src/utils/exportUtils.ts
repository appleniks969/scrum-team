// Export utility functions

/**
 * Converts an array of objects to CSV format
 * @param data Array of objects to convert
 * @param columns Optional specific columns to include
 * @returns CSV string
 */
export const convertToCSV = <T extends Record<string, any>>(
  data: T[],
  columns?: (keyof T)[]
): string => {
  if (!data || !data.length) return '';

  // Determine columns to include
  const headers: (keyof T)[] = columns || Object.keys(data[0]) as (keyof T)[];

  // Create CSV header row
  const headerRow = headers.map(header => `"${String(header)}"`).join(',');

  // Create data rows
  const rows = data.map(row => {
    return headers
      .map(header => {
        const value = row[header];
        
        // Handle different data types
        if (value === null || value === undefined) return '""';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        return `"${value}"`;
      })
      .join(',');
  });

  // Combine header and rows
  return [headerRow, ...rows].join('\n');
};

/**
 * Downloads data as a CSV file
 * @param data Array of objects to download
 * @param filename Name of the file
 * @param columns Optional specific columns to include
 */
export const downloadCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: (keyof T)[]
): void => {
  const csv = convertToCSV(data, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Downloads data as a JSON file
 * @param data Data to download
 * @param filename Name of the file
 */
export const downloadJSON = <T>(data: T, filename: string): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
