import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "/src/localization/language_setup";
//import { GAnalytics } from "/src/utils/GoogleAnalytics";

// Layouts
import Header from "/src/layouts/Header";
import HeaderDashboard from "/src/layouts/HeaderDashboard";
import Footer from "/src/layouts/Footer";
import { Outlet } from "react-router-dom";

// Protected Route Component
import ProtectedRoute from "./utils/ProtectedRoutes";

// Pages
import Home from "/src/pages/Home";
import Adaptery from "./pages/Adaptery";
import Adapter_Detail from "./pages/DetailPages/Adapter_Detail";
import Desticky from "./pages/Desticky";
import Desticka_Detail from "./pages/DetailPages/Desticka_Detail";
import Brzdice from "./pages/Brzdice";
import Brzdic_Detail from "./pages/DetailPages/Brzdic_Detail";
import Kotouce from "./pages/Kotouce";
import Kotouc_Detail from "./pages/DetailPages/Kotouc_Detail";
import Hadicky from "./pages/Hadicky";
import Hadicka_Detail from "./pages/DetailPages/Hadicka_Detail";
import Pumpy from "./pages/Pumpy";
import Pumpa_Detail from "./pages/DetailPages/Pumpa_Detail";
import Prislusenstvi from "./pages/Prislusenstvi";
import Prislusenstvi_Detail from "./pages/DetailPages/Prislusenstvi_Detail";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFoundPage";
import Login from "./pages/Login";
import MainDashboard from "./pages/MainDashboard";

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
      <Outlet />
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
    {/* Google Analytics tracking for every route change 
    <GAnalytics /> */}

    <Routes>
      {/* Main routes with header and footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/adaptery" element={<Adaptery />} />
        <Route path="/adaptery/:id" element={<Adapter_Detail />} />
        <Route path="/desticky" element={<Desticky />} />
        <Route path="/desticky/:id" element={<Desticka_Detail />} />
        <Route path="/brzdice" element={<Brzdice />} />
        <Route path="/brzdice/:id" element={<Brzdic_Detail />} />
        <Route path="/kotouce" element={<Kotouce />} />
        <Route path="/kotouce/:id" element={<Kotouc_Detail />} />
        <Route path="/hadicky" element={<Hadicky />} />
        <Route path="/hadicky/:id" element={<Hadicka_Detail />} />
        <Route path="/pumpy" element={<Pumpy />} />
        <Route path="/pumpy/:id" element={<Pumpa_Detail />} />
        <Route path="/prislusenstvi" element={<Prislusenstvi />} />
        <Route path="/prislusenstvi/:id" element={<Prislusenstvi_Detail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Clean route without header and footer */}
      <Route element={<CleanLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin routes with dashboard header */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<MainDashboard />} />
        <Route path="/admin/users" element={<NotFound />} />
        <Route path="/admin/import-data" element={<NotFound />} />
        <Route path="/admin/settings" element={<NotFound />} />
        <Route path="/account" element={<NotFound />} />
        <Route path="/admin/edit/*" element={<NotFound />} />
      </Route>

    </Routes>
    </>
  );
}

export default App;