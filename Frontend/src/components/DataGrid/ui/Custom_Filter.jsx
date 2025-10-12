import { useState } from "react";
import { Input } from "./Custom_Input";
import { Button } from "./Custom_Button";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CustomFilter({
  columns = [],
  onFiltersChange,
  onReset,
}) {
  const [searchFilters, setSearchFilters] = useState([
    { id: Date.now(), column: "all", value: "" },
  ]);
  const { t } = useTranslation();

  const searchableColumns = columns.filter((c) => c.searchable !== false);

  const addFilter = () => {
    const newFilters = [
      ...searchFilters,
      { id: Date.now(), column: "all", value: "" },
    ];
    setSearchFilters(newFilters);
  };

  const removeFilter = (id) => {
    if (searchFilters.length > 1) {
      const newFilters = searchFilters.filter((f) => f.id !== id);
      setSearchFilters(newFilters);
      onFiltersChange(newFilters);
    }
  };

  const updateFilter = (id, field, value) => {
    const newFilters = searchFilters.map((f) =>
      f.id === id ? { ...f, [field]: value } : f
    );
    setSearchFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const getAvailableColumns = (currentFilterId) => {
    const usedColumns = searchFilters
      .filter((f) => f.id !== currentFilterId && f.column !== "all")
      .map((f) => f.column);
    return searchableColumns.filter((c) => !usedColumns.includes(c.key));
  };

  const hasActiveFilter = searchFilters.some((f) => f.value.trim() !== "");
  const canAddFilter =
    searchFilters.length < searchableColumns.length &&
    searchFilters[searchFilters.length - 1].value.trim() !== "";

  const handleReset = () => {
    const resetFilters = [{ id: Date.now(), column: "all", value: "" }];
    setSearchFilters(resetFilters);
    onFiltersChange(resetFilters);
    onReset();
  };

  return (
    <div className="flex flex-col gap-2">
      {searchFilters.map((filter) => (
        <div
          key={filter.id}
          className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full"
        >
          <div className="relative w-full sm:w-64">
            <SlidersHorizontal className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            <ChevronRight className="absolute right-3 top-2.5 rotate-90 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />

            <select
              className={`w-full appearance-none border border-gray-300 rounded-xl pl-10 pr-10 h-10 text-sm sm:text-base bg-white
                shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:shadow-md
                transition ${
                  filter.column === "all" ? "text-gray-400" : "text-gray-900"
                }`}
              value={filter.column}
              onChange={(e) => updateFilter(filter.id, "column", e.target.value)}
              aria-label="Choose column to filter"
            >
              <option value="all" className="text-gray-400">
                {t("datagrid.all_columns") || "Filtrovat všechny sloupce"}
              </option>
              {getAvailableColumns(filter.id).map((c) => (
                <option key={c.key} value={c.key} className="text-gray-900">
                  {t(c.label)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center w-full sm:w-auto gap-2">
            <div className="relative flex-1 w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              <Input
                placeholder={t("datagrid.search_placeholder")}
                value={filter.value}
                onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
                className="pl-10 pr-3 h-10 text-sm sm:text-base bg-white text-gray-600 border border-gray-300 rounded-xl
                     shadow-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:shadow-md transition w-full"
                aria-label="Search data"
              />
            </div>

            {searchFilters.length > 1 && (
              <Button
                variant="outline"
                onClick={() => removeFilter(filter.id)}
                className="h-10 px-3 border border-gray-300 hover:bg-red-50 hover:border-red-300 transition shrink-0"
                aria-label="Remove filter"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 items-center justify-start">
        {canAddFilter && (
          <Button
            variant="outline"
            onClick={addFilter}
            className="h-10 text-sm sm:text-base flex gap-1 items-center mr-2
                      border border-gray-300 hover:bg-gray-50 hover:border-gray-500
                      px-3 cursor-pointer"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            {t("datagrid.add_filter") || "Přidat filtr"}
          </Button>
        )}

        {hasActiveFilter && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-10 text-sm sm:text-base flex gap-1 items-center mr-2
                      border border-gray-300 hover:bg-red-50 hover:border-red-500
                      text-red-500 px-3 cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
            {t("datagrid.reset") || "Resetovat filtry"}
          </Button>
        )}
      </div>
    </div>
  );
}