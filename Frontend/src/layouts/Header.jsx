import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
  MonitorCog,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import { useMenuItemsConfig } from "./HeaderConfig/menuItemsConfig";

const menuLinkClass = ({ isActive }) =>
  `flex items-center px-4 py-2 rounded-lg font-normal transition ${
    isActive
      ? "bg-red-50 text-red-700"
      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
  }`;

const submenuLinkClass = ({ isActive }) =>
  `block px-4 py-3 text-sm font-normal transition ${
    isActive
      ? "bg-red-50 text-red-700"
      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block px-4 py-3 rounded-lg font-medium transition ${
    isActive
      ? "bg-red-50 text-red-700"
      : "text-gray-700 hover:text-red-600 hover:bg-red-50"
  }`;

const mobileSubmenuLinkClass = ({ isActive }) =>
  `block px-4 py-3 rounded-lg font-medium transition ${
    isActive
      ? "bg-red-50 text-red-700"
      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
  }`;

const userMenuLinkClass = ({ isActive }) =>
  `block px-4 py-2 text-sm flex items-center transition ${
    isActive
      ? "bg-red-50 text-red-700"
      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
  }`;

const mobileUserLinkClass = ({ isActive }) =>
  `flex items-center px-4 py-3 rounded-lg font-medium transition ${
    isActive
      ? "bg-red-50 text-red-700"
      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
  }`;

function useDropdownMenu() {
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const closeTimeout = useRef();

  const close = useCallback(() => {
    setOpen(false);
    setClicked(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen((currentOpen) => {
      const nextOpen = !currentOpen;
      setClicked(nextOpen);
      return nextOpen;
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(closeTimeout.current);
    if (!clicked) setOpen(true);
  }, [clicked]);

  const handleMouseLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      if (!clicked) setOpen(false);
    }, 200);
  }, [clicked]);

  useEffect(() => {
    return () => clearTimeout(closeTimeout.current);
  }, []);

  return { open, close, toggle, handleMouseEnter, handleMouseLeave };
}

function Header() {
  // State management for various menu states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSortimentOpen, setMobileSortimentOpen] = useState(false);
  const sortimentMenu = useDropdownMenu();
  const langMenu = useDropdownMenu();
  const userMenu = useDropdownMenu();
  const closeSortimentMenu = sortimentMenu.close;
  const closeLangMenu = langMenu.close;
  const closeUserMenu = userMenu.close;

  // Auth context to get user info and logout function
  const { userInfo, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for menu elements to handle click outside events
  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const sortimentMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Configuration for menu items
  const menuItemsConfig = useMenuItemsConfig();
  const sortimentMenuId = "header-sortiment-menu";
  const languageMenuId = "header-language-menu";
  const userMenuId = "header-user-menu";
  const mobileMenuId = "header-mobile-menu";
  const mobileSortimentMenuId = "header-mobile-sortiment-menu";

  // Effect to close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to handle clicks outside of the menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        closeUserMenu();
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        closeLangMenu();
      }
      if (
        sortimentMenuRef.current &&
        !sortimentMenuRef.current.contains(e.target)
      ) {
        closeSortimentMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSortimentMenu, closeLangMenu, closeUserMenu]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    document.body.style.overflow = "hidden";

    const focusFirstMenuItem = window.setTimeout(() => {
      const firstFocusable = mobileMenuRef.current?.querySelector(focusableSelector);
      firstFocusable?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !mobileMenuRef.current) return;

      const focusableItems = Array.from(
        mobileMenuRef.current.querySelectorAll(focusableSelector)
      );
      if (focusableItems.length === 0) return;

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusFirstMenuItem);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Function to handle language change
  const handleLanguageChange = useCallback(
    (lng) => {
      i18n.changeLanguage(lng);
      closeLangMenu();
      setMobileMenuOpen(false);
    },
    [i18n, closeLangMenu]
  );

  // Function to handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    logout();
    closeUserMenu();
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Function to check if the current route matches the given path
  const isActiveRoute = useCallback((path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Function to check if any submenu item is active
  const hasActiveSubmenuItem = useCallback(
    (submenu) => submenu.some((item) => isActiveRoute(item.path)),
    [isActiveRoute]
  );

  const languages = useMemo(() => [
    { code: "cs", name: "Česky", flagIcon: "/icons/czech.svg" },
    { code: "en", name: "English", flagIcon: "/icons/english.svg" },
    { code: "de", name: "Deutsch", flagIcon: "/icons/german.svg" },
  ], []);

  const currentLanguageInfo =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/logo/goldfren-logo.svg"
                alt="GoldFren Logo"
                className="h-8 w-auto"
                width="160"
                height="32"
                decoding="async"
                fetchPriority="high"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center flex-1">
            <ul className="flex space-x-2">
              {menuItemsConfig.map((item) =>
                item.submenu ? (
                  <li
                    key={item.name}
                    className="relative"
                    ref={sortimentMenuRef}
                    onMouseEnter={sortimentMenu.handleMouseEnter}
                    onMouseLeave={sortimentMenu.handleMouseLeave}
                  >
                    <button
                      onClick={sortimentMenu.toggle}
                      aria-haspopup="menu"
                      aria-expanded={sortimentMenu.open}
                      aria-controls={sortimentMenuId}
                      className={`flex items-center px-4 py-2 rounded-lg font-normal transition cursor-pointer ${
                        hasActiveSubmenuItem(item.submenu)
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 ml-2 ${
                          sortimentMenu.open ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {sortimentMenu.open && (
                      <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-100">
                        <ul id={sortimentMenuId} className="py-2" role="menu">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.name}>
                              <NavLink
                                to={subitem.path}
                                onClick={sortimentMenu.close}
                                className={submenuLinkClass}
                                role="menuitem"
                              >
                                {subitem.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className={menuLinkClass}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Language menu section */}
          <div className="flex items-center space-x-3">
            <div
              className="relative hidden lg:block"
              ref={langMenuRef}
              onMouseEnter={langMenu.handleMouseEnter}
              onMouseLeave={langMenu.handleMouseLeave}
            >
              <button
                onClick={langMenu.toggle}
                aria-haspopup="menu"
                aria-expanded={langMenu.open}
                aria-controls={languageMenuId}
                aria-label={t("header.language")}
                className="flex items-center text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition cursor-pointer font-normal"
              >
                <img
                  src={currentLanguageInfo.flagIcon}
                  alt={currentLanguageInfo.code}
                  className="h-5 w-5 mr-2 rounded-sm"
                  decoding="async"
                />
                <span className="hidden md:inline">
                  {currentLanguageInfo.name}
                </span>
                <ChevronDown
                  className={`h-4 w-4 ml-1 ${langMenu.open ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {langMenu.open && (
                <div className="absolute right-0 mt-2 min-w-[10rem] max-w-[12rem] rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-100">
                  <ul id={languageMenuId} className="py-2" role="menu">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button
                          onClick={() => handleLanguageChange(lang.code)}
                          role="menuitemradio"
                          aria-checked={i18n.language === lang.code}
                          className={`w-full text-left px-4 py-2 flex items-center gap-4 font-bold transition cursor-pointer ${
                            i18n.language === lang.code
                              ? "bg-red-50 text-red-700"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-600 font-normal"
                          }`}
                        >
                          <img
                            src={lang.flagIcon}
                            alt={lang.code}
                            className="h-5 w-5 font-bold"
                            loading="lazy"
                            decoding="async"
                          />
                          {lang.name}
                          {i18n.language === lang.code && (
                            <span className="ml-auto font-bold text-red-600">
                              ✓
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* User info dropdown menu if logged in */}
            {userInfo && (
              <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={userMenu.handleMouseEnter}
                onMouseLeave={userMenu.handleMouseLeave}
              >
                <button
                  onClick={userMenu.toggle}
                  aria-haspopup="menu"
                  aria-expanded={userMenu.open}
                  aria-controls={userMenuId}
                  className="bg-white hover:bg-red-50 border-2 border-red-600 text-red-600 px-3 py-2 rounded-lg flex items-center font-medium transition cursor-pointer"
                >
                  <User className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span className="hidden md:inline">
                    {userInfo.displayName}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 ml-1 ${
                      userMenu.open ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {userMenu.open && (
                  <div className="absolute right-0 mt-2 min-w-[12rem] max-w-[14rem] rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-100">
                    <ul id={userMenuId} className="py-1" role="menu">
                      <li className="px-4 pt-2 font-bold text-xl text-gray-800">
                        {userInfo.fullName}
                      </li>
                      {userInfo.isAdmin ? (
                        <li className="px-4 pb-2 text-xs font-bold text-yellow-700">
                          {t("header.admin_role")}
                        </li>
                      ) : (
                        <li className="px-4 pb-2 text-xs font-bold text-sky-700">
                          {t("header.basic_role")}
                        </li>
                      )}
                      <li>
                        <NavLink
                          to="/admin/dashboard"
                          onClick={userMenu.close}
                          className={({ isActive }) => `${userMenuLinkClass({ isActive })} border-t border-gray-100`}
                          role="menuitem"
                        >
                          <MonitorCog className="h-4 w-4 mr-2" aria-hidden="true" />{" "}
                          {t("header.admin_page")}
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/admin/account"
                          onClick={userMenu.close}
                          className={userMenuLinkClass}
                          role="menuitem"
                        >
                          <User className="h-4 w-4 mr-2" aria-hidden="true" />{" "}
                          {t("header.my_account")}
                        </NavLink>
                      </li>
                      <li className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          role="menuitem"
                          className="w-full text-left px-4 py-2 text-sm text-red-600 flex items-center hover:bg-red-50 transition cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />{" "}
                          {t("header.logout")}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!userInfo && (
              <Link
                to="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
              >
                {t("login")}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-red-50 transition"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu fullscreen overlay */}
        {mobileMenuOpen && (
          <div
            id={mobileMenuId}
            className="lg:hidden fixed inset-0 z-50 bg-white"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link to="/" className="flex items-center">
                  <img
                    src="/logo/goldfren-logo.svg"
                    alt="GoldFren Logo"
                    className="h-8 w-auto"
                    width="160"
                    height="32"
                    decoding="async"
                    fetchPriority="high"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-red-50 transition"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Menu content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {menuItemsConfig.map((item) =>
                    item.submenu ? (
                      <div key={item.name}>
                        <button
                          onClick={() =>
                            setMobileSortimentOpen(!mobileSortimentOpen)
                          }
                          aria-expanded={mobileSortimentOpen}
                          aria-controls={mobileSortimentMenuId}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition ${
                            hasActiveSubmenuItem(item.submenu)
                              ? "bg-red-50 text-red-700"
                              : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {item.name}
                          {mobileSortimentOpen ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                        {mobileSortimentOpen && (
                          <div id={mobileSortimentMenuId} className="ml-4 mt-2 space-y-1">
                            {item.submenu.map((subitem) => (
                              <NavLink
                                key={subitem.name}
                                to={subitem.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={mobileSubmenuLinkClass}
                              >
                                {subitem.name}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === "/"}
                        onClick={() => setMobileMenuOpen(false)}
                        className={mobileLinkClass}
                      >
                        {item.name}
                      </NavLink>
                    )
                  )}

                  {/* Mobile language menu */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center mb-3 px-4">
                      <Globe className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="font-medium text-gray-700">
                        {t("header.language")}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                            i18n.language === lang.code
                              ? "bg-red-50 text-red-700"
                              : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                          }`}
                        >
                          <img
                            src={lang.flagIcon}
                            alt={lang.code}
                            className="h-5 w-5 mr-3"
                            loading="lazy"
                            decoding="async"
                          />
                          {lang.name}
                          {i18n.language === lang.code && (
                            <span className="ml-auto text-red-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile user menu */}
                  {userInfo && (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center mb-3 px-4">
                        <User className="h-6 w-6 mr-2 text-red-600" />
                        <div className="flex flex-col">
                          <span className="font-bold text-xl text-gray-800">
                            {userInfo.fullName}
                          </span>
                          {userInfo.isAdmin ? (
                            <span className="text-xs font-bold text-yellow-700">
                              {t("header.admin_role")}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-blue-700">
                              {t("header.basic_role")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className={mobileUserLinkClass}
                        >
                          <MonitorCog className="h-5 w-5 mr-3" />{" "}
                          {t("header.admin_page")}
                        </NavLink>
                        <NavLink
                          to="/admin/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className={mobileUserLinkClass}
                        >
                          <User className="h-5 w-5 mr-3" />{" "}
                          {t("header.my_account")}
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="h-5 w-5 mr-3" />{" "}
                          {t("header.logout")}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Login button */}
                  {!userInfo && (
                    <div className="pt-6 border-t border-gray-200">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full bg-red-600 text-white text-center px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition"
                      >
                        {t("login")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default React.memo(Header);
