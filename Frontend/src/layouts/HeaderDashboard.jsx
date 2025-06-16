import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu, X, ChevronDown, ChevronRight, User,
  ChevronLeft, Settings, LogOut, Globe
} from "lucide-react";
import { colorThemes } from "./DashboardConfig/ColorThemes";
import { navigationConfig } from "./DashboardConfig/topNavigationConfig";
import { useAuth } from "../services/authContext";

const NavigationItem = ({ item, isCollapsed, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = item.icon;
  const theme = colorThemes[item.colorTheme] || colorThemes.default;

  const handleClick = () => {
    if (item.type === "dropdown" && !isCollapsed) {
      setIsOpen(!isOpen);
    } else if (item.type === "button" && item.onClick) {
      item.onClick();
    }
    if (onItemClick) onItemClick();
  };

  const getItemClasses = (isActive) => {
    const base = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer ${isCollapsed ? "lg:justify-center lg:px-2" : ""}`;
    return isActive ? `${base} ${theme.active} shadow-sm` : `${base} ${theme.text} ${theme.hoverBg} ${theme.hover}`;
  };

  if (item.type === "dropdown") {
    return (
      <div className="mb-1">
        <button
          onClick={handleClick}
          className={`w-full ${getItemClasses(false)}`}
          title={isCollapsed ? item.label : ""}
          disabled={isCollapsed}
        >
          <div className="flex items-center gap-3">
            <IconComponent className="h-5 w-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </div>
          {!isCollapsed && (
            <div className="ml-auto">
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </div>
          )}
        </button>
        {isOpen && (
          <div
            className={`mt-1 space-y-0.5 transition-[max-height] duration-300 ease-in-out overflow-hidden ${isCollapsed ? "ml-2" : "ml-8"}`}
            style={{ maxHeight: isOpen ? `${item.items.length * 40}px` : "0px" }}
          >
            {item.items.map((subItem, idx) => (
              <NavLink
                key={idx}
                to={subItem.to}
                onClick={onItemClick}
                title={isCollapsed ? subItem.label : ""}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive ? `${theme.active} shadow-sm` : `${theme.text} ${theme.hoverBg} ${theme.hover}`
                  }`
                }
              >
                {subItem.iconPath ? (
                  <img src={subItem.iconPath} alt="" className="h-5 w-5" />
                ) : (
                  subItem.icon && <subItem.icon className="h-5 w-5" />
                )}
                {!isCollapsed && <span>{subItem.label}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.type === "link") {
    return (
      <div className="mb-1">
        <NavLink
          to={item.to}
          onClick={onItemClick}
          title={isCollapsed ? item.label : ""}
          className={({ isActive }) => getItemClasses(isActive)}
        >
          <IconComponent className="h-5 w-5" />
          {!isCollapsed && <span>{item.label}</span>}
        </NavLink>
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button
        onClick={handleClick}
        className={`w-full ${getItemClasses(false)}`}
        title={isCollapsed ? item.label : ""}
      >
        <IconComponent className="h-5 w-5" />
        {!isCollapsed && <span>{item.label}</span>}
      </button>
    </div>
  );
};

const HeaderDashboard = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Logout function inside the component where useNavigate works
  const handleLogout = () => {         
    logout();    
  };

  // Define bottomNavigation
  const bottomNavigation = [
    {
      id: "homepage",
      label: "Zpět na stránku",
      icon: Globe,
      to: "/",
      type: "link"
    },
    {
      id: "settings",
      label: "Nastavení",
      icon: Settings,
      to: "/admin/settings",
      type: "link"
    },
    {
      id: "account",
      label: "Můj účet",
      icon: User,
      to: "/account",
      type: "link"
    },
    {
      id: "logout",
      label: "Odhlásit se",
      icon: LogOut,
      type: "button",
      colorTheme: "red",
      onClick: handleLogout
    }
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 h-full">
          <div className="flex items-center gap-3">
            <img src="/logo/goldfren.ico" alt="Goldfren Logo" className="w-8 h-8" />
            <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={closeMobileMenu} />
      )}

      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 h-screen
        bg-white border-r border-gray-200 shadow-lg
        transform transition-all duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-16" : "lg:w-64"}
      `}>
        <div className={`h-16 lg:h-20 p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 ${isCollapsed ? "lg:px-2" : ""}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src="/logo/goldfren.ico" alt="Logo" className="w-8 h-8" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
                <p className="text-xs text-gray-500">Administrace webu</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 py-4 overflow-y-auto">
            <div className={`space-y-1 ${isCollapsed ? "lg:px-2" : "px-4"}`}>
              {navigationConfig.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isCollapsed={isCollapsed}
                  onItemClick={closeMobileMenu}
                />
              ))}
            </div>
          </div>
          <div className={`border-t border-gray-100 py-4 flex-shrink-0 ${isCollapsed ? "lg:px-2" : "px-4"}`}>
            <div className="space-y-1">
              {bottomNavigation.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isCollapsed={isCollapsed}
                  onItemClick={closeMobileMenu}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>

      <div className={`
        flex-1 transition-all duration-300 ease-in-out overflow-y-auto
        pt-16 lg:pt-0
      `}>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;