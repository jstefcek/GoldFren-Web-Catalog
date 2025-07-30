import { colorThemes } from "./ColorThemes";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

export const NavigationItem = ({ item, isCollapsed, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = item.icon;
  const theme = colorThemes[item.colorTheme] || colorThemes.default;

  // Determine which type of item it is and handle click accordingly
  const handleClick = () => {
    if (item.type === "dropdown" && !isCollapsed) {
      setIsOpen(!isOpen);
    } else if (item.type === "button" && item.onClick) {
      item.onClick();
      if (onLinkClick) onLinkClick();
    } else if (item.type === "link" && onLinkClick) {
      onLinkClick();
    }
  };

  // Get classes for the item based on its active state
  const getItemClasses = (isActive) => {
    const base = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer ${isCollapsed ? "lg:justify-center lg:px-2" : ""}`;
    return isActive ? `${base} ${theme.active} shadow-sm` : `${base} ${theme.text} ${theme.hoverBg} ${theme.hover}`;
  };

  // Handle dropdown items
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
            {!isCollapsed && <span className="text-sm lg:text-sm">{item.label}</span>}
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
            style={{ maxHeight: `${item.items.length * 40}px` }}
          >
            {item.items.map((subItem, idx) => (
              <NavLink
                key={idx}
                to={subItem.to}
                title={isCollapsed ? subItem.label : ""}
                onClick={() => {
                  // Prevent closing menu if just expanding dropdown
                  if (onLinkClick && subItem.to) {
                    onLinkClick();
                  }
                }}
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
                {!isCollapsed && <span className="text-sm lg:text-sm">{subItem.label}</span>}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Handle link buttons
  if (item.type === "link") {
    return (
      <div className="mb-1">
        <NavLink
          to={item.to}
          onClick={handleClick}
          title={isCollapsed ? item.label : ""}
          className={({ isActive }) => getItemClasses(isActive)}
        >
          {IconComponent && <IconComponent className="h-5 w-5" />}
          {!isCollapsed && <span className="text-sm lg:text-sm">{item.label}</span>}
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
        {!isCollapsed && <span className="text-sm lg:text-sm">{item.label}</span>}
      </button>
    </div>
  );
};