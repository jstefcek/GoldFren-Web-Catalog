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
  ShieldCheck,
  ShieldClose,
} from "lucide-react";
import { columnsConfig } from "./Column_Config";
import { useTranslation } from "react-i18next";
import { fetchData } from "../../hooks/Data_APIHook";
import { TextTruncate } from "./ui/Custom_TextTruncate";
import { CustomImageViewer } from "../ui/Custom_ImageViewer";
import { Link } from "react-router-dom";
import CustomEditDialog from "../ui/Custom_EditDialog";
import { formatDateLong } from "../../utils/utils";

export default function DataGrid_Admin({
  category = "",
  apiCategory = null,
  apiUrl = null,
  filters = {},
  apiData = null,
  listAll = false,
  access_token = null,
  show_checkbox = true,
  refreshToken = null,
  dialogMode = false,
  dialogTitle = "Detail",
}) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogRow, setDialogRow] = useState(null);
  const [refreshTokenInternal, setRefreshTokenInternal] = useState(Date.now());

  // If api category isnt defined choose category insteed
  const resolvedCategory = apiCategory || category;
  const columns = columnsConfig[resolvedCategory] || [];

  // Call API to get data or set data from already call API
  useEffect(() => {
    if (apiUrl) {
      const loadData = async () => {
        setIsLoading(true);

        try {
          const queryParams = new URLSearchParams(filters).toString();
          const fullUrl = queryParams ? `${apiUrl}&${queryParams}` : apiUrl;

          // If access token is provided, add it to headers
          const headers = access_token
            ? { Authorization: `Bearer ${access_token}` }
            : {};

          const result = await fetchData(resolvedCategory, fullUrl, headers);
          setData(result);
        } catch (error) {
          console.error("Error loading data:", error);
          setData([]);
        } finally {
          setIsLoading(false);
        }
      };

      if (resolvedCategory && apiUrl) {
        loadData();
      }
    } else {
      // Set already fetchData
      setData(apiData || []);
      setIsLoading(false);
    }
  }, [resolvedCategory, apiUrl, JSON.stringify(filters), refreshToken, refreshTokenInternal]);

  // Sorting type ASC or DESC
  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortDirection("asc");
    }
  };

  // Reset filters and sorting
  const handleReset = () => {
    setSearch("");
    setSortColumn(null);
    setSortDirection("asc");
    setSelectedRows([]);
  };

  // Get ID of selected row/rows
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Check if any filter is active to show/hide reset button
  const isFilterActive =
    search !== "" || sortColumn !== null || selectedRows.length > 0;

  // Filter data
  const filtered = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.key];
      return (
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(search.toLowerCase())
      );
    })
  );

  // Sorting values
  const sorted = sortColumn
    ? [...filtered].sort((a, b) => {
        const aVal =
          a[sortColumn] !== null ? a[sortColumn]?.toString().toLowerCase() : "";
        const bVal =
          b[sortColumn] !== null ? b[sortColumn]?.toString().toLowerCase() : "";

        if (aVal === bVal) return 0;

        // Handle numeric values for proper sorting
        if (!isNaN(aVal) && !isNaN(bVal)) {
          return sortDirection === "asc"
            ? parseFloat(aVal) - parseFloat(bVal)
            : parseFloat(bVal) - parseFloat(aVal);
        }

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      })
    : filtered;

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = listAll
    ? sorted
    : sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 justify-between mb-4 items-start md:items-center">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            {/* INPUT - Search input */}
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 bg-white" />

            <Input
              placeholder={t("datagrid.search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              aria-label="Search data"
            />
          </div>

          {/* BTN - Reset filters and sorting - Only show when filters are active */}
          {isFilterActive && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-10 text-sm sm:text-base flex gap-1 items-center border border-gray-300 hover:bg-gray-50 px-3"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              {t("datagrid.reset")}
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
              <span className="text-sm font-medium text-gray-700 mr-2">
                {selectedRows.length} {t("datagrid.selected")}
              </span>
            )}
          </div>

          {!listAll && (
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
                {[25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} {t("datagrid.entries")} {t("datagrid.on")}{" "}
                    {t("datagrid.page")}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* When filter returns no data */}
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
            <h3 className="text-lg font-medium text-gray-700">
              {t("datagrid.no_results_found")}
            </h3>
            <p className="text-gray-500 mt-1">
              {search ? `No matches for "${search}"` : "No data available"}
            </p>
            {search && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="mt-4 border-red-500 text-red-600 hover:bg-red-50"
              >
                {t("datagrid.reset")}
              </Button>
            )}
          </div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                {show_checkbox && (
                  <th className="w-10 px-2 py-3">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.length === paged.length &&
                          paged.length > 0
                        }
                        onChange={() => {
                          if (selectedRows.length === paged.length) {
                            setSelectedRows([]);
                          } else {
                            setSelectedRows(
                              paged.map(
                                (row) => row.cislo_dilu || row.id || row.kod
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        aria-label="Select all rows"
                      />
                    </div>
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-4 py-3 text-sm font-semibold text-gray-700 select-none ${
                      col.sortable
                        ? "cursor-pointer hover:text-red-600 transition"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {t(col.label)}
                      {col.sortable &&
                        (sortColumn === col.key ? (
                          <span className="text-red-600">
                            {sortDirection === "asc" ? "▲" : "▼"}
                          </span>
                        ) : (
                          <ArrowDownUp className="w-4 h-4 text-gray-400" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row) => (
                <tr
                  key={row.cislo_dilu || row.id || row.kod}
                  className={`border-t hover:bg-gray-50 transition-colors ${
                    selectedRows.includes(row.cislo_dilu || row.id || row.kod)
                      ? "bg-red-50"
                      : ""
                  }`}
                >
                  {show_checkbox && (
                    <td className="px-2 py-3">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(
                            row.cislo_dilu || row.id || row.kod
                          )}
                          onChange={() =>
                            handleSelectRow(row.cislo_dilu || row.id || row.kod)
                          }
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          aria-label={`Select row ${
                            row.cislo_dilu || row.id || row.kod
                          }`}
                        />
                      </div>
                    </td>
                  )}

                  {/* Columns - Setting */}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 text-xs sm:text-sm"
                    >
                      {(col.type === "image" || col.type === "vector") &&
                      row[col.key] ? (
                        <div className="flex justify-center">
                          <CustomImageViewer
                            src={row[col.key]}
                            alt={`${category} ${col.type}`}
                          />
                        </div>
                      ) : col.link ? (
                        dialogMode ? (
                          <span
                            className="text-red-600 hover:text-red-800 font-medium cursor-pointer focus:outline-none focus:underline"
                            onClick={() => {
                              setDialogRow(row);
                              setOpenDialog(true);
                            }}
                          >
                            {row[col.key] ?? `${category}/${row.id || row.kod}`}
                          </span>
                        ) : (
                          <Link
                            to={`/${category}/${row.id || row.kod}`}
                            className="text-red-600 hover:text-red-800 font-medium cursor-pointer focus:outline-none focus:underline"
                          >
                            {row[col.key] ?? `${category}/${row.id || row.kod}`}
                          </Link>
                        )
                      ) : col.useTruncation ? (
                        <TextTruncate
                          text={row[col.key]}
                          maxRows={col.maxRows || 3}
                        />
                      ) : (
                        (() => {
                          const value = row[col.key];

                          // Handle date values
                          if (
                            typeof value === "string" &&
                            col.type === "date"
                          ) {

                            // Format to czech long date format
                            return formatDateLong(value);
                          }

                          // Handle boolean values for icons
                          if (typeof value === "boolean") {
                            const Icon = value ? ShieldCheck : ShieldClose;
                            const color = value
                              ? "text-green-500"
                              : "text-red-500";
                            return <Icon className={`w-6 h-6 ${color}`} />;
                          }

                          // Handle null, undefined, or empty values
                          if (
                            value === null ||
                            value === undefined ||
                            value === ""
                          ) {
                            return <span className="text-gray-400">—</span>;
                          }

                          return <span>{value}</span>;
                        })()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="text-sm text-gray-500 order-2 sm:order-1 mt-4">
        {filtered.length > 0 ? (
          listAll ? (
            <>
              {t("datagrid.all_entries")}:{" "}
              <span className="font-bold">{filtered.length}</span>
            </>
          ) : (
            <>
              {t("datagrid.showing")}{" "}
              {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}{" "}
              {t("datagrid.to")}{" "}
              {Math.min(currentPage * pageSize, filtered.length)}{" "}
              {t("datagrid.of")} {filtered.length} {t("datagrid.entries")}
              {filtered.length !== data.length && (
                <span>
                  {" "}
                  ({t("datagrid.filtered_from")} {data.length}{" "}
                  {t("datagrid.total_entries")})
                </span>
              )}
            </>
          )
        ) : (
          <>{t("datagrid.nothing_to_display")}</>
        )}

        {/* Total pages */}
        {!listAll && totalPages > 1 && (
          <div className="flex items-center gap-1 order-1 sm:order-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </Button>

            <div className="flex gap-1">
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={
                        page === currentPage
                          ? "bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                      }
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  )
                )
              ) : (
                // Show pagination with ellipsis for more than 7 pages
                <>
                  {[1, 2].includes(currentPage) || currentPage === 1 ? (
                    <>
                      {[1, 2, 3].map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={
                            page === currentPage
                              ? "bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                          }
                          aria-label={`Page ${page}`}
                          aria-current={
                            page === currentPage ? "page" : undefined
                          }
                        >
                          {page}
                        </Button>
                      ))}
                      <span className="px-2 text-gray-500 mt-1">...</span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
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
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                        aria-label="Page 1"
                      >
                        1
                      </Button>
                      <span className="px-2 text-gray-500 mt-1">...</span>
                      {[totalPages - 2, totalPages - 1, totalPages].map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            onClick={() => setCurrentPage(page)}
                            className={
                              page === currentPage
                                ? "bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                            }
                            aria-label={`Page ${page}`}
                            aria-current={
                              page === currentPage ? "page" : undefined
                            }
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(1)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                        aria-label="Page 1"
                      >
                        1
                      </Button>
                      <span className="px-2 text-gray-500">...</span>
                      {[currentPage - 1, currentPage, currentPage + 1].map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            onClick={() => setCurrentPage(page)}
                            className={
                              page === currentPage
                                ? "bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                            }
                            aria-label={`Page ${page}`}
                            aria-current={
                              page === currentPage ? "page" : undefined
                            }
                          >
                            {page}
                          </Button>
                        )
                      )}
                      <span className="px-2 text-gray-500">...</span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                        aria-label={`Page ${totalPages}`}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* BTN - Next page */}
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}

        {/* Dialog for detailed view */}
        {dialogMode && openDialog && dialogRow && (
          <CustomEditDialog
            isOpen={dialogMode && openDialog}
            onClose={() => setOpenDialog(false)}
            dialogTitle={dialogTitle}
            rowData={dialogRow}
            category={category}
            access_token={access_token}
            onSuccess={() => {
              setRefreshTokenInternal(Date.now());
              setOpenDialog(false);                
            }}
          />
        )}
      </div>
    </div>
  );
}
