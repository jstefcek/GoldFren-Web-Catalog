import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const GA_ID = import.meta.env.VITE_GA_ID;

// Initialize Google Analytics with the provided ID
ReactGA.initialize(GA_ID);

// Component to track page views
export function GAnalytics() {
  const location = useLocation();

  // Track page views on location change
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
}

// Track vehicle search data
export function trackVehicleSearch({ vyrobce, objem, model, rok_vyroby }) {
  ReactGA.event("vehicle_search", {
    vyrobce,
    objem,
    model,
    rok_vyroby,
  });
}

// Track sortiment search data
export function trackSortimentSearch({ category}) {
  ReactGA.event("sortiment_search", {
    category,
  });
}
