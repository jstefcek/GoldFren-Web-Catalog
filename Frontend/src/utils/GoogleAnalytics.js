import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const GA_ID = import.meta.env.VITE_GA_ID;

// Track GA initialization
let gaInitialized = false;

// Initialize Google Analytics
export function initializeGA() {
  if (!gaInitialized) {
    ReactGA.initialize(GA_ID);
    gaInitialized = true;
  }
}

// Component to track page views (only if GA initialized)
export function GAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (gaInitialized) {
      ReactGA.send({ hitType: "pageview", page: location.pathname });
    }
  }, [location]);

  return null;
}

// Track vehicle search data
export function trackVehicleSearch({ vyrobce, objem, model, rok_vyroby }) {
  if (gaInitialized) {
    ReactGA.event("vehicle_search", {
      vyrobce,
      objem,
      model,
      rok_vyroby,
    });
  }
}

// Track sortiment search data
export function trackSortimentSearch({ category }) {
  if (gaInitialized) {
    ReactGA.event("sortiment_search", {
      category,
    });
  }
}