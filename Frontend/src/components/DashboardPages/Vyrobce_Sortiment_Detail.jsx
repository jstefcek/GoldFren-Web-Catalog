import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import DataGrid from "../DataGrid/DataGrid";
import AlertDialog from "../ui/Custom_AlertDialog";
import { CustomSelect } from "../SearchForm/ui/CustomSelect";
import { FileSpreadsheet, Search } from "lucide-react";
import { ExportToExcel } from "../../utils/ExportFunctions/ExportExcel";

const serverUrl = import.meta.env.VITE_API_URL;

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

  // Export to Excel
  const handleExport = useCallback(async () => {
    if (!transformedSortimentData) return;

    await ExportToExcel({
      data: transformedSortimentData,
      t,
      fileName: `goldfren_${selectedMfr?.label || "export"}`,
      onStart: () => setExporting(true),
      onFinish: () => setExporting(false),
      onError: (err) => {
        setExporting(false);
        setAlertData({
          title: "Export selhal",
          message: err?.message || "Nepodařilo se vytvořit Excel soubor.",
          type: "error",
          duration: 7,
          onClose: () => setAlertData(null),
        });
      }
    });
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