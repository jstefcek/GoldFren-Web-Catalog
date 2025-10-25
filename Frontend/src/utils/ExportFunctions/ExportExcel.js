import { fileSafe, todayStr } from "../utils";
import { EXCEL_COLUMN_CONFIG } from "../../config/export_excel_config";

// Export data to Excel (.xlsx) file
export async function ExportToExcel({
  data,
  category = null,
  t = (x) => x,
  fileName = "exported_data",
  onStart,
  onFinish,
  onError
}) {
  if (!data) {
    onError?.(new Error("No data provided for Excel export."));
    return;
  }

  try {
    onStart?.();

    // Dynamically import xlsx to reduce initial bundle size
    const { writeFile, utils } = await import("xlsx");
    const wb = utils.book_new();
    wb.Workbook = { Tables: [] };

    const { tableStyle } = EXCEL_COLUMN_CONFIG;

    // Multi-category export for SortimentDetail
    if (!Array.isArray(data) && typeof data === "object") {
      for (const [catKey, catData] of Object.entries(data)) {
        const items = catData?.items || [];
        if (!items.length) continue;

        const sheetName = (t?.(catKey) || catKey).toString();

        const config = EXCEL_COLUMN_CONFIG[`${catKey}_sortiment`];
        if (!config) {
          console.warn(`Missing Excel column config for: ${catKey}_sortiment`);
          continue;
        }

        const { columns } = config;
        const headers = columns.map((col) => col.header);

        // Map data rows based on config keys
        const rows = items.map((item) =>
          columns.reduce((acc, col) => {
            acc[col.header] = item[col.key];
            return acc;
          }, {})
        );

        const ws = utils.json_to_sheet(rows, { header: headers, skipHeader: false });
        ws["!cols"] = headers.map((h) => ({ wch: Math.min(Math.max(h.length + 6, 12), 40) }));

        // Add autofilter
        const lastCol = utils.encode_col(headers.length - 1);
        const lastRow = rows.length + 1;
        const range = `A1:${lastCol}${lastRow}`;
        ws["!autofilter"] = { ref: range };

        // Add table definition
        const tableName = `Table_${sheetName.replace(/[^A-Za-z0-9]/g, "")}`;
        ws["!table"] = {
          ref: range,
          name: tableName,
          totalsRow: false,
          headerRow: true,
          style: tableStyle,
          columns: headers.map((h) => ({ name: h }))
        };

        utils.book_append_sheet(wb, ws, sheetName);
        wb.Workbook.Tables.push({
          name: tableName,
          ref: range,
          ...tableStyle
        });
      }
    }

    // Flat data export in DataGrid or single category
    else if (Array.isArray(data)) {
      const configKey = category ? `${category}` : null;
      const config = configKey ? EXCEL_COLUMN_CONFIG[configKey] : null;

      if (!config) {
        console.warn(`No Excel column config found for category: ${configKey}`);
        throw new Error(`No Excel column config found for category: ${configKey}`);
      }

      const { columns } = config;
      const headers = columns.map((col) => col.header);

      const rows = data.map((item) =>
        columns.reduce((acc, col) => {
          acc[col.header] = item[col.key];
          return acc;
        }, {})
      );

      const ws = utils.json_to_sheet(rows, { header: headers, skipHeader: false });
      ws["!cols"] = headers.map((h) => ({ wch: Math.min(Math.max(h.length + 6, 12), 40) }));

      const lastCol = utils.encode_col(headers.length - 1);
      const lastRow = rows.length + 1;
      const range = `A1:${lastCol}${lastRow}`;
      ws["!autofilter"] = { ref: range };

      const tableName = `Table_${(category || "Sheet").replace(/[^A-Za-z0-9]/g, "")}`;
      ws["!table"] = {
        ref: range,
        name: tableName,
        totalsRow: false,
        headerRow: true,
        style: tableStyle,
        columns: headers.map((h) => ({ name: h }))
      };

      utils.book_append_sheet(wb, ws, t(category) || "Data");
      wb.Workbook.Tables.push({
        name: tableName,
        ref: range,
        ...tableStyle
      });
    }

    // Check file name safety and append date
    const safeName = fileSafe(fileName);
    const fullName = `${safeName}_${todayStr()}.xlsx`;

    // Write file with compression
    await writeFile(wb, fullName, { compression: true });
    onFinish?.(fullName);
  } catch (err) {
    console.error("Excel export failed:", err);
    onError?.(err);
  }
}