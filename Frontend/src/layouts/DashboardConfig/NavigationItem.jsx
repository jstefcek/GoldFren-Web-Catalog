import { colorThemes } from "./ColorThemes";
import { useState, useMemo, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const NavigationItem = ({ item, isCollapsed, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = item.icon;
  const theme = colorThemes[item.colorTheme] || colorThemes.default;
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // Determine which type of item it is and handle click accordingly
  const handleClick = () => {
    if (item.type === "dropdown" && !isCollapsed) {
      setIsOpen(!isOpen);
    } else if (item.type === "button" && item.onClick) {
      item.onClick();
      if (onLinkClick) onLinkClick();
    } else if (item.type === "link" && onLinkClick) {
      onLinkClick();
    } else if (item.type === "lang_switcher") {
      setIsLangOpen((v) => !v);
    }
  };

  // Language switcher specific logic
  const languages = useMemo(
    () => [
      { code: "cs", name: "Česky", flagIcon: "/icons/czech.svg" },
      { code: "en", name: "English", flagIcon: "/icons/english.svg" },
      { code: "de", name: "Deutsch", flagIcon: "/icons/german.svg" },
    ],
    []
  );

  const currentLangCode = useMemo(() => {
    const lng = (i18n.language || "cs").split("-")[0];
    return lng;
  }, [i18n.language]);

  const currentLanguageInfo = useMemo(() => {
    return languages.find((l) => l.code === currentLangCode) || languages[0];
  }, [languages, currentLangCode]);

  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
    if (onLinkClick) onLinkClick();
  };

  // Get classes for the item based on its active state
  const getItemClasses = (isActive) => {
    const base = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer ${isCollapsed ? "lg:justify-center lg:px-2" : ""}`;
    return isActive ? `${base} ${theme.active} shadow-sm` : `${base} ${theme.text} ${theme.hoverBg} ${theme.hover}`;
  };

  // Handle language switcher item
  if (item.type === "lang_switcher") {
    return (
      <div className="mb-1 relative" ref={langRef}>
        <button
          onClick={handleClick}
          className={`w-full ${getItemClasses(false)}`}
          title={isCollapsed ? item.label : ""}
        >
          <div className="flex items-center gap-3 min-w-0">
            {IconComponent && <IconComponent className="h-5 w-5 shrink-0" />}

            {!isCollapsed ? (
              <>
                <img
                  src={currentLanguageInfo.flagIcon}
                  alt={currentLanguageInfo.code}
                  className="h-5 w-5 rounded-sm shrink-0"
                />
                <span className="text-sm lg:text-sm truncate">{item.label}</span>
                <span className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                  {currentLanguageInfo.name}
                  <ChevronDown
                    className={`h-4 w-4 transition ${isLangOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </>
            ) : (
              // Collapsed: show only current flag
              <img
                src={currentLanguageInfo.flagIcon}
                alt={currentLanguageInfo.code}
                className="h-5 w-5 rounded-sm"
              />
            )}
          </div>
        </button>

        {isLangOpen && (
          <div
            className={[
              "absolute z-50 mt-2 rounded-xl bg-white shadow-lg ring-1 ring-black/5 border border-gray-100 overflow-hidden",
              isCollapsed ? "left-full ml-2 w-44" : "left-0 w-full min-w-[12rem]",
            ].join(" ")}
          >
            <ul className="py-2">
              {languages.map((lang) => {
                const active = currentLangCode === lang.code;
                return (
                  <li key={lang.code}>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange(lang.code)}
                      className={[
                        "w-full text-left px-3 py-2 flex items-center gap-3 transition cursor-pointer",
                        active
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:bg-red-50 hover:text-red-600",
                      ].join(" ")}
                    >
                      <img src={lang.flagIcon} alt={lang.code} className="h-5 w-5" />
                      <span className="text-sm">{lang.name}</span>
                      {active && <span className="ml-auto font-bold text-red-600">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }

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
            {!isCollapsed && <span className="text-sm lg:text-sm">{t("admin.layout." + item.label + "_text")}</span>}
          </div>
          {!isCollapsed && (
            <div className="ml-auto">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                {!isCollapsed && <span className="text-sm lg:text-sm">{t("admin.layout." + subItem.label + "_text")}</span>}
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
          {!isCollapsed && <span className="text-sm lg:text-sm">{t("admin.layout." + item.label + "_text")}</span>}
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
        {!isCollapsed && <span className="text-sm lg:text-sm">{t("admin.layout." + item.label + "_text")}</span>}
      </button>
    </div>
  );
};