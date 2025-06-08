import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in by looking at sessionStorage
  const isLoggedIn = sessionStorage.getItem("user_logged_in") === "true";
  const accessToken = sessionStorage.getItem("access_token");
  
  // If not logged in or no access token, redirect to login
  if (!isLoggedIn || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the protected content
  return children;
};

export default ProtectedRoute;