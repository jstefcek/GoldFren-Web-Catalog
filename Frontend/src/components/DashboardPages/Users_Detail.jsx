import { useState, useEffect } from "react";
import DataGrid_Admin from "../DataGrid/DataGrid_Admin";
import { useAuth } from "../../services/authContext";
import { Eye, EyeOff } from "lucide-react";
import { registration_config } from "./UserDetail_Config/Dialog_User_Registration";
import ConfirmDialog from "../ui/Custom_ConfirmDialog";
import AlertDialog from "../ui/Custom_AlertDialog";

const serverUrl = import.meta.env.VITE_API_URL;

export default function Users_Detail_Layout() {
  const { userInfo } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [confirmData, setConfirmData] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    isStaff: false,
  });

  // Function to remove czech diacritics from a string
  const removeDiacritics = (str) =>
    str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/č/g, "c")
      .replace(/ď/g, "d")
      .replace(/ě/g, "e")
      .replace(/ň/g, "n")
      .replace(/ř/g, "r")
      .replace(/š/g, "s")
      .replace(/ť/g, "t")
      .replace(/ů/g, "u")
      .replace(/ž/g, "z")
      .replace(/Č/g, "C")
      .replace(/Ď/g, "D")
      .replace(/Ě/g, "E")
      .replace(/Ň/g, "N")
      .replace(/Ř/g, "R")
      .replace(/Š/g, "S")
      .replace(/Ť/g, "T")
      .replace(/Ů/g, "U")
      .replace(/Ž/g, "Z");

  useEffect(() => {
    const autoUsername =
      form.firstName && form.lastName
        ? `${removeDiacritics(
            form.firstName[0] || ""
          ).toLowerCase()}${removeDiacritics(form.lastName)
            .toLowerCase()
            .replace(/\s/g, "")}`
        : "";
    setForm((prev) => ({ ...prev, username: autoUsername }));
  }, [form.firstName, form.lastName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form fields
  const validateForm = () => {
    const errors = [];

    if (form.firstName.trim().length < 4) {
      errors.push("Jméno musí mít alespoň 4 znaky.");
    }
    if (form.lastName.trim().length < 4) {
      errors.push("Příjmení musí mít alespoň 4 znaky.");
    }
    if (form.password && form.password.length < 8) {
      errors.push("Heslo musí mít alespoň 8 znaků.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(form.email.trim())) {
      errors.push("Email není ve správném formátu.");
    }
    return errors;
  };

  // Function that would add new user
  const doAddUser = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${serverUrl}/api/goldfren/internal/users/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.access_token}`,
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            is_staff: form.isStaff,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || "Chyba při registraci uživatele.");
      }

      setAlertData({
        title: "Úspěch",
        message: "Uživatel byl úspěšně přidán.",
        type: "success",
        duration: 5,
        onClose: () => setAlertData(null),
      });

      setShowDialog(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        isStaff: false,
      });
      setRefreshToken(Date.now());
    } catch (error) {
      setAlertData({
        title: "Chyba",
        message: error.message,
        type: "error",
        duration: 5,
        onClose: () => setAlertData(null),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // To handle confirmation dialog for adding user
  const handleAddUser = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAlertData({
        title: "Neplatný formulář",
        message: validationErrors.join("\n"),
        type: "error",
        duration: 5,
        onClose: () => setAlertData(null),
      });
      return;
    }
    setConfirmData({
      title: "Potvrzení",
      message: "Opravdu chcete přidat nového uživatele?",
      onConfirm: () => {
        setConfirmData(null);
        doAddUser();
      },
      onCancel: () => setConfirmData(null),
    });
  };

  // To handle closing the dialog
  const handleClose = () => {
    setConfirmData({
      title: "Zavřít formulář",
      message: "Opravdu chcete zavřít formulář? Změny budou ztraceny.",
      onConfirm: () => {
        setConfirmData(null);
        setShowDialog(false);
      },
      onCancel: () => setConfirmData(null),
    });
  };

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
      <div className="max-w-auto mx-auto mt-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Přehled registrovaných uživatelů
        </h2>

        <button
          onClick={() => setShowDialog(true)}
          className="mt-2 px-8 py-4 bg-red-600 text-white font-bold rounded-md cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Přidat uživatele
        </button>

        <h2 className="text-xl font-bold text-gray-900 mt-8">
          Přehled interních uživatelů
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

        <h2 className="text-xl font-bold text-gray-900 mt-8">
          Přehled externích uživatelů
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

      {showDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
              Přidání nového uživatele
            </h3>

            <div className="space-y-4">
              {registration_config.columns.map(
                ({ label, name, placeholder, type }) => (
                  <div key={name} className="relative">
                    <label
                      htmlFor={name}
                      className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                    >
                      {label}
                    </label>

                    <div className="relative">
                      <input
                        id={name}
                        type={
                          type === "password"
                            ? showPassword
                              ? "text"
                              : "password"
                            : type
                        }
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none ${
                          name === "username" ? "bg-gray-100" : ""
                        }`}
                        disabled={name === "username"}
                      />

                      {type === "password" && (
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          aria-label="Zobrazit heslo"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="isStaff"
                  name="isStaff"
                  checked={form.isStaff}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label
                  htmlFor="isStaff"
                  className="text-sm text-gray-700 leading-snug"
                >
                  Role Administrátora
                  <span className="block text-xs text-gray-500">
                    Administrátorské práva umožňují správu uživatelů a přístup k
                    administraci webového katalogu.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                disabled={isSubmitting}
              >
                Zavřít
              </button>
              <button
                onClick={handleAddUser}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
              >
                {isSubmitting ? "Přidávání..." : "Přidat"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmData && (
        <ConfirmDialog
          title={confirmData.title}
          message={confirmData.message}
          onConfirm={confirmData.onConfirm}
          onCancel={confirmData.onCancel}
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
