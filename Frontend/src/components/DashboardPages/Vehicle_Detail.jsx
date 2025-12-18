import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatUrlLinkPathtoLable } from "../../utils/utils";
import DataGrid_Admin from "../DataGrid/DataGrid_Admin";
import { useAuth } from "../../services/authContext";
import CustomAddDialog from "../ui/Custom_AddDialog";
import AlertDialog from "../ui/Custom_AlertDialog";
import { useTranslation } from "react-i18next";

const serverUrl = import.meta.env.VITE_API_URL;

export default function VehicleLayout() {
  // Extract the vehicle type from the URL path
  const location = useLocation();
  const vehicleType = location.pathname.split("/").pop();
  const { userInfo } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [alertDialog, setAlertDialog] = useState(null);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const { t } = useTranslation();

  // Format the vehicle type to label
  const vehicleLabel = formatUrlLinkPathtoLable(vehicleType);

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Page label */}
        <h2 className="text-3xl font-bold text-gray-900">{t("admin.vehicle." + vehicleType)}</h2>

        {/* Add button */}
        <button
          className="mt-2 mb-4 px-6 py-4 bg-red-600 text-white font-bold rounded-md cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => setShowDialog(true)}
        >
          {t("admin.vehicle." + vehicleType + "_add_button")}
        </button>

        {/* DataGrid */}
        <div className="mt-4 mb-8">
          <DataGrid_Admin
            category={`vozidla`}
            apiUrl={`${serverUrl}/api/goldfren/internal/vozidla/kategorie?kategorie_kod=${vehicleType}`}
            access_token={userInfo?.access_token}
            show_checkbox={true}
            listAll={false}
            refreshToken={refreshToken}
            dialogMode={true}
            dialogTitle={`Editace vozidla - ${vehicleLabel}`}
          />
        </div>
      </div>

      {/* Add dialog */}
      {showDialog && (
        <CustomAddDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          category="vozidla"
          access_token={userInfo?.access_token}
          onSuccess={() => {
            setShowDialog(false);
            setRefreshToken(Date.now());
            setAlertDialog({
              title: "Úspěch",
              message: "Vozidlo bylo úspěšně vytvořeno.",
              type: "success",
              duration: 7,
            });
          }}
          onError={(errMsg) =>
            setAlertDialog({
              title: "Chyba",
              message: errMsg,
              type: "error",
              duration: 7,
              onClose: () => setAlertDialog(null),
            })
          }
        />
      )}

      {/* Alert Dialog for errors or confirmations */}
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
  );
}
