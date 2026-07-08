import { Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import "/src/localization/language_setup";
import { GAnalytics, initializeGA } from "/src/utils/GoogleAnalytics";
import { CookieManager } from "react-cookie-manager";

// Layouts
import Header from "/src/layouts/Header";
import HeaderDashboard from "/src/layouts/HeaderDashboard";
import Footer from "/src/layouts/Footer";
import { Outlet } from "react-router-dom";

// Protected Route Component
import ProtectedRoute from "./utils/ProtectedRoutes";

// Pages
import Sortiment_Page from "./pages/Sortiment_Page";
import Home from "/src/pages/Home";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFoundPage";
import Login from "./pages/Login";
import CookiesPolicy from "./pages/Cookies/CookiesPolicy";

// Sortiment Detail Pages
import Adapter_Detail from "./pages/DetailPages/Adapter_Detail";
import Desticka_Detail from "./pages/DetailPages/Desticka_Detail";
import Brzdic_Detail from "./pages/DetailPages/Brzdic_Detail";
import Kotouc_Detail from "./pages/DetailPages/Kotouc_Detail";
import Hadicka_Detail from "./pages/DetailPages/Hadicka_Detail";
import Pumpa_Detail from "./pages/DetailPages/Pumpa_Detail";
import Prislusenstvi_Detail from "./pages/DetailPages/Prislusenstvi_Detail";

// Admin Dashboard
const MainDashboard = lazy(() => import("./pages/AdminDashboard/MainDashboard"));
const Account = lazy(() => import("./pages/AdminDashboard/Account"));
const Users_Detail = lazy(() => import("./pages/AdminDashboard/Users_Detail"));
const Vehicle_Detail = lazy(() => import("./pages/AdminDashboard/Vehicle_Detail"));
const Sortiment_Detail = lazy(() => import("./pages/AdminDashboard/Sortiment_Detail"));
const VyrobceSortimentPage = lazy(() => import("./pages/AdminDashboard/Vyrobce_Sortiment"));
const Vyrobce = lazy(() => import("./pages/AdminDashboard/Vyrobce"));
const ImportData_Page = lazy(() => import("./pages/AdminDashboard/ImportData_Page"));
const WebStats_Page = lazy(() => import("./pages/AdminDashboard/WebStats_Page"));
const VehicleStats_Page = lazy(() => import("./pages/AdminDashboard/VehicleStats_Page"));
const SortimentStats_Page = lazy(() => import("./pages/AdminDashboard/SortimentStats_Page"));

// Import authContext for user authentication
import { AuthProvider } from "./services/authContext";

// Main layout with header and footer
const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Clean layout without header and footer
const CleanLayout = () => (
  <div className="min-h-screen">
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

// Admin dashboard layout with header + protected route
const AdminLayout = () => (
  <ProtectedRoute>
    <HeaderDashboard>
      <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading page...</div>}>
        <Outlet />
      </Suspense>
    </HeaderDashboard>
  </ProtectedRoute>
);

function App() {
  const { t } = useTranslation();

  // Set the page title based on translation
  useEffect(() => {
    document.title = t("site_title");
  }, [t]);

  return (
    <>
      <AuthProvider>
        {/* Cookie Manager */}
        <CookieManager
          translations={t}
          translationI18NextPrefix="cookies."
          disableGeolocation={true}
          privacyPolicyLink="/privacy"
          cookiePolicyLink="/cookies"
          enableFloatingButton={true}
          privacyPolicyUrl="/cookies"
          displayType="popup"
          // Keep embedded contact maps visible; analytics still initializes only after consent callbacks.
          disableAutomaticBlocking={true}
          // Initial cookie preferences
          initialPreferences={{
            Analytics: true,
            Social: true,
            Advertising: true,
          }}
          // Cookie categories
          cookieCategories={{
            Analytics: true,
            Social: false, 
            Advertising: false,
          }}
          // Cookies setup
          cookieExpiration={30}
          cookieKey="cookie-consent"
          // UI custom design
          classNames={{
            acceptButton: "accept-button",
            declineButton: "decline-button",
            manageButton: "manage-button",
            manageSaveButton: "manageSaveButton",
            manageCookieToggle: "manageCookieToggle",
            manageCookieToggleChecked: "manageCookieToggleChecked",
          }}
          // Cookie consent callbacks
          onAccept={() => {
            console.debug("All cookies accepted");
            window.gtag?.("consent", "update", { analytics_storage: "granted" });
            initializeGA();
          }}
          onDecline={() => {
            console.debug("All cookies declined");
            window.gtag?.("consent", "update", { analytics_storage: "denied" });
          }}
          // Manage cookie preferences when changed
          onManage={(preferences) => {
            console.debug("Custom preferences saved:", preferences);
            if (preferences?.Analytics) {
              window.gtag?.("consent", "update", { analytics_storage: "granted" });
              initializeGA();
            } 
            else {
              window.gtag?.("consent", "update", { analytics_storage: "denied" });
            }
          }}
        />

        {/* Google Analytics tracking for every route change */}
        <GAnalytics />

        <Routes>
          {/* Main routes with header and footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/adaptery" element={<Sortiment_Page sortiment_category="adaptery" apiUrl="api/goldfren/internal/adaptery?limit=0" />} />
            <Route path="/adaptery/:id" element={<Adapter_Detail />} />
            <Route path="/desticky" element={<Sortiment_Page sortiment_category="desticky" apiUrl="api/goldfren/internal/desticky?limit=0" />} />
            <Route path="/desticky/:id" element={<Desticka_Detail />} />
            <Route path="/brzdice" element={<Sortiment_Page sortiment_category="brzdice" apiUrl="api/goldfren/internal/brzdice?limit=0" />} />
            <Route path="/brzdice/:id" element={<Brzdic_Detail />} />
            <Route path="/kotouce" element={<Sortiment_Page sortiment_category="kotouce" apiUrl="api/goldfren/internal/kotouce?limit=0" />} />
            <Route path="/kotouce/:id" element={<Kotouc_Detail />} />
            <Route path="/hadicky" element={<Sortiment_Page sortiment_category="hadicky" apiUrl="api/goldfren/internal/hadicky?limit=0" />} />
            <Route path="/hadicky/:id" element={<Hadicka_Detail />} />
            <Route path="/pumpy" element={<Sortiment_Page sortiment_category="pumpy" apiUrl="api/goldfren/internal/pumpy?limit=0" />} />
            <Route path="/pumpy/:id" element={<Pumpa_Detail />} />
            <Route path="/prislusenstvi" element={<Sortiment_Page sortiment_category="prislusenstvi" apiUrl="api/goldfren/internal/prislusenstvi?limit=0" />} />
            <Route path="/prislusenstvi/:id" element={<Prislusenstvi_Detail />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Clean route without header and footer */}
          <Route element={<CleanLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Home />} />
          </Route>

          {/* Admin routes with dashboard header */}
          <Route element={<AdminLayout />}>
            {/* Main Dashboard and users page */}
            <Route path="/admin/dashboard" element={<MainDashboard />} />
            <Route path="/admin/users" element={<Users_Detail />} />
            
            {/* Sortiment and vehicle pages */}
            <Route path="/admin/manufacturer-data" element={<VyrobceSortimentPage />} />
            <Route path="/admin/sortiment/*" element={<Sortiment_Detail />} />
            <Route path="/admin/manufacturer" element={<Vyrobce />} />
            <Route path="/admin/vehicles/*" element={<Vehicle_Detail />} />
            
            {/* Import data page */}
            <Route path="/admin/import-data" element={<ImportData_Page />} />

            {/* Statistics pages */}
            <Route path="/admin/stats/web-views" element={<WebStats_Page />} />
            <Route path="/admin/stats/vehicle-search" element={<VehicleStats_Page />} />
            <Route path="/admin/stats/sortiment-search" element={<SortimentStats_Page />} />

            {/* Account page */}
            <Route path="/admin/account" element={<Account />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
