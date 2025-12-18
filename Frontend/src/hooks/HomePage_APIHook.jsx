import { useAuth } from "../services/authContext";
const serverUrl = import.meta.env.VITE_API_URL;

export function useFetchMetrics() {
  // Get user info from auth context
  const { userInfo } = useAuth();

  // Function to fetch homepage metrics
  const fetchMetrics = async (endpoint = "/api/goldfren/internal/metrics/homepage") => {
    try {
      // Prepare headers with authorization if access token is available
      const headers = {};

      // Add Authorization header
      if (userInfo?.access_token) {
        headers["Authorization"] = `Bearer ${userInfo.access_token}`;
      }

      // Fetch metrics data from the server
      const response = await fetch(`${serverUrl}${endpoint}`, { headers });
      if (!response.ok) throw new Error("Failed to fetch metrics");

      // Return parsed JSON data
      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to fetch metrics");
    }
  };

  return { fetchMetrics };
}