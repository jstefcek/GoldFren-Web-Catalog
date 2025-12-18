import { useState } from "react";
import { useAuth } from "../../services/authContext";
import {
  ShieldCheck,
  Mail,
  User,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const serverUrl = import.meta.env.VITE_API_URL;

export default function AccountLayout() {
  const { userInfo, logout } = useAuth();
  const user = userInfo?.raw?.user || {};
  const accessToken = userInfo?.raw?.access || "";
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { t } = useTranslation();

  const passwordsMatch = form.new && form.confirm && form.new === form.confirm;

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Clear form fields
  const clearForm = () => {
    setForm({ current: "", new: "", confirm: "" });
  };

  // Validate form inputs
  const validateForm = () => {
    if (!form.current.trim()) {
      setMessage({ type: "error", text: "Zadejte aktuální heslo" });
      return false;
    }
    if (!form.new.trim()) {
      setMessage({ type: "error", text: "Zadejte nové heslo" });
      return false;
    }
    if (form.new.length < 6) {
      setMessage({
        type: "error",
        text: "Nové heslo musí mít alespoň 6 znaků",
      });
      return false;
    }
    if (form.new !== form.confirm) {
      setMessage({ type: "error", text: "Nová hesla se neshodují" });
      return false;
    }
    if (form.current === form.new) {
      setMessage({
        type: "error",
        text: "Nové heslo musí být odlišné od aktuálního",
      });
      return false;
    }
    return true;
  };

  // Handle password change request
  const handlePassChange = async (oldPassword, newPassword) => {
  setIsLoading(true);
  setMessage({ type: "", text: "" });

  try {
    const response = await fetch(
      `${serverUrl}/api/goldfren/internal/users/change_password/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      // Password changed successfully - log out the user
      setMessage({ type: "success", text: "Heslo bylo úspěšně změněno. Budete přesměrováni na přihlašovací stránku." });
      
      // Clear form and close dialog
      clearForm();
      setShowConfirmDialog(false);
      
      // Log out user after a short delay
      setTimeout(() => {
        logout("Heslo bylo úspěšně změněno. Přihlaste se prosím znovu s novým heslem.");
      }, 2000);
      
    } else {
      setMessage({
        type: "error",
        text: result.message || result.error || "Chyba při změně hesla",
      });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    setMessage({ type: "error", text: "Chyba připojení k serveru" });
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmPasswordChange = () => {
    handlePassChange(form.current, form.new);
  };

  const handleCloseMessage = () => setMessage({ type: "", text: "" });
  const handleCancel = () => {
    setShowConfirmDialog(false);
    clearForm();
  };

  if (!userInfo?.loggedIn) {
    return (
      <div className="p-8 text-center text-gray-700">
        <p className="text-xl">
          {t("admin.account.not_logged_in_text")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-auto mx-auto mt-4">
        {user.isAdmin && (
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-400 rounded-lg p-2 shadow mb-4 flex items-center gap-6">
            <ShieldCheck
              className="w-12 h-12 text-yellow-700"
              strokeWidth={2.5}
            />
            <div>
              <div className="text-xl font-bold text-yellow-900">
                {t("admin.account.admin_dialog_title_text")}
              </div>
              <div className="text-yellow-800 mt-1 text-sm">
                {t("admin.account.admin_dialog_paragraph_text")} <br />
                <span className="italic text-sm">
                  {t("admin.account.admin_dialog_paragraph_text_next")}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("admin.account.page_title")}
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            {t("admin.account.page_title_paragraph")}
          </p>

          {/* Display username */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-8">
            <User className="w-8 h-8 text-red-700" />
            <div>
              <div className="text-gray-700 font-medium">
                {t("admin.account.username")}
              </div>
              <div className="text-gray-900 font-bold text-lg">
                {user.username || "XNA"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display first name */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <User className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">{t("admin.account.first_name")}</div>
                <div className="text-gray-900 font-bold text-lg">
                  {user.first_name || "XNA"}
                </div>
              </div>
            </div>

            {/* Display last name */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <User className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">{t("admin.account.last_name")}</div>
                <div className="text-gray-900 font-bold text-lg">
                  {user.last_name || "XNA"}
                </div>
              </div>
            </div>

            {/* Display email */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Mail className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">
                  {t("admin.account.email")}
                </div>
                <div className="text-gray-900 font-bold text-lg">
                  {user.email || "XNA"}
                </div>
              </div>
            </div>

            {/* Display account status */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Shield className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">{t("admin.account.status")}</div>
                <div className="text-gray-900 font-bold text-lg">
                  {user.isActive ? (
                    <span className="text-green-600">{t("admin.account.active")}</span>
                  ) : (
                    <span className="text-red-800">{t("admin.account.inactive")}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg border flex items-center justify-between ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={handleCloseMessage}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("admin.account.password_change_text")}</h2>
          <p className="text-gray-600 mb-6">
            {t("admin.account.password_change_paragraph_text")}
          </p>
          <div className="grid grid-cols-1 gap-5 max-w-md">
            {["current", "new", "confirm"].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 font-medium mb-1">
                  {field === "current"
                    ? t("admin.account.password_actual_text")
                    : field === "new"
                    ? t("admin.account.password_new_text")
                    : t("admin.account.password_confirm_text")}
                </label>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50 ${
                    field !== "current" && form.new && form.confirm
                      ? passwordsMatch
                        ? "border-2 border-green-400"
                        : "border-2 border-red-400"
                      : "border border-gray-200"
                  }`}
                >
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input
                    className="bg-transparent outline-none flex-1"
                    type={showPasswords[field] ? "text" : "password"}
                    autoComplete={
                      field === "current" ? "current-password" : "new-password"
                    }
                    value={form[field]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field]: e.target.value }))
                    }
                    placeholder={
                      field === "current"
                        ? t("admin.account.password_current_placeholder")
                        : field === "new"
                        ? t("admin.account.password_new_placeholder")
                        : t("admin.account.password_confirm_placeholder")
                    }
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPasswords[field] ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {field === "confirm" && form.confirm && form.new && (
                  <div
                    className={`text-sm mt-1 ${
                      passwordsMatch ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {passwordsMatch
                      ? t("admin.account.password_change_match_correct_text")
                      : t("admin.account.password_change_match_incorrect_text")}
                  </div>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className={`mt-2 font-bold rounded-lg shadow p-3 transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-red-700 hover:bg-red-800 text-white cursor-pointer"
              }`}
            >
              {isLoading ? t("admin.account.password_change_loading_text") : t("admin.account.password_change_submit_changed_text")}
            </button>
          </div>
        </div>

        {showConfirmDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {t("admin.account.password_change_submit_text")}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                {t("admin.account.password_change_submit_paragraph_text")}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium disabled:opacity-50"
                >
                  {t("admin.account.password_change_decline_text")}
                </button>
                <button
                  onClick={handleConfirmPasswordChange}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-red-700 hover:bg-red-800 text-white"
                  }`}
                >
                  {isLoading ? t("admin.account.password_change_loading_text") : t("admin.account.password_change_confirm_change_text")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
