import { useEffect, useState } from "react";
import { Input } from "./ui/Custom_Input";
import { Button } from "./ui/Custom_Button";
import { 
  ArrowDownUp, 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronLeft, 
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Printer
} from "lucide-react";
import { columnsConfig } from "./Column_Config";
import { useTranslation } from "react-i18next";

const staticData = [
  {
    id: 1,
    obrazek: "https://gogen.cz/cdn/shop/files/5769201.jpg?v=1710842451",
    vektor: null,
    cislo_dilu: "4001A",
    typ: "Nové",
    prumer: 110,
    typ_uchyceni: "Radial",
    roztec_brzdice: 200,
  },
  {
    id: 2,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4002A",
    typ: "Nové",
    prumer: 150,
    typ_uchyceni: "Axis",
    roztec_brzdice: null,
  },
  {
    id: 3,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4003A",
    typ: "Nové",
    prumer: 120,
    typ_uchyceni: "Axis",
    roztec_brzdice: null,
  },
  {
    id: 4,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4004A",
    typ: "Nové",
    prumer: 100,
    typ_uchyceni: "Radial",
    roztec_brzdice: 210,
  },
  {
    id: 5,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4005A",
    typ: "Nové",
    prumer: 120,
    typ_uchyceni: "Axis",
    roztec_brzdice: null,
  },
  {
    id: 6,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4006A",
    typ: "Nové",
    prumer: 100,
    typ_uchyceni: "Radial",
    roztec_brzdice: 210,
  },
  {
    id: 7,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4007A",
    typ: "Nové",
    prumer: 120,
    typ_uchyceni: "Axis",
    roztec_brzdice: null,
  },
  {
    id: 8,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4008A",
    typ: "Nové",
    prumer: 100,
    typ_uchyceni: "Radial",
    roztec_brzdice: 210,
  },
  {
    id: 9,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4009A",
    typ: "Nové",
    prumer: 120,
    typ_uchyceni: "Axis",
    roztec_brzdice: null,
  },
  {
    id: 10,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4010A",
    typ: "Nové",
    prumer: 100,
    typ_uchyceni: "Radial",
    roztec_brzdice: 210,
  },
  {
    id: 11,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4011A",
    typ: "Nové",
    prumer: 120,
    typ_uchyceni: "Axis",
    roztec_brzdice: null,
  },
  {
    id: 12,
    obrazek: null,
    vektor: null,
    cislo_dilu: "4012A",
    typ: "Nové",
    prumer: 100,
    typ_uchyceni: "Radial",
    roztec_brzdice: 210,
  },
];

export default function DataGrid({ category = "" }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const columns = columnsConfig[category] || [];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setData(staticData);
      setIsLoading(false);
    }, 100);
  }, [category]);

  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortDirection("asc");
    }
  };

  const handleReset = () => {
    setSearch("");
    setSortColumn(null);
    setSortDirection("asc");
    setSelectedRows([]);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const filtered = data.filter((row) =>
    columns.some((col) =>
      row[col.key]?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = sortColumn
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortColumn]?.toString().toLowerCase() || "";
        const bVal = b[sortColumn]?.toString().toLowerCase() || "";
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Get selected items data for export/print
  const getSelectedItemsData = () => {
    return data.filter(item => selectedRows.includes(item.id));
  };

  const handleExportToExcel = () => {
    const itemsToExport = selectedRows.length > 0 ? getSelectedItemsData() : sorted;
    // In a real implementation, you would generate and download an Excel file
    console.log("Exporting to Excel", itemsToExport);
    alert(`${itemsToExport.length} items would be exported to Excel`);
  };

  const handleExportToCSV = () => {
    const itemsToExport = selectedRows.length > 0 ? getSelectedItemsData() : sorted;
    // In a real implementation, you would generate and download a CSV file
    console.log("Exporting to CSV", itemsToExport);
    alert(`${itemsToExport.length} items would be exported to CSV`);
  };

  const handlePrint = () => {
    const itemsToPrint = selectedRows.length > 0 ? getSelectedItemsData() : sorted;
    // In a real implementation, you would format and print the data
    console.log("Printing", itemsToPrint);
    
    // Simple print implementation - in a real app, you'd create a better print layout
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>${category || 'Data'} Print</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .print-header { margin-bottom: 20px; }
              @media print {
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>${category || 'Data'} selected data</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <p>Items: ${itemsToPrint.length}</p>
              <button class="no-print" onclick="window.print()">Print</button>
              <button class="no-print" onclick="window.close()">Close</button>
            </div>
            <table>
              <thead>
                <tr>
                  ${columns.map(col => `<th>${t(col.i18n)}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${itemsToPrint.map(row => `
                  <tr>
                    ${columns.map(col => {
                      if (col.key === 'obrazek' || col.key === 'vektor') {
                        return row[col.key] ? 
                          `<td><img src="${row[col.key]}" style="max-width: 60px; height: auto;" alt="${col.key}"></td>` : 
                          `<td>—</td>`;
                      }
                      return `<td>${row[col.key] ?? '—'}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Automatically trigger print in modern browsers
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 justify-between mb-6 items-start md:items-center">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <Input
              placeholder={t("datagrid.search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              aria-label="Search data"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleReset} 
            className="flex gap-1 items-center cursor-pointer border-gray-300 hover:bg-gray-50"
            disabled={!search && !sortColumn && selectedRows.length === 0}
          >
            <X size={16} /> {t("datagrid.reset")}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
              <span className="text-sm font-medium text-gray-700 mr-2">
                {selectedRows.length} selected
              </span>
            )}
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportToExcel}
                className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                title="Export to Excel"
              >
                <FileSpreadsheet size={16} />
                <span className="hidden sm:inline">Excel</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportToCSV}
                className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                title="Export to CSV"
              >
                <FileText size={16} />
                <span className="hidden sm:inline">CSV</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="flex items-center gap-1 text-purple-600 border-purple-200 hover:bg-purple-50"
                title="Print data"
              >
                <Printer size={16} />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            <SlidersHorizontal className="text-gray-500" size={18} />
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Items per page"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} / {t("datagrid.page")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-center p-4">
            <div className="text-gray-400 mb-2">
              <Search size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No results found</h3>
            <p className="text-gray-500 mt-1">
              {search ? `No matches for "${search}"` : "No data available"}
            </p>
            {search && (
              <Button 
                variant="outline" 
                onClick={handleReset} 
                className="mt-4 border-red-500 text-red-600 hover:bg-red-50"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-2 py-3">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paged.length && paged.length > 0}
                      onChange={() => {
                        if (selectedRows.length === paged.length) {
                          setSelectedRows([]);
                        } else {
                          setSelectedRows(paged.map((row) => row.id));
                        }
                      }}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      aria-label="Select all rows"
                    />
                  </div>
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-4 py-3 text-sm font-semibold text-gray-700 select-none ${
                      col.sortable ? "cursor-pointer hover:text-red-600 transition" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {t(col.i18n)}
                      {col.sortable && (
                        sortColumn === col.key ? (
                          <span className="text-red-600">
                            {sortDirection === "asc" ? "▲" : "▼"}
                          </span>
                        ) : (
                          <ArrowDownUp className="w-4 h-4 text-gray-400" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row) => (
                <tr 
                  key={row.id} 
                  className={`border-t hover:bg-gray-50 transition-colors ${
                    selectedRows.includes(row.id) ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-2 py-3">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        aria-label={`Select row ${row.id}`}
                      />
                    </div>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.key === "obrazek" && row[col.key] ? (
                        <div className="flex justify-center">
                          <a
                            href={row[col.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                          >
                            <img
                              src={row[col.key]}
                              alt="Adapter"
                              className="max-w-[60px] h-auto rounded shadow object-contain"
                              loading="lazy"
                            />
                          </a>
                        </div>
                      ) : col.key === "vektor" && row[col.key] ? (
                        <div className="flex justify-center">
                          <a
                            href={row[col.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                          >
                            <img
                              src={row[col.key]}
                              alt="Vektor"
                              className="max-w-[60px] h-auto rounded object-contain"
                              loading="lazy"
                            />
                          </a>
                        </div>
                      ) : col.link ? (
                        <a
                          href={`/${category}/${row.id}`}
                          className="text-red-600 hover:text-red-800 font-medium cursor-pointer focus:outline-none focus:underline"
                        >
                          {row[col.key] ?? `${category}/${row.id}`}
                        </a>
                      ) : (
                        <span className={row[col.key] === null ? "text-gray-400" : ""}>
                          {row[col.key] ?? "—"}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-sm text-gray-500 order-2 sm:order-1">
          {filtered.length > 0 ? (
            <>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
              {filtered.length !== data.length && (
                <span> (filtered from {data.length} total entries)</span>
              )}
            </>
          ) : (
            <>No entries to display</>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </Button>
            
            <div className="flex gap-1">
              {totalPages <= 7 ? (
                // Show all pages if 7 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </Button>
                ))
              ) : (
                // Show pagination with ellipsis for more than 7 pages
                <>
                  {[1, 2].includes(currentPage) || currentPage === 1 ? (
                    <>
                      {[1, 2, 3].map(page => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={
                            page === currentPage
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }
                          aria-label={`Page ${page}`}
                          aria-current={page === currentPage ? "page" : undefined}
                        >
                          {page}
                        </Button>
                      ))}
                      <span className="px-2 text-gray-500">...</span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        aria-label={`Page ${totalPages}`}
                      >
                        {totalPages}
                      </Button>
                    </>
                  ) : currentPage >= totalPages - 1 ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(1)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        aria-label="Page 1"
                      >
                        1
                      </Button>
                      <span className="px-2 text-gray-500">...</span>
                      {[totalPages - 2, totalPages - 1, totalPages].map(page => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={
                            page === currentPage
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }
                          aria-label={`Page ${page}`}
                          aria-current={page === currentPage ? "page" : undefined}
                        >
                          {page}
                        </Button>
                      ))}
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(1)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        aria-label="Page 1"
                      >
                        1
                      </Button>
                      <span className="px-2 text-gray-500">...</span>
                      {[currentPage - 1, currentPage, currentPage + 1].map(page => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={
                            page === currentPage
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }
                          aria-label={`Page ${page}`}
                          aria-current={page === currentPage ? "page" : undefined}
                        >
                          {page}
                        </Button>
                      ))}
                      <span className="px-2 text-gray-500">...</span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        aria-label={`Page ${totalPages}`}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}