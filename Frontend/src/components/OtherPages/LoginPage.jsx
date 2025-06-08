import { useState, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
const serverUrl = import.meta.env.VITE_API_URL;

export default function LoginLayout() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Languages
  const languages = [
    { code: "cs", name: "Česky", flagIcon: "/icons/czech.svg" },
    { code: "en", name: "English", flagIcon: "/icons/english.svg" },
    { code: "de", name: "Deutsch", flagIcon: "/icons/german.svg" },
  ];

  // Change language
  const handleLanguageChange = useCallback((lng) => {
    i18n.changeLanguage(lng);
  }, [i18n]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form submit handler (with Basic Auth, JWT storage, redirect)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Get the username and password from the form
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    // Encode Basic Auth credentials
    const credentials = btoa(`${username}:${password}`);

    // Make the API request to authenticate
    try {
      const response = await fetch(serverUrl + "/api/auth/token/", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Invalid credentials or server error.");
      }

      // Parse the response data
      const data = await response.json();
      
      // Save the Data to sessionStorage
      sessionStorage.setItem("user_logged_in", true);
      sessionStorage.setItem("access_token", data.access);
      sessionStorage.setItem("session_data", data);

      // Redirect to dashboard
      navigate("/admin/dashboard/");
    } catch (err) {
      setError(t("login_screen.login_error") || "Invalid username or password.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(/goldfren_motorcycle_gray.png)",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-30"></div>
      <div className="w-full max-w-lg mx-4 relative z-10 shadow-2xl">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 border border-gray-200">
          {/* Logo */}
          <div className="flex-shrink-0 mb-8">
            <div className="flex items-center justify-center">
              <Link to="/">
                <img
                  src="/logo/goldfren-logo.svg"
                  alt="GoldFren Logo"
                  className="h-10 sm:h-12 w-auto"
                  width="128"
                  height="64"
                />
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username input field */}
            <div>
              <label
                htmlFor="username"
                className="block text-md font-semibold text-gray-800 mb-2"
              >
                {t("login_screen.username")}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder={t("login_screen.username_placeholder")}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 font-light"
              />
            </div>

            {/* Password input field */}
            <div>
              <label
                htmlFor="password"
                className="block text-md font-semibold text-gray-800 mb-2"
              >
                {t("login_screen.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder={t("login_screen.password_placeholder")}
                  required
                  className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 font-light"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 rounded px-3 py-2 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white text-lg font-semibold shadow-lg py-3 px-4 rounded-md hover:bg-red-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("login_screen.login_loading")}
                </div>
              ) : (
                t("login_screen.login_button")
              )}
            </button>

            {/* Go back to homepage button */}
            <Link to="/" className="w-full block">
              <button
                type="button"
                className="w-full bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 hover:text-black py-3 px-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300 cursor-pointer"
              >
                {t("login_screen.back_button")}
              </button>
            </Link>

            {/* Language Selector */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center mb-3">
                <span className="text-sm text-gray-500">{t("selectLanguage")}</span>
              </div>
              <div className="flex justify-center space-x-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center px-3 py-2 rounded-md border transition-all duration-200 ${
                      i18n.language === lang.code
                        ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <img src={lang.flagIcon} alt={lang.code} className="h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
