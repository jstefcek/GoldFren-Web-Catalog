import { useEffect, useState } from "react";
import { Button } from "./ui/Custom_Button";
import CustomFilter from "./ui/Custom_Filter";
import {
  ArrowDownUp,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldClose,
  Car,
  Boxes,
} from "lucide-react";
import { columnsConfig } from "./Column_Config";
import { useTranslation } from "react-i18next";
import { fetchData } from "../../hooks/Data_APIHook";
import { TextTruncate } from "./ui/Custom_TextTruncate";
import { CustomImageViewer } from "../ui/Custom_ImageViewer";
import { Link } from "react-router-dom";
import CustomEditDialog from "../ui/Custom_EditDialog";
import { formatDateLong } from "../../utils/utils";
import AlertDialog from "../ui/Custom_AlertDialog";

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
  const [searchFilters, setSearchFilters] = useState([
    { id: Date.now(), column: "all", value: "" },
  ]);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogRow, setDialogRow] = useState(null);
  const [dialogCategoryOverride, setDialogCategoryOverride] = useState(null);
  const [dialogTitleOverride, setDialogTitleOverride] = useState(null);
  const [refreshTokenInternal, setRefreshTokenInternal] = useState(Date.now());
  const [alertDialog, setAlertDialog] = useState(null);

  const resolvedCategory = apiCategory || category;
  const columns = columnsConfig[resolvedCategory] || [];
  
  // Data loading effect
  useEffect(() => {
    if (apiUrl) {
      const loadData = async () => {
        setIsLoading(true);

        try {
          const queryParams = new URLSearchParams(filters).toString();
          const fullUrl = queryParams ? `${apiUrl}&${queryParams}` : apiUrl;

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
      setData(apiData || []);
      setIsLoading(false);
    }
  }, [
    resolvedCategory,
    apiUrl,
    JSON.stringify(filters),
    refreshToken,
    refreshTokenInternal,
  ]);
  
  // Sorting handling
  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortDirection("asc");
    }
  };
  
  // Reset handling
  const handleReset = () => {
    setSearchFilters([{ id: Date.now(), column: "all", value: "" }]);
    setSortColumn(null);
    setSortDirection("asc");
    setSelectedRows([]);
    setCurrentPage(1);
  };
  
  // Row selection handling
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  
  // Filters change handling
  const handleFiltersChange = (newFilters) => {
    setSearchFilters(newFilters);
    setCurrentPage(1);
  };

  const hasActiveFilter = searchFilters.some((f) => f.value.trim() !== "");

  // Filtering logic
  const norm = (v) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "boolean") return v ? "true" : "false";
    return String(v).toLowerCase();
  };

  const filtered = data.filter((row) => {
    return searchFilters.every((filter) => {
      const term = filter.value.trim().toLowerCase();
      if (term === "") return true;

      const searchableColumns = columns.filter((c) => c.searchable !== false);
      const keysToCheck =
        filter.column === "all"
          ? searchableColumns.map((c) => c.key)
          : [filter.column];

      const keys = keysToCheck.length ? keysToCheck : columns.map((c) => c.key);

      return keys.some((key) => norm(row[key]).includes(term));
    });
  });
  
  // Sorting logic
  const sorted = sortColumn
    ? [...filtered].sort((a, b) => {
        const aVal =
          a[sortColumn] !== null && a[sortColumn] !== undefined
            ? a[sortColumn]?.toString().toLowerCase()
            : "";
        const bVal =
          b[sortColumn] !== null && b[sortColumn] !== undefined
            ? b[sortColumn]?.toString().toLowerCase()
            : "";

        if (aVal === bVal) return 0;

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
  
  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = listAll
    ? sorted
    : sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dialog handling
  const handleOpenDialog = (row, options = {}) => {
    setDialogRow(row);
    setDialogCategoryOverride(options.category || resolvedCategory);
    setDialogTitleOverride(options.title || dialogTitle);
    setOpenDialog(true);
  };

  const handleOpenDefaultDialog = (row) => {
    setDialogCategoryOverride(null);
    setDialogTitleOverride(null);
    setDialogRow(row);
    setOpenDialog(true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mb-4">
        {/* Advanced Filter Section */}
        <CustomFilter
          columns={columns}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />

        <div className="flex flex-wrap items-center gap-3 w-full justify-between">
          <div className="flex items-center gap-2">
            {selectedRows.length > 0 && (
              <span className="text-sm font-medium text-gray-700 mr-2">
                {selectedRows.length} {t("datagrid.selected")}
              </span>
            )}
          </div>

          {!listAll && (
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-gray-500" size={18} />
              <select
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
              {hasActiveFilter
                ? "No matches for your filters"
                : "No data available"}
            </p>
            {hasActiveFilter && (
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
                            fullSize={true}
                            className="h-24 w-24 max-h-24 max-w-24 object-contain"
                          />
                        </div>
                      ) : col.link ? (
                        dialogMode ? (
                          <span
                            className="text-red-600 hover:text-red-800 font-medium cursor-pointer focus:outline-none focus:underline"
                            onClick={() => handleOpenDefaultDialog(row)}
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
                      ) : col.type === "vehicle_setup" ||
                        col.type === "sortiment_setup" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="default"
                            onClick={() =>
                              handleOpenDialog(row, {
                                category: col.dialogCategory,
                                title: col.dialogTitle,
                              })
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-xs sm:text-sm rounded-md shadow-sm transition-transform duration-150 cursor-pointer hover:-translate-y-0.5 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          >
                            <span className="flex items-center gap-2">
                              {col.type === "vehicle_setup" && (
                                <Car className="w-4 h-4 text-white" />
                              )}
                              {col.type === "sortiment_setup" && (
                                <Boxes className="w-4 h-4 text-white" />
                              )}
                              <span>{t(col.buttonLabel)}</span>
                            </span>
                          </Button>
                        </div>
                      ) : col.useTruncation ? (
                        <TextTruncate
                          text={row[col.key]}
                          maxRows={col.maxRows || 3}
                        />
                      ) : (
                        (() => {
                          const value = row[col.key];

                          if (
                            typeof value === "string" &&
                            col.type === "date"
                          ) {
                            return formatDateLong(value);
                          }

                          if (typeof value === "boolean") {
                            const Icon = value ? ShieldCheck : ShieldClose;
                            const color = value
                              ? "text-green-500"
                              : "text-red-500";
                            return <Icon className={`w-6 h-6 ${color}`} />;
                          }

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

        {openDialog && dialogRow && (
          <CustomEditDialog
            isOpen={openDialog}
            onClose={() => setOpenDialog(false)}
            dialogTitle={dialogTitleOverride || dialogTitle}
            rowData={dialogRow}
            category={dialogCategoryOverride || category}
            access_token={access_token}
            onSuccess={() => {
              setRefreshTokenInternal(Date.now());
              setOpenDialog(false);
              setAlertDialog({
                title: "Úspěch",
                message: "Úprava dat byla úspěšná.",
                type: "success",
                duration: 5,
              });
            }}
            onError={(errMsg) => {
              setAlertDialog({
                title: "Chyba",
                message: errMsg || "Nastala chyba při editaci dat.",
                type: "error",
                duration: 5,
              });
            }}
          />
        )}

        {alertDialog && (
          <AlertDialog
            title={alertDialog.title}
            message={alertDialog.message}
            type={alertDialog.type}
            duration={alertDialog.duration}
            onClose={() => setAlertDialog(null)}
          />
        )}
      </div>
    </div>
  );
}
