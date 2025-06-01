import { useState } from "react";
import {
  Menu, X, Home, Package, ChevronDown, ChevronRight, User,
  ChevronLeft, Settings, Users, FileText, LogOut, Car
} from "lucide-react";

const Link = ({ to, children, onClick, className, title }) => (
  <a
    href={to}
    onClick={(e) => {
      e.preventDefault();
      onClick && onClick();
    }}
    className={className}
    title={title}
  >
    {children}
  </a>
);

const useLocation = () => ({ pathname: "/admin/dashboard" });

// Color for different menu items
const colorThemes = {
  default: {
    text: "text-gray-700",
    hover: "hover:text-red-600",
    active: "text-red-600 bg-red-50",
    hoverBg: "hover:bg-gray-100"
  },
  red: {
    text: "text-red-600",
    hover: "hover:text-red-700",
    active: "text-red-700 bg-red-100",
    hoverBg: "hover:bg-red-50"
  }
};

const navigationConfig = [
  {
    id: "dashboard",
    label: "Přehled webu",
    icon: Home,
    to: "/admin/dashboard",
    type: "link"
  },
  {
    id: "sortiment",
    label: "Sortiment",
    icon: Package,
    type: "dropdown",
    items: [
      { label: "Adaptéry", to: "/admin/edit/adaptery", iconPath: "/icons/adapter.svg" },
      { label: "Brzdiče", to: "/admin/edit/brzdice", iconPath: "/icons/caliper.svg" },
      { label: "Destičky", to: "/admin/edit/desticky", iconPath: "/icons/pad.svg" },
      { label: "Kotouče", to: "/admin/edit/kotouce", iconPath: "/icons/disc.svg" },
      { label: "Hadičky", to: "/admin/edit/hadicky", icon: Package },
      { label: "Pumpy", to: "/admin/edit/pumpy", icon: Package },
      { label: "Příslušenství", to: "/admin/edit/prislusenstvi", icon: Package }
    ]
  },
  {
    id: "vehicles",
    label: "Vozidla",
    icon: Car,
    type: "dropdown",
    items: [
      { label: "Automobily", to: "/admin/edit/automobily", iconPath: "/icons/car.svg" },
      { label: "Motorcykly", to: "/admin/edit/motorcykly", iconPath: "/icons/motorbike.svg" },
      { label: "Motokáry", to: "/admin/edit/motokary", iconPath: "/icons/kart.svg" },
      { label: "Jizndní kola", to: "/admin/edit/kola", iconPath: "/icons/bike.svg" },
      { label: "Letadla", to: "/admin/edit/letadla", iconPath: "/icons/plane.svg" },
      { label: "Průmysl", to: "/admin/edit/prumysl", iconPath: "/icons/industry.svg" }
    ]
  },
  {
    id: "users",
    label: "Uživatelé",
    icon: Users,
    to: "/admin/users",
    type: "link"
  },
  {
    id: "import",
    label: "Načíst data",
    icon: FileText,
    to: "/admin/import-data",
    type: "link"
  }
];

const bottomNavigation = [
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
    to: "account",
    type: "link"
  },
  {
    id: "logout",
    label: "Odhlásit se",
    icon: LogOut,
    type: "button",
    colorTheme: "red",
    onClick: () => alert("Logout functionality would be implemented here")
  }
];

const NavigationItem = ({ item, isCollapsed, onItemClick, isActive }) => {
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

  const getItemClasses = () => {
    const base = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer ${isCollapsed ? "lg:justify-center lg:px-2" : ""}`;
    return isActive ? `${base} ${theme.active} shadow-sm` : `${base} ${theme.text} ${theme.hoverBg} ${theme.hover}`;
  };

  if (item.type === "dropdown") {
    return (
      <div className="mb-1">
        <button
          onClick={handleClick}
          className={`w-full ${getItemClasses()}`}
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
            <Link
                key={idx}
                to={subItem.to}
                onClick={onItemClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 ${theme.hover}`}
                title={isCollapsed ? subItem.label : ""}
            >
                {subItem.iconPath ? (
                <img src={subItem.iconPath} alt="" className="h-5 w-5" />
                ) : (
                subItem.icon && <subItem.icon className="h-5 w-5" />
                )}
                {!isCollapsed && <span>{subItem.label}</span>}
            </Link>
            ))}
        </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-1">
      <button
        onClick={handleClick}
        className={`w-full ${getItemClasses()}`}
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
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Mobile Header */}
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

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
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
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  isActive={isActiveRoute(item.to)}
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
                  isActive={isActiveRoute(item.to)}
                />
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 transition-all duration-300 ease-in-out overflow-y-auto
        ${isCollapsed ? "lg:ml-0" : "lg:ml-0"}
        pt-16 lg:pt-0
      `}>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;