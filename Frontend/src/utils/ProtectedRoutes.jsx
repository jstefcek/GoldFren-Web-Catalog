import { Navigate } from "react-router-dom";
import { useAuth } from "../services/authContext";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useAuth();

  // Check if user is logged in
  const isLoggedIn = !!userInfo;

  // If user is not logged in then redirect to login page
  if (!isLoggedIn) {
    console.warn("Access denied. User is not logged in or access token is missing.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;