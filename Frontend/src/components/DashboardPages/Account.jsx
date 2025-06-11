import { useState } from "react";
import { ShieldCheck, Mail, User, Lock, Shield, AlertCircle, CheckCircle, X, Eye, EyeOff } from "lucide-react";
const serverUrl = import.meta.env.VITE_API_URL;

export default function AccountLayout() {
  // Retrieve session data from sessionStorage
  const data = JSON.parse(sessionStorage.getItem("session_data") || "{}");
  console.log("Account data:", data);

  // Parse user data from session storage
  const user = {
    firstName: data.user.first_name || "XNA",
    lastName: data.user.last_name || "XNA",
    email: data.user.email || "XNA",
    isAdmin: data.user.isAdmin || false,
    isActive: data.user.isActive || false,
    isInternal: data.user.isInternal || false,
    accessToken: data.access
  };

  // Check if user data is valid
  const [form, setForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Password visibility states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Check if passwords match
  const passwordsMatch = form.new && form.confirm && form.new === form.confirm;

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Clear all form fields
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
      setMessage({ type: "error", text: "Nové heslo musí mít alespoň 6 znaků" });
      return false;
    }
    if (form.new !== form.confirm) {
      setMessage({ type: "error", text: "Nová hesla se neshodují" });
      return false;
    }
    if (form.current === form.new) {
      setMessage({ type: "error", text: "Nové heslo musí být odlišné od aktuálního" });
      return false;
    }
    return true;
  };

  // Enhanced password change function
  const handlePassChange = async (oldPassword, newPassword) => {
    console.log("Changing password for user: ", user.email);
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Make API request to change password
      const response = await fetch(`${serverUrl}/api/goldfren/auth/change_password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Password changed successfully:", result);
        setMessage({ type: "success", text: "Heslo bylo úspěšně změněno" });
        clearForm();
        setShowConfirmDialog(false);
        return result;
      } else {
        console.error("Failed to change password:", response.statusText);
        setMessage({ 
          type: "error", 
          text: result.message || result.error || "Chyba při změně hesla"
        });
        throw new Error(result.message || "Failed to change password");
      }

    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: "error", text: "Chyba připojení k serveru" });
      throw error;
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

  const handleConfirmPasswordChange = async () => {
    try {
      await handlePassChange(form.current, form.new);
    } catch (error) {
      // Error handling is done in handlePassChange
      console.error("Error during password change:", error);
    }
  };

  const handleCloseMessage = () => {
    setMessage({ type: "", text: "" });
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    clearForm();
  };

  return (
    <div className="min-h-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-auto mx-auto mt-4">
        
        {/* Admin section */}
        {user.isAdmin && (
          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-400 rounded-lg p-2 shadow mb-4 flex items-center gap-6">
            <ShieldCheck className="w-12 h-12 text-yellow-700" strokeWidth={2.5} />
            <div>
              <div className="text-xl font-bold text-yellow-900">Administrátorský účet</div>
              <div className="text-yellow-800 mt-1 text-sm">
                Máte oprávnění administrátora. <br />
                <span className="italic text-sm">Máte k dispozici speciální funkce a ovládací prvky.</span>
              </div>
            </div>
          </div>
        )}

        {/* Main account info */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Přehled účtu</h1>
          <p className="text-gray-600 text-lg mb-4">Podrobnosti o vašem profilu</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <User className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">Křestní jméno</div>
                <div className="text-gray-900 font-bold text-lg">{user.firstName}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <User className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">Přijmení</div>
                <div className="text-gray-900 font-bold text-lg">{user.lastName}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Mail className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">E-mailová adresa</div>
                <div className="text-gray-900 font-bold text-lg">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <Shield className="w-8 h-8 text-red-700" />
              <div>
                <div className="text-gray-700 font-medium">Status účtu</div>
                <div className="text-gray-900 font-bold text-lg">{user.isActive && (
                  <span className="text-green-600">Aktivní</span>
                ) || (
                  <span className="text-red-800">Neaktivní</span>
                )}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Message display */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg border flex items-center justify-between ${
            message.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
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

        {/* Password change section */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Změna hesla</h2>
          <p className="text-gray-600 mb-6">Níže můžete aktualizovat heslo k vašemu účtu.</p>
          <div className="grid grid-cols-1 gap-5 max-w-md">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Vaše aktuální heslo
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  className="bg-transparent outline-none flex-1"
                  type={showPasswords.current ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.current}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, current: e.target.value }))
                  }
                  placeholder="Vložte aktuální heslo"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Nové heslo
              </label>
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50 border-2 transition-colors ${
                form.confirm && form.new ? 
                  (passwordsMatch ? 'border-green-400' : 'border-red-400') 
                  : 'border-gray-200'
              }`}>
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  className="bg-transparent outline-none flex-1"
                  type={showPasswords.new ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.new}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, new: e.target.value }))
                  }
                  placeholder="Zadejte nové heslo (alespoň 6 znaků)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Potvrzení nového hesla
              </label>
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50 border-2 transition-colors ${
                form.confirm && form.new ? 
                  (passwordsMatch ? 'border-green-400' : 'border-red-400') 
                  : 'border-gray-200'
              }`}>
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  className="bg-transparent outline-none flex-1"
                  type={showPasswords.confirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirm: e.target.value }))
                  }
                  placeholder="Zadejte znovu nové heslo"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.confirm && form.new && (
                <div className={`text-sm mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordsMatch ? '✓ Hesla se shodují' : '✗ Hesla se neshodují'}
                </div>
              )}
            </div>
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
              {isLoading ? "Mění se heslo..." : "Změnit heslo"}
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-mx mx-4 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">Potvrzení změny hesla</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Opravdu chcete změnit heslo? Tato akce je nevratná a budete se muset přihlásit znovu s novým heslem.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium disabled:opacity-50"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleConfirmPasswordChange}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-red-700 hover:bg-red-800 text-white"
                  }`}
                >
                  {isLoading ? "Mění se..." : "Potvrdit změnu"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}