import { useState, useCallback, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const serverUrl = import.meta.env.VITE_API_URL;

// Input validation utilities
const validateInput = (input, type) => {
  const sanitized = input.trim();
  
  if (type === 'username') {
    // Allow alphanumeric, underscore, hyphen, dot
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    return usernameRegex.test(sanitized) && sanitized.length >= 3 && sanitized.length <= 50;
  }
  
  if (type === 'password') {
    return sanitized.length >= 8 && sanitized.length <= 128;
  }
  
  return false;
};

// Rate limiting utility
class RateLimiter {
  constructor(maxAttempts = 3, windowMs = 15 * 60 * 1000) { // 3 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = this.getStoredAttempts();
  }

  getStoredAttempts() {
    try {
      const stored = sessionStorage.getItem('login_attempts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveAttempts() {
    try {
      sessionStorage.setItem('login_attempts', JSON.stringify(this.attempts));
    } catch {
      // Handle storage errors gracefully
    }
  }

  cleanupOldAttempts() {
    const now = Date.now();
    this.attempts = this.attempts.filter(attempt => now - attempt < this.windowMs);
    this.saveAttempts();
  }

  isBlocked() {
    this.cleanupOldAttempts();
    return this.attempts.length >= this.maxAttempts;
  }

  recordAttempt() {
    this.cleanupOldAttempts();
    this.attempts.push(Date.now());
    this.saveAttempts();
  }

  getRemainingTime() {
    this.cleanupOldAttempts();
    if (this.attempts.length === 0) return 0;
    const oldestAttempt = Math.min(...this.attempts);
    const remainingMs = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, Math.ceil(remainingMs / 1000 / 60)); // minutes
  }

  clear() {
    this.attempts = [];
    sessionStorage.removeItem('login_attempts');
  }
}

export default function LoginLayout() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const rateLimiter = useRef(new RateLimiter());

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

  // Input validation
  const validateForm = (username, password) => {
    const errors = {};
    
    if (!validateInput(username, 'username')) {
      errors.username = t("login_screen.invalid_username") || "Username must be 3-50 characters and contain only letters, numbers, dots, hyphens, or underscores.";
    }
    
    if (!validateInput(password, 'password')) {
      errors.password = t("login_screen.invalid_password") || "Password must be 8-128 characters long.";
    }
    
    return errors;
  };

  // Secure credential clearing
  const clearSensitiveData = (formElement) => {
    if (formElement) {
      const passwordInput = formElement.querySelector('input[name="password"]');
      if (passwordInput) {
        passwordInput.value = '';
      }
    }
  };

  // Form submit handler with enhanced security
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setValidationErrors({});

    // Check rate limiting
    if (rateLimiter.current.isBlocked()) {
      const remainingTime = rateLimiter.current.getRemainingTime();
      setError(
        t("login_screen.rate_limit_error", { minutes: remainingTime }) || 
        `Too many failed attempts. Please try again in ${remainingTime} minutes.`
      );
      return;
    }

    // Get form data
    const formData = new FormData(e.target);
    const username = formData.get("username")?.trim();
    const password = formData.get("password");

    // Validate inputs
    const errors = validateForm(username, password);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    // Create timeout for request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      // Encode credentials securely
      const credentials = btoa(unescape(encodeURIComponent(`${username}:${password}`)));

      // Make the API request
      const response = await fetch(`${serverUrl}/api/auth/token/`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // CSRF protection header
        },
        signal: controller.signal,
        credentials: 'same-origin', // Include cookies for CSRF token if used
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Record failed attempt for rate limiting
        rateLimiter.current.recordAttempt();
        
        // Generic error message to prevent information leakage
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data.access || typeof data.access !== 'string') {
        throw new Error("Invalid server response");
      }

      // Clear sensitive form data immediately
      clearSensitiveData(e.target);

      // Store auth data securely
      try {
        sessionStorage.setItem("user_logged_in", "true");
        sessionStorage.setItem("access_token", data.access);
        sessionStorage.setItem("session_data", JSON.stringify(data));

        // Clear rate limiting on successful login
        rateLimiter.current.clear();
      } catch (storageError) {
        console.error("Storage error:", storageError);
        throw new Error("Failed to store session data");
      }

      // Redirect to dashboard
      navigate("/admin/dashboard/", { replace: true });

    } catch (err) {
      clearTimeout(timeoutId);
      clearSensitiveData(e.target);

      if (err.name === 'AbortError') {
        setError(t("login_screen.timeout_error") || "Request timed out. Please try again.");
      } else {
        setError(t("login_screen.login_error") || "Invalid username or password.");
      }
      
      console.error("Login error:", {
        message: err.message,
        timestamp: new Date().toISOString()
      });
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

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
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
                required
                maxLength="50"
                className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 font-light ${
                  validationErrors.username 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                }`}
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
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
                  required
                  maxLength="128"
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
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Error message */}
            {error && rateLimiter.current.isBlocked() (
              <div className="bg-red-100 border border-red-400 rounded px-3 py-2 text-red-600 text-sm font-medium">
                {error || t("login_screen.blocked_button")}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading || rateLimiter.current.isBlocked()}
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
              ) : rateLimiter.current.isBlocked() ? (
                `${t("login_screen.blocked_button") || "Blocked"} (${rateLimiter.current.getRemainingTime()}m)`
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
                    type="button"
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