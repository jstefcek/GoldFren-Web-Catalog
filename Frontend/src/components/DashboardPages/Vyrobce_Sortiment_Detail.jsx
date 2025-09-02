import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import DataGrid from "../DataGrid/DataGrid";
import AlertDialog from "../ui/Custom_AlertDialog";
import { CustomSelect } from "../SearchForm/ui/CustomSelect";
import { FileSpreadsheet, Search } from "lucide-react";

const serverUrl = import.meta.env.VITE_API_URL;

// Format today's date as YYYY-MM-DD
const todayStr = () => new Date().toISOString().slice(0, 10);

// Format a string to be safe for use in file names
const fileSafe = (s) => (s || "vyrobce").replace(/[\\/:*?"<>|]/g, "_");

// Optionally flatten nested values a bit and make nulls empty strings
const sanitizeRow = (row) => {
  const out = {};
  for (const [k, v] of Object.entries(row || {})) {
    if (v === null || v === undefined) out[k] = "";
    else if (typeof v === "object" && !Array.isArray(v)) out[k] = JSON.stringify(v);
    else out[k] = v;
  }
  return out;
};

export default function VyrobceSortimentDetail() {
  const { t } = useTranslation();

  // Refs & UI state
  const titleRef = useRef(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [alertData, setAlertData] = useState(null);

  // Manufacturers
  const [manufacturers, setManufacturers] = useState([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(false);

  // Selection + search
  const [selectedMfr, setSelectedMfr] = useState(null); 
  const [searching, setSearching] = useState(false);
  const [exporting, setExporting] = useState(false);

  // API data
  const [sortimentData, setSortimentData] = useState(null);

  // Load manufacturers on mount
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    (async () => {
      try {
        setLoadingManufacturers(true);
        const res = await fetch(
          `${serverUrl}/api/goldfren/internal/vozidla/vyrobce`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const opts = (json || []).map((x) => ({
          value: String(x.kod),
          label: x.nazev,
        }));
        if (!ignore) setManufacturers(opts);
      } catch (e) {
        if (!ignore && e.name !== "AbortError") {
          setAlertData({
            title: "Chyba",
            message: e.message || "Nepodařilo se načíst výrobce.",
            type: "error",
            duration: 6,
            onClose: () => setAlertData(null),
          });
        }
      } finally {
        if (!ignore) setLoadingManufacturers(false);
      }
    })();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  // Search sortiment for vyrobce
  const handleSearch = useCallback(async () => {
    const vyrobce_kod = selectedMfr?.value;
    if (!vyrobce_kod) {
      setAlertData({
        title: "Upozornění",
        message: "Vyberte prosím výrobce.",
        type: "warning",
        duration: 4,
        onClose: () => setAlertData(null),
      });
      return;
    }

    const url = `${serverUrl}/api/goldfren/internal/sortiment?vyrobce_kod=${encodeURIComponent(
      vyrobce_kod
    )}`;

    try {
      setSearching(true);
      setIsDataReady(false);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setSortimentData(json);
    } catch (e) {
      setSortimentData(null);
      setAlertData({
        title: "Chyba",
        message: e.message || "Vyhledávání selhalo.",
        type: "error",
        duration: 6,
        onClose: () => setAlertData(null),
      });
    } finally {
      setSearching(false);
    }
  }, [selectedMfr]);

  // Normalize categories
  const normalized = useMemo(() => {
    if (!sortimentData) return null;
    const categories = [
      "adaptery",
      "desticky",
      "brzdice",
      "kotouce",
      "hadicky",
      "pumpy",
      "prislusenstvi",
    ];
    const out = {};
    for (const c of categories) {
      const node = sortimentData[c];
      if (node && Array.isArray(node.items)) {
        out[c] = { count: node.count ?? node.items.length, items: node.items };
      } else if (Array.isArray(node)) {
        out[c] = { count: node.length, items: node };
      } else {
        out[c] = { count: 0, items: [] };
      }
    }
    return out;
  }, [sortimentData]);

  // Build absolute image/vector URLs
  const transformedSortimentData = useMemo(() => {
    if (!normalized) return null;
    return Object.fromEntries(
      Object.entries(normalized).map(([key, categoryData]) => [
        key,
        {
          ...categoryData,
          items: categoryData.items.map((item) => ({
            ...item,
          })),
        },
      ])
    );
  }, [normalized]);

  // Scroll on ready
  useEffect(() => {
    if (!transformedSortimentData) return;
    const hasItems = Object.values(transformedSortimentData).some(
      (c) => c.items.length > 0
    );
    setIsDataReady(true);
    if (hasItems && titleRef.current) {
      const headerOffset = 80;
      const elementPosition = titleRef.current.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }, [transformedSortimentData]);

  // Derived flags
  const hasAnyResults =
    !!transformedSortimentData &&
    Object.values(transformedSortimentData).some((c) => c.items?.length > 0);

  // Export data to Excel
  const handleExport = useCallback(async () => {
    if (!transformedSortimentData) return;
    try {
      setExporting(true);

      // lightweight SheetJS from CDN
      const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");
      const wb = XLSX.utils.book_new();

      // helper: 0 -> A, 1 -> B ...
      const colToLetter = (c) => {
        let s = "";
        let n = c + 1;
        while (n > 0) {
          const rem = (n - 1) % 26;
          s = String.fromCharCode(65 + rem) + s;
          n = Math.floor((n - 1) / 26);
        }
        return s;
      };

      // ensure workbook table container
      wb.Workbook = wb.Workbook || {};
      wb.Workbook.Tables = wb.Workbook.Tables || [];

      // create one sheet per category as an actual Excel Table (classic blue/striped)
      for (const [catKey, catData] of Object.entries(transformedSortimentData)) {
        const items = catData?.items || [];
        if (!items.length) continue;

        const rows = items.map((it) => sanitizeRow(it));

        // collect headers
        const allKeys = Array.from(
          rows.reduce((acc, r) => {
            Object.keys(r || {}).forEach((k) => acc.add(k));
            return acc;
          }, new Set())
        );

        const preferred = ["kod", "id", "nazev", "name"];
        const headers = [
          ...preferred.filter((p) => allKeys.includes(p)),
          ...allKeys.filter((k) => !preferred.includes(k)).sort(),
        ];

        // create worksheet
        const ws = XLSX.utils.json_to_sheet(rows, { header: headers, skipHeader: false });

        // ensure ref/range set correctly
        const lastCol = headers.length - 1;
        const lastColLetter = colToLetter(lastCol);
        const lastRow = rows.length + 1;
        const range = `A1:${lastColLetter}${lastRow}`;
        ws["!ref"] = range;

        // autofilter and col widths
        ws["!autofilter"] = { ref: range };
        ws["!cols"] = headers.map((h) => ({ wch: Math.min(Math.max(h.length + 6, 12), 40) }));

        // sheet name
        const sheetName = (t(catKey) || catKey).toString();

        // append sheet
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        // build safe table name (alphanumeric, starts with letter)
        let tableNameBase = sheetName.replace(/[^A-Za-z0-9]/g, "").slice(0, 20);
        if (!/^[A-Za-z]/.test(tableNameBase)) tableNameBase = `T${tableNameBase}`;
        if (!tableNameBase) tableNameBase = "Table";
        let tableName = tableNameBase;
        let idx = 1;
        while (wb.Workbook.Tables.some((t) => t.name === tableName)) {
          tableName = `${tableNameBase}${idx++}`;
        }

        // add table definition
        const tableObj = {
          name: tableName,
          ref: range,
          headerRow: true,
          totalsRow: false,
          columns: headers.map((h) => ({ name: h })),
          style: { theme: "TableStyleMedium2", showRowStripes: true },
        };

        // worksheet-level pointer
        const wsRef = wb.Sheets[sheetName];
        wsRef["!table"] = { name: tableName, ref: range };

        // push to workbook tables so SheetJS emits table xml
        wb.Workbook.Tables.push(tableObj);
      }

      // filename and write
      const mfrLabel = fileSafe(selectedMfr?.label);
      const fname = `goldfren_${mfrLabel.toLowerCase()}_${todayStr()}.xlsx`;
      XLSX.writeFile(wb, fname, { compression: true });
    } catch (e) {
      setAlertData({
        title: "Export selhal",
        message: e?.message || "Nepodařilo se vytvořit Excel soubor.",
        type: "error",
        duration: 6,
        onClose: () => setAlertData(null),
      });
    } finally {
      setExporting(false);
    }
  }, [transformedSortimentData, selectedMfr, t]);

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900" ref={titleRef}>
          {t("search_by_manufacturer")}
        </h2>

        {/* Search component and button to search */}
        <div className="mt-2 mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <CustomSelect
              label="Vyberte výrobce"
              name="vyrobce"
              value={selectedMfr}
              onChange={(e) => setSelectedMfr(e.target.value)}
              options={manufacturers}
              optional={false}
              placeholder="Vyberte výrobce pro dohledání sortimentu"
              disabled={loadingManufacturers}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={!selectedMfr || searching}
            className="ml-4 px-12 py-4 bg-red-700 text-white inline-flex items-center gap-2 font-bold rounded-md cursor-pointer hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-600"
          >
            <Search className="w-4 h-4 sm:w-6 sm:h-6" /> Vyhledat
          </button>
        </div>

        {/* Content area with sortiment data */}
        <div className="mt-2 mb-8">
          {/* Empty state */}
          {isDataReady && !searching && !hasAnyResults && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="text-gray-700">
                {selectedMfr
                  ? "Pro vybraného výrobce nebyly nalezeny žádné položky."
                  : "Vyberte výrobce a klikněte na Hledat."}
              </p>
            </div>
          )}

          {/* Results */}
          {isDataReady &&
            !searching &&
            transformedSortimentData &&
            Object.entries(transformedSortimentData).map(
              ([key, categoryData]) =>
                categoryData.items.length > 0 && (
                  <div key={key} className="mb-8">
                    <h3 className="text-2xl font-semibold capitalize">
                      {t(key)}
                    </h3>

                    <div className="mb-4 mt-4">
                      <DataGrid
                        category={key}
                        apiCategory={key + "_sortiment"}
                        apiData={categoryData.items}
                      />
                    </div>
                  </div>
                )
            )}
        </div>
      </div>

      {/* Export Button */}
      {isDataReady && hasAnyResults && !searching && (
        <button
          type="button"
          onClick={handleExport}
          aria-label="Export"
          disabled={exporting}
          className="fixed bottom-8 right-8 z-50 inline-flex items-center gap-2 px-8 py-4 bg-red-700 text-white font-bold rounded-md shadow-2xl hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
              </svg>
              Exportuji…
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4 sm:w-6 sm:h-6" />
              Exportovat Data
            </>
          )}
        </button>
      )}

      {/* Alert dialog */}
      {alertData && (
        <AlertDialog
          title={alertData.title}
          message={alertData.message}
          type={alertData.type}
          duration={alertData.duration}
          onClose={alertData.onClose}
        />
      )}
    </div>
  );
}