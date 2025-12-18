import { useState } from "react";
import DataGrid_Admin from "../DataGrid/DataGrid_Admin";
import { useAuth } from "../../services/authContext";
import AlertDialog from "../ui/Custom_AlertDialog";
import CustomAddDialog from "../ui/Custom_AddDialog";
import { useTranslation } from "react-i18next";

const serverUrl = import.meta.env.VITE_API_URL;

export default function Users_Detail_Layout() {
  const { userInfo } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [alertData, setAlertData] = useState(null);
  const { t } = useTranslation();

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Display page label */}
        <h2 className="text-3xl font-bold text-gray-900">
          {t("admin.users.page_title")}
        </h2>

        {/* Add new account */}
        <button
          onClick={() => setShowDialog(true)}
          className="mt-2 mb-4 px-6 py-4 bg-red-600 text-white font-bold rounded-md cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {t("admin.users.add_user_button_text")}
        </button>

        {/* Display internal accounts */}
        <h2 className="text-xl font-bold text-gray-900 mt-8">
          {t("admin.users.intern_users_text")}
        </h2>
        <div className="mt-2">
          <DataGrid_Admin
            category="users"
            apiUrl={`${serverUrl}/api/goldfren/internal/users/?group=Internal`}
            access_token={userInfo?.access_token}
            show_checkbox={false}
            listAll={true}
            refreshToken={refreshToken}
            dialogMode={true}
            dialogTitle="Editace interního uživatele"
          />
        </div>

        {/* Display external accounts */}
        <h2 className="text-xl font-bold text-gray-900 mt-8">
          {t("admin.users.extern_users_text")}
        </h2>
        <div className="mt-2 mb-8">
          <DataGrid_Admin
            category="users"
            apiUrl={`${serverUrl}/api/goldfren/internal/users/?group=External`}
            access_token={userInfo?.access_token}
            show_checkbox={false}
            listAll={true}
            refreshToken={refreshToken}
            dialogMode={true}
            dialogTitle="Editace externího uživatele/aplikace"
          />
        </div>
      </div>

      {/* Add dialog */}
      {showDialog && (
        <CustomAddDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          category="users"
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
