import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Components
import LoginForm from "../OtherComponents/LoginForm";
import LanguageSelector from "../OtherComponents/LanguageSelector";

// Services and Utilities
import { authService } from "../../services/authService";
import { RateLimiter } from "../../utils/rateLimiter";
import { validateLoginForm, securityUtils } from "../../utils/security";
import { getErrorMessage, getRateLimitErrorMessage } from "../../utils/errorHandler";

export default function LoginLayout() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const rateLimiter = useRef(new RateLimiter());
  const formRef = useRef(null);
  const location = useLocation();

  // Initialize form reference
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      // Clear the message after use
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      authService.cleanup();
      if (formRef.current) {
        securityUtils.clearSensitiveData(formRef.current);
      }
    };
  }, []);

  // Enhanced form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setValidationErrors({});

    // Check rate limiting
    if (rateLimiter.current.isBlocked()) {
      const remainingTime = rateLimiter.current.getRemainingTime();
      setError(getRateLimitErrorMessage(remainingTime, t));
      return;
    }

    // Get form data securely
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    // Validate inputs
    const errors = validateLoginForm(username, password, t);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      securityUtils.clearSensitiveData(e.target);
      return;
    }

    setIsLoading(true);

    try {
      // Attempt login
      await authService.login(username, password);

      // Clear sensitive form data immediately
      securityUtils.clearSensitiveData(e.target);

      // Clear rate limiting on successful login
      rateLimiter.current.clear();

      // Redirect to dashboard
      navigate("/admin/dashboard/", { replace: true });

    } catch (err) {
      // Record failed attempt for rate limiting
      rateLimiter.current.recordAttempt();
      
      // Clear sensitive form data
      securityUtils.clearSensitiveData(e.target);

      // Set appropriate error message
      setError(getErrorMessage(err, t));
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

          {/* Login Form */}
          <div ref={formRef}>
            <LoginForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              validationErrors={validationErrors}
              isBlocked={rateLimiter.current.isBlocked()}
              remainingTime={rateLimiter.current.getRemainingTime()}
            />
          </div>

          {/* Go back to homepage button */}
          <div className="mt-6">
            <Link to="/" className="w-full block">
              <button
                type="button"
                className="w-full bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 hover:text-black py-3 px-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300 cursor-pointer"
              >
                {t("login_screen.back_button")}
              </button>
            </Link>
          </div>

          {/* Language Selector */}
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}