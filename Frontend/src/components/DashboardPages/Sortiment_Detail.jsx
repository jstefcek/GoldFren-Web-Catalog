import { useLocation } from "react-router-dom";
import { formatUrlLinkPathtoLable } from "../../utils/utils";
import DataGrid_Admin from "../DataGrid/DataGrid_Admin";
import { useAuth } from "../../services/authContext";

const serverUrl = import.meta.env.VITE_API_URL;

export default function SortimentLayout() {
  // Extract the sortiment type from the URL path
  const location = useLocation();
  const sortimentType = location.pathname.split("/").pop();
  const { userInfo } = useAuth();

  // Format the sortiment type to label
  const sortimentLabel = formatUrlLinkPathtoLable(sortimentType);

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Page label */}
        <h2 className="text-3xl font-bold text-gray-900">
          {sortimentLabel}
        </h2>

        {/* Add button */}
        <button
          className="mt-2 mb-4 px-6 py-4 bg-red-600 text-white font-bold rounded-md cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Přidat {sortimentLabel}
        </button>

        {/* DataGrid */}
        <div className="mt-4 mb-8">
          <DataGrid_Admin
            category={`${sortimentType}`}
            apiUrl={`${serverUrl}/api/goldfren/internal/${sortimentType}?limit=0&states=True`}
            access_token={userInfo?.access_token}
            show_checkbox={true}
            listAll={false}
            refreshToken={null}
            dialogMode={true}
            dialogTitle={`Editace sortimentu - ${sortimentLabel}`}
          />
        </div>

      </div>
    </div>
  );
}
