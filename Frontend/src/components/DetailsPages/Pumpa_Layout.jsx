import { useEffect, useState } from "react";
import { Car, Bike, Plane, AlertCircle, Loader2 } from "lucide-react";
import { fetchData } from "../../hooks/Data_APIHook";
import { useTranslation } from "react-i18next";
import { NavigationStrip } from "../ui/Custom_NavigationStrip";
import DataGrid from "../DataGrid/DataGrid";
import DetailImage from "../ui/Custom_DetailImage";
import { trackSortimentItemView } from '../../utils/GoogleAnalytics';
const serverUrl = import.meta.env.VITE_API_URL;

export default function BrakePadDetail({ category = "", apiUrl = null }) {
  // Get the ID from the URL
  const id = window.location.pathname.split("/").pop();

  // Validate that ID is a number
  const isValidId = !isNaN(id) && id.trim() !== "";

  // Track if ID of item is valid
  if (isValidId) {
    const Category = "Pumpy";
    trackSortimentItemView({ Category, id });
  }

  // State for controlling vehicle compatibility loading
  const [showVehicles, setShowVehicles] = useState(false);
  const [pumpaData, setPumpaData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setPumpaData(result || {});
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(t("error.loading_failed") || "Failed to load data");
        setPumpaData({});
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
      <div className="p-6 w-full mb-8">
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

  return (
    <div className="p-4 md:p-4 w-full mb-8">
      {/* Top navigation strip */}
      <NavigationStrip
        to="/pumpy"
        label={t("back_to_list") || "Back to list"}
        description="pumpy_title"
      />

      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 mt-8">
        {t("pumpa_title")} - {displayData(pumpaData.cislo_dilu)}
      </h1>

      {/* Top sections in a grid */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Image and vector drawing */}
        <div className="lg:w-full rounded-lg shadow border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <DetailImage
              title={t("datagrid.picture")}
              imageUrl={pumpaData.image}
              altText={`Brake disc image for ${displayData(
                pumpaData.cislo_dilu
              )}`}
              noImageText={t("datagrid.no_image") || "No image available"}
            />

            {/* Technical Drawing */}
            <DetailImage
              title={t("datagrid.vektor")}
              imageUrl={pumpaData.vektor}
              altText={`Brake disc technical image for ${displayData(
                pumpaData.cislo_dilu
              )}`}
              noImageText={t("datagrid.no_image") || "No image available"}
            />
          </div>
        </div>
      </div>

      {/* Third section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Product details */}
        <div className="lg:w-full rounded-lg shadow border border-gray-200 bg-white p-8">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 grid-cols-2 gap-6">
              {/* Diameter */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("datagrid.diameter")}
                </h3>
                <p className="text-gray-700">{displayData(pumpaData.prumer)}</p>
              </div>

              {/* Note */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {t("datagrid.note")}
                </h3>
                <p className="text-gray-700">
                  {displayData(pumpaData.poznamka)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Compatibility Section */}
      <div className="rounded-lg shadow border border-gray-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            {t("datagrid.compatible_vehicles")}
          </h2>
          {!showVehicles && (
            <button
              onClick={() => setShowVehicles(true)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
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
              category="pumpa_vozidla"
              apiUrl={`${serverUrl}/api/goldfren/internal/pumpy/vozidla?limit=0&pumpa_id=${pumpaData.id}`}
            />
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-md">
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
