import { useState, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LoginForm({ 
  onSubmit, 
  isLoading, 
  error, 
  validationErrors, 
  isBlocked,
  remainingTime 
}) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <form 
      onSubmit={onSubmit} 
      className="space-y-6" 
      autoComplete="on"
      noValidate
    >
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
          autoComplete="username"
          spellCheck="false"
          autoCapitalize="none"
          autoCorrect="off"
          required
          maxLength="50"
          minLength="3"
          pattern="[a-zA-Z0-9._-]+"
          title="Username must contain only letters, numbers, dots, hyphens, or underscores"
          className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 font-light ${
            validationErrors.username 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
          }`}
        />
        {validationErrors.username && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {validationErrors.username}
          </p>
        )}
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
            autoComplete="current-password"
            spellCheck="false"
            autoCapitalize="none"
            autoCorrect="off"
            required
            maxLength="128"
            minLength="8"
            className={`w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 font-light ${
              validationErrors.password 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
            }`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {validationErrors.password}
          </p>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div 
          className="bg-red-100 border border-red-400 rounded px-3 py-2 text-red-600 text-sm font-medium"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Login button */}
      <button
        type="submit"
        disabled={isLoading || isBlocked}
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
        ) : isBlocked ? (
          `${t("login_screen.blocked_button") || "Blocked"} (${remainingTime}m)`
        ) : (
          t("login_screen.login_button")
        )}
      </button>
    </form>
  );
}