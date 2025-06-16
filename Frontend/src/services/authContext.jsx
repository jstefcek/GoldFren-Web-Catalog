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
        const sessionData = JSON.parse(sessionDataRaw);
        const firstname = sessionData?.user?.first_name || "User";
        const surname = sessionData?.user?.last_name || "";
        setUserInfo({
          displayName: `${firstname.charAt(0)}.${surname}`,
          fullName: `${firstname} ${surname}`,
          loggedIn: true,
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