import { fileSafe, todayStr } from "../utils";
import { EXCEL_COLUMN_CONFIG } from "../../config/export_excel_config";

// Export data to CSV file
export async function ExportToCSV({
  data,
  category = null,
  t = (x) => x,
  fileName = "exported_data",
  onStart,
  onFinish,
  onError
}) {
  if (!data) {
    onError?.(new Error("No data provided for CSV export."));
    return;
  }

  try {
    onStart?.();

    // Single page export - flat data only
    if (Array.isArray(data)) {
      const configKey = category ? `${category}` : null;
      const config = configKey ? EXCEL_COLUMN_CONFIG[configKey] : null;

      if (!config) {
        console.warn(`No column config found for category: ${configKey}`);
        throw new Error(`No column config found for category: ${configKey}`);
      }

      // Pass translation function to generateCSVContent
      const csvContent = generateCSVContent(data, config.columns, t);
      
      // Optionally translate the file name if it's a translation key
      const translatedFileName = t(fileName) || fileName;
      const safeName = fileSafe(translatedFileName);
      const fullName = `${safeName}_${todayStr()}.csv`;

      downloadCSV(csvContent, fullName);
      onFinish?.(fullName);
    } else {
      throw new Error("CSV export only supports single page data exports (arrays).");
    }

  } catch (err) {
    console.error("CSV export failed:", err);
    onError?.(err);
  }
}

// Helper function to generate CSV content
function generateCSVContent(data, columns, t = (x) => x) {
  // Translate headers if translation function is provided
  const headers = columns.map(col => t(col.header) || col.header);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.map(header => escapeCSVField(header)).join(','));

  // Add data rows
  data.forEach(item => {
    const row = columns.map(col => {
      const value = item[col.key];
      return escapeCSVField(value);
    });
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

// Helper function to escape CSV fields
function escapeCSVField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
}

// Helper function to download CSV file
function downloadCSV(content, filename) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Legacy function for backward compatibility
export function exportToCSV(data) {
  console.log("Exporting to CSV", data);
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Use the first item to determine headers
  const headers = Object.keys(data[0]);
  const csvContent = generateCSVContent(data, headers.map(key => ({ key, header: key })));
  const filename = `export_${todayStr()}.csv`;
  
  downloadCSV(csvContent, filename);
}