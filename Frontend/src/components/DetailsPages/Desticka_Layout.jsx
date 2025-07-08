import { useEffect, useState } from "react";
import {
  Car,
  Bike,
  Plane,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { fetchData } from "../../hooks/Data_APIHook";
import { useTranslation } from "react-i18next";
import { NavigationStrip } from "../ui/Custom_NavigationStrip";
import DataGrid from "../DataGrid/DataGrid";
import DetailImage from "../ui/Custom_DetailImage";
const serverUrl = import.meta.env.VITE_API_URL;

export default function BrakePadDetail({ category = "", apiUrl = null }) {
  // Get the ID from the URL (would work with React Router)
  const id = window.location.pathname.split("/").pop();

  // Validate that ID is a number
  const isValidId = !isNaN(id) && id.trim() !== "";

  // State for controlling vehicle compatibility loading
  const [showVehicles, setShowVehicles] = useState(false);
  const [padData, setPadData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllOem, setShowAllOem] = useState(false);
  const { t } = useTranslation();

  // Call API to get data
  useEffect(() => {
    const loadData = async () => {
      if (!isValidId) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await fetchData(category, apiUrl + id);
        setPadData(result || {});
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(t("error.loading_failed") || "Failed to load data");
        setPadData({});
        setLoading(false);
      }
    };

    if (category && apiUrl) {
      loadData();
    } else {
      setLoading(false);
      setError(t("error.missing_parameters") || "Missing required parameters");
    }
  }, [category, apiUrl, id, isValidId, t]);

  // Helper function to safely display data with fallbacks
  const displayData = (data, fallback = "-") => {
    return data || fallback;
  };

  // Split OEM numbers or other comma-separated values safely
  const splitValues = (value) => {
    if (!value) return [];
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-red-600 animate-spin mb-4" />
        <p className="text-gray-700">
          {t("loading.data") || "Loading data..."}
        </p>
      </div>
    );
  }

  // Handle error or invalid ID
  if (error || !isValidId) {
    return (
      <div className="p-6 max-w-screen-xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
          <AlertCircle className="h-6 w-6 text-red-600 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-medium text-red-700 mb-2">
              {t("error.title") || "Error"}
            </h2>
            <p className="text-red-600">
              {error || t("error.invalid_id") || "Invalid product ID"}
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              {t("error.btn_go_back") || "Go Back"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get OEM numbers
  const oemNumbers = splitValues(padData.oem_cisla);

  // Determine if we should show the show more/less button
  const shouldShowOemToggle = oemNumbers.length > 10;

  // Limit OEM numbers displayed if showAllOem is false
  const displayedOemNumbers = showAllOem ? oemNumbers : oemNumbers.slice(0, 10);

  return (
    <div className="p-4 md:p-4 w-full mb-8">
      {/* Top navigation strip */}
      <NavigationStrip
        to="/desticky"
        label={t("back_to_list") || "Back to list"}
        description="desticky_title"
      />

      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 mt-8">
        {t("brake_pad_title")} - {displayData(padData.cislo_dilu)}
      </h1>

      {/* Top sections in a grid */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Left column with image and vector drawing */}
        <div className="lg:w-5/7 rounded-lg shadow border border-gray-200 bg-white p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}

            <DetailImage
              title={t("datagrid.picture")}
              imageUrl={padData.image}
              altText={`Brake pad image for ${displayData(padData.cislo_dilu)}`}
              noImageText={t("datagrid.no_image") || "No image available"}
            />

            {/* Technical Drawing */}
            <DetailImage
              title={t("datagrid.vektor")}
              imageUrl={padData.vektor}
              altText={`Brake pad technical image for ${displayData(
                padData.cislo_dilu
              )}`}
              noImageText={t("datagrid.no_image") || "No image available"}
            />
          </div>
        </div>

        {/* Right column with OEM numbers - fixed height with scroll */}
        <div className="lg:w-2/7 rounded-lg shadow border border-gray-200 bg-white p-8 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {t("datagrid.oem_cisla")}
          </h2>

          {/* Scrollable container for OEM numbers */}
          <div className="flex-grow" style={{ height: "200px" }}>
            {oemNumbers.length > 0 ? (
              <div className="overflow-y-auto h-full pr-2">
                <div className="flex flex-wrap gap-2">
                  {displayedOemNumbers.map((code, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-1"
                    >
                      {code}
                    </span>
                  ))}
                </div>

                {shouldShowOemToggle && (
                  <button
                    onClick={() => setShowAllOem(!showAllOem)}
                    className="flex items-center justify-center w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    {showAllOem ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        {t("datagrid.show_less") || "Show less"}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        {t("datagrid.show_more", {
                          count: oemNumbers.length - 10,
                        }) || `Show ${oemNumbers.length - 10} more`}
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">
                  {t("datagrid.no_oem") || "No OEM numbers available"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom sections in a grid */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Compatibility table */}
        <div className="lg:w-4/5 rounded-lg shadow border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {t("datagrid.compatibility_table")}
          </h2>
          <div className="overflow-x-auto">
            {padData.konkurence &&
            Object.keys(padData.konkurence).length > 0 ? (
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      {t("datagrid.brand")}
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                      {t("datagrid.brand_code")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(padData.konkurence).map(([brand, code]) => (
                    <tr
                      key={brand}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {brand.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {displayData(code)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-32 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">
                  {t("datagrid.no_compatibility") ||
                    "No compatibility data available"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Material section */}
        <div className="lg:w-1/5 rounded-lg shadow border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {t("datagrid.material_text")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {splitValues(padData.material).length > 0 ? (
              splitValues(padData.material).map((material, index) => (
                <span
                  key={index}
                  className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {material}
                </span>
              ))
            ) : (
              <span className="text-gray-500">
                {t("datagrid.no_material") ||
                  "No material information available"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Compatibility Section */}
      <div className="rounded-lg shadow border border-gray-200 bg-white p-2 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-700 mt-4 ml-4">
            {t("datagrid.compatible_vehicles")}
          </h2>
          {!showVehicles && (
            <button
              onClick={() => setShowVehicles(true)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2 ml-4"
              disabled={!isValidId}
            >
              <span>
                {t("datagrid.load_vehicles") || "Load Compatible Vehicles"}
              </span>
            </button>
          )}
        </div>

        {showVehicles ? (
          <div className="mt-4">
            <DataGrid
              category="desticka_vozidla"
              apiUrl={`${serverUrl}/api/goldfren/internal/desticky/vozidla?limit=0&desticka_id=${padData.id}`}
            />
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-md m-4">
            <div className="flex items-center mb-4">
              <Car className="h-8 w-8 mr-4 text-gray-500" />
              <Bike className="h-8 w-8 mr-4 text-gray-500" />
              <Plane className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-500 text-center max-w-md">
              {t("datagrid.vehicle_notload_text") ||
                "Click the button above to load compatible vehicle information"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
