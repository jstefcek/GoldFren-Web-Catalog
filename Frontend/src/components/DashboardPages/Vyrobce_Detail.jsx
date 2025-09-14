import { useState } from "react";
import AlertDialog from "../ui/Custom_AlertDialog";
import CustomAddDialog from "../ui/Custom_AddDialog";
import DataGrid_Admin from "../DataGrid/DataGrid_Admin";
import { useAuth } from "../../services/authContext";

const serverUrl = import.meta.env.VITE_API_URL;

export default function Vyrobce_Detail_Layout() {
  const { userInfo } = useAuth();
    const [showDialog, setShowDialog] = useState(false);
    const [refreshToken, setRefreshToken] = useState(Date.now());
    const [alertData, setAlertData] = useState(null);

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Page label */}
        <h2 className="text-3xl font-bold text-gray-900">
          Přehled výrobců vozidel
        </h2>

        {/* Add button */}
        <button
          className="mt-2 mb-4 px-6 py-4 bg-red-600 text-white font-bold rounded-md cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => setShowDialog(true)}
        >
          Přidat výrobce vozidla
        </button>

        {/* Display internal accounts */}
        <h2 className="text-xl font-bold text-gray-900 mt-8">
          Přehled interních uživatelů
        </h2>
        <div className="mt-2 mb-12">
          <DataGrid_Admin
            category="vyrobce"
            apiUrl={`${serverUrl}/api/goldfren/internal/vozidla/vyrobce?all_params=true`}
            show_checkbox={false}
            refreshToken={refreshToken}
            dialogMode={true}
            dialogTitle="Editace výrobce vozidla"
          />
        </div>
      </div>

      {/* Add dialog */}
      {showDialog && (
        <CustomAddDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          category="vyrobce"
          access_token={userInfo?.access_token}
          onSuccess={() => {
            setShowDialog(false);
            setRefreshToken(Date.now());
          }}
          onError={(errMsg) =>
            setAlertData({
              title: "Chyba",
              message: errMsg,
              type: "error",
              duration: 5,
              onClose: () => setAlertData(null),
            })
          }
        />
      )}

      {/* Alert Dialog */}
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
