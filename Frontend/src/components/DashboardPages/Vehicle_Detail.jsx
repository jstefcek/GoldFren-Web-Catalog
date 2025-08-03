import { useLocation } from "react-router-dom";
import { formatUrlLinkPathtoLable } from "../../utils/utils";
import DataGrid_Admin from "../DataGrid/DataGrid_Admin";
import { useAuth } from "../../services/authContext";

const serverUrl = import.meta.env.VITE_API_URL;

export default function VehicleLayout() {
  // Extract the vehicle type from the URL path
  const location = useLocation();
  const vehicleType = location.pathname.split("/").pop();
  const { userInfo } = useAuth();

  // Format the vehicle type to label
  const vehicleLabel = formatUrlLinkPathtoLable(vehicleType);

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Page label */}
        <h2 className="text-3xl font-bold text-gray-900">
          {vehicleLabel}
        </h2>

        {/* DataGrid */}
        <div className="mt-4 mb-8">
          <DataGrid_Admin
            category={`vozidla`}
            apiUrl={`${serverUrl}/api/goldfren/internal/vozidla/kategorie?kategorie_kod=${vehicleType}`}
            access_token={userInfo?.access_token}
            show_checkbox={true}
            listAll={false}
            refreshToken={null}
            dialogMode={true}
            dialogTitle={`Editace vozidla - ${vehicleLabel}`}
          />
        </div>

      </div>
    </div>
  );
}
