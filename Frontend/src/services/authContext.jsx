// AuthContext.js
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { authService } from "./authService";
import { securityUtils } from "../utils/security";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);
  const { t } = useTranslation();

  const logout = useCallback((reason = "", options = {}) => {
    const {
      redirectTo = "/login",
      replace = true,
    } = options;

    authService.clearSessionData();
    setUserInfo(null);

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (reason) {
      try {
        sessionStorage.setItem("logout_message", reason);
      } catch (error) {
        console.error("Failed to persist logout message", error);
      }
    } else {
      sessionStorage.removeItem("logout_message");
    }

    navigate(redirectTo, {
      replace,
      state: reason ? { message: reason } : undefined,
    });
  }, [navigate]);

  const setupAutoLogout = useCallback(() => {
    const tokenExpire = sessionStorage.getItem("token_expire");
    const expire = tokenExpire ? parseInt(tokenExpire, 10) : NaN;
    if (!expire || Number.isNaN(expire)) return;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const delay = (expire - now) * 1000;

    // Clear any existing timeout to prevent multiple triggers
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    const handleSessionTimeout = () => {
      logout(t("login_screen.session_expired"));
    };

    if (delay <= 0) {
      handleSessionTimeout();
    } else {
      logoutTimerRef.current = setTimeout(handleSessionTimeout, delay);
    }
  }, [logout, t]);

  const loadUser = useCallback(() => {
    const loggedIn = sessionStorage.getItem("user_logged_in") === "true";
    if (loggedIn) {
      const accessToken = authService.getStoredAccessToken();
      if (!accessToken) {
        authService.clearSessionData({ silent: true });
        setUserInfo(null);
        return;
      }

      const sessionDataRaw = sessionStorage.getItem("session_data");
      if (!sessionDataRaw) {
        authService.clearSessionData({ silent: true });
        setUserInfo(null);
        return;
      }
      try {
        // Parse the session data and extract user information
        const sessionData = JSON.parse(sessionDataRaw);
        if (!securityUtils.validateJWTFormat(sessionData?.access)) {
          authService.clearSessionData({ silent: true });
          setUserInfo(null);
          return;
        }
        const firstname = sessionData?.user?.first_name || "User";
        const surname = sessionData?.user?.last_name || "";
        const username = sessionData?.user?.username || "";

        // Set user information in the context
        setUserInfo({
          username: username,
          displayName: `${firstname.charAt(0)}. ${surname}`,
          fullName: `${firstname} ${surname}`,
          loggedIn: true,
          isAdmin: sessionData?.user?.isAdmin || false,
          isActive: sessionData?.user?.isActive || false,
          isInternal: sessionData?.user?.isInternal || false,
          access_token: sessionData?.access || null,
          raw: sessionData
        });

        // Autologout when token expires
        setupAutoLogout();

      } catch (err) {
        console.error("Failed to parse session data", err);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [setupAutoLogout]);

  useEffect(() => {
    loadUser();

    window.addEventListener("userLoginChange", loadUser);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      window.removeEventListener("userLoginChange", loadUser);
    };
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ userInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);