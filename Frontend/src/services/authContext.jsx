// AuthContext.js
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);
  const { t } = useTranslation();

  const logout = (reason = "") => {
    sessionStorage.clear();
    setUserInfo(null);
    window.dispatchEvent(new Event("userLoginChange"));
    
    // Redirect user to login page
    navigate("/login", {
      replace: true,
      state: reason ? { message: reason } : undefined
      });
  };

  const setupAutoLogout = () => {
    const expire = parseInt(sessionStorage.getItem("token_expire"));
    if (!expire || isNaN(expire)) return;

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const delay = (expire - now) * 1000;

    // Clear any existing timeout to prevent multiple triggers
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    if (delay <= 0) {
      logout(t("login_screen.session_expired"));
    } else {
      logoutTimerRef.current = setTimeout(() => {
        logout(t("login_screen.session_expired"));
      }, delay);
    }
  };

  const loadUser = () => {
    const loggedIn = sessionStorage.getItem("user_logged_in") === "true";
    if (loggedIn) {
      const sessionDataRaw = sessionStorage.getItem("session_data");
      try {
        // Parse the session data and extract user information
        const sessionData = JSON.parse(sessionDataRaw);
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
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("userLoginChange", loadUser);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      window.removeEventListener("userLoginChange", loadUser);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);