import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const GA_ID = import.meta.env.VITE_GA_ID;

// Track GA initialization
let gaInitialized = false;
let gaScriptInjected = false;

// Function to inject the gtag script into the document
const injectGtagScript = () => {
  if (!GA_ID || gaScriptInjected || typeof document === "undefined") return;

  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gtagScript);
  gaScriptInjected = true;
};

// Initialize Google Analytics
export function initializeGA() {
  if (!gaInitialized) {
    injectGtagScript();
    ReactGA.initialize(GA_ID);
    gaInitialized = true;
  }
}

// Component to track page views
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
export function trackSortimentSearch({ sortiment_category }) {
  if (gaInitialized) {
    ReactGA.event("sortiment_search", {
      sortiment_category
    });
  }
}

// Track most sortiment categories manually viewed on the site
export function trackTopSortimentCategory({ sortiment_category }) {
  if (gaInitialized) {
    ReactGA.event("top_sortiment_category", {
      sortiment_category,
    });
  }
}

// Sortiments specific item page view tracking
export function trackSortimentItemView({ sortiment_category, sortimentId }) {
  if (gaInitialized) {
    ReactGA.event("sortiment_item_view", {
      sortiment_category,
      sortimentId,
    });
  }
}