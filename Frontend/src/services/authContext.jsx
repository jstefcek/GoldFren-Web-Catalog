// AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

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
          raw: sessionData
        });
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
    return () => window.removeEventListener("userLoginChange", loadUser);
  }, []);

  const logout = () => {
    sessionStorage.clear();
    setUserInfo(null);
    window.dispatchEvent(new Event("userLoginChange"));
  };

  return (
    <AuthContext.Provider value={{ userInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);