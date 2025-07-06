import { useState } from "react";
import { Menu, X, ChevronRight, ChevronLeft } from "lucide-react";
import { topNavigationConfig } from "./DashboardConfig/topNavigationConfig";
import { NavigationItem } from "./DashboardConfig/NavigationItem";
import { bottomNavigationConfig } from "./DashboardConfig/bottomNavigationConfig";
import { useAuth } from "../services/authContext";

const HeaderDashboard = ({ children }) => {
  // States to manage mobile menu and sidebar collapse
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handlers for toggling mobile menu and sidebar collapse
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Get user information and logout function
  const { userInfo, logout } = useAuth();

  // Helper to handle logout + mobile menu close
  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <div className="flex min-h-[100svh] w-full bg-gray-50 overflow-hidden">
      {/* Top Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 h-full">
          <div className="flex items-center gap-3">
            <img
              src="/logo/goldfren.ico"
              alt="Goldfren Logo"
              className="w-8 h-8"
            />
            <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 min-h-[100svh]
        bg-white border-r border-gray-200 shadow-lg
        transform transition-all duration-300 ease-in-out flex flex-col
        ${
          isMobileMenuOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full lg:translate-x-0"
        }
        ${isCollapsed ? "lg:w-16" : "lg:w-64"}
      `}
      >
        <div
          className={`h-16 lg:h-20 p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 ${
            isCollapsed ? "lg:px-2" : ""
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src="/logo/goldfren.ico" alt="Logo" className="w-8 h-8" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-500">Administrace webu</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto flex flex-col justify-between pb-[env(safe-area-inset-bottom)]">
          {/* Top Navigation */}
          <div className="py-4">
            <div className={`space-y-1 ${isCollapsed ? "lg:px-2" : "px-4"}`}>
              {topNavigationConfig
                .filter((item) => {
                  if (!item.permissions) return true;
                  return item.permissions.every((perm) => userInfo?.[perm]);
                })
                .map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    isCollapsed={isCollapsed}
                    onLinkClick={closeMobileMenu}
                  />
                ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div
            className={`border-t border-gray-100 py-4 ${
              isCollapsed ? "lg:px-2" : "px-4"
            }`}
          >
            <div className="space-y-1">
              {bottomNavigationConfig.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={{
                    ...item,
                    onClick: item.id === "logout" ? handleLogout : item.onClick,
                  }}
                  isCollapsed={isCollapsed}
                  onLinkClick={closeMobileMenu}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`
        flex-1 transition-all duration-300 ease-in-out overflow-y-auto
        pt-16 lg:pt-0
      `}
      >
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};

export default HeaderDashboard;
