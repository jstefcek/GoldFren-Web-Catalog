import { useState } from "react";
import DataGrid_Admin from "../DataGrid/DataGrid_Admin";
import { useAuth } from "../../services/authContext";
import { Info } from "lucide-react";

const serverUrl = import.meta.env.VITE_API_URL;

export default function Users_Detail_Layout() {
  const { userInfo } = useAuth();

  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    isStaff: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddUser = () => {
    const confirmed = confirm("Opravdu chcete přidat uživatele?");
    if (confirmed) {
      console.log("User data to add:", form);
      setShowDialog(false);
      // Call API here if needed
    }
  };

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        {/* Page title */}
        <h2 className="text-3xl font-bold text-gray-900">
          Přehled registrovaných uživatelů
        </h2>

        {/* Btn to add user */}
        <button
          onClick={() => setShowDialog(true)}
          className="mt-2 px-8 py-4 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Přidat uživatele
        </button>

        {/* Internal users */}
        <h2 className="text-xl font-bold text-gray-900 mt-8">
          Přehled interních uživatelů
        </h2>

        <div className="mt-4">
          <DataGrid_Admin
            category="users"
            apiUrl={`${serverUrl}/api/goldfren/internal/users/?group=Internal`}
            access_token={userInfo?.access_token}
            show_checkbox={false}
            listAll={true}
          />
        </div>

        {/* External users */}
        <h2 className="text-xl font-bold text-gray-900 mt-8">
          Přehled externích uživatelů
        </h2>

        <div className="mt-4 mb-8">
          <DataGrid_Admin
            category="users"
            apiUrl={`${serverUrl}/api/goldfren/internal/users/?group=External`}
            access_token={userInfo?.access_token}
            show_checkbox={false}
            listAll={true}
          />
        </div>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Přidání nového uživatele
            </h3>

            {[
              {
                label: "Jméno",
                name: "firstName",
                tooltip: "Zadejte křestní jméno uživatele.",
              },
              {
                label: "Příjmení",
                name: "lastName",
                tooltip: "Zadejte příjmení uživatele.",
              },
              {
                label: "Email",
                name: "email",
                tooltip: "Zadejte pracovní email uživatele.",
              },
              {
                label: "Uživatelské jméno",
                name: "username",
                tooltip: "Slouží pro přihlášení do systému.",
              },
            ].map(({ label, name, tooltip }) => (
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                  <span
                    title={tooltip}
                    className="ml-1 inline-block text-gray-400 cursor-help"
                  >
                    <Info className="w-4 h-4 inline" />
                  </span>
                </label>
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            ))}

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="isStaff"
                name="isStaff"
                checked={form.isStaff}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="isStaff" className="text-sm text-gray-700">
                Administrátor
                <br />
                <span className="text-xs text-gray-500">
                  Označte, pokud má mít uživatel práva administrátora.
                </span>
                <span
                  title="Označte, pokud má mít uživatel práva zaměstnance."
                  className="ml-1 text-gray-400 cursor-help"
                >
                  <Info className="w-4 h-4 inline" />
                </span>
              </label>
            </div>

            {/* Action buttons in dialog */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Zavřít
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
              >
                Přidat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}