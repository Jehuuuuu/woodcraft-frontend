// Utility functions for printing and exporting dashboard data

/**
 * Prints the specified element by creating a new window with only that content
 * @param {string} elementId - The ID of the element to print
 * @param {string} title - The title for the print window
 */
export const printElement = (elementId, title) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank', 'height=600,width=800');
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .chart-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          .chart-description { color: #666; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

/**
 * Exports data to CSV format and triggers download
 * @param {Array} data - The data to export
 * @param {string} filename - The name of the file to download
 */
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;
  
  // Get headers from first object keys
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => headers.map(header => {
      // Handle values that might contain commas by wrapping in quotes
      const value = row[header];
      return `"${value}"`;
    }).join(','))
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};