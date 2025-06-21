import React, { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ChevronDown, ChevronUp, User, LogOut, MonitorCog, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSortimentOpen, setMobileSortimentOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [sortimentMenuOpen, setSortimentMenuOpen] = useState(false);
  const [sortimentClicked, setSortimentClicked] = useState(false);
  const [langClicked, setLangClicked] = useState(false);
  const [userClicked, setUserClicked] = useState(false);

  const { userInfo, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const sortimentMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const sortimentCloseTimeout = useRef();
  const langCloseTimeout = useRef();
  const userCloseTimeout = useRef();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSortimentOpen(false);
    setSortimentMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
        setUserClicked(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangMenuOpen(false);
        setLangClicked(false);
      }
      if (sortimentMenuRef.current && !sortimentMenuRef.current.contains(e.target)) {
        setSortimentMenuOpen(false);
        setSortimentClicked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(sortimentCloseTimeout.current);
      clearTimeout(langCloseTimeout.current);
      clearTimeout(userCloseTimeout.current);
    };
  }, []);

  const handleSortimentMouseEnter = () => {
    clearTimeout(sortimentCloseTimeout.current);
    if (!sortimentClicked) setSortimentMenuOpen(true);
  };

  const handleSortimentMouseLeave = () => {
    sortimentCloseTimeout.current = setTimeout(() => {
      if (!sortimentClicked) setSortimentMenuOpen(false);
    }, 200);
  };

  const handleLangMouseEnter = () => {
    clearTimeout(langCloseTimeout.current);
    if (!langClicked) setLangMenuOpen(true);
  };

  const handleLangMouseLeave = () => {
    langCloseTimeout.current = setTimeout(() => {
      if (!langClicked) setLangMenuOpen(false);
    }, 200);
  };

  const handleUserMouseEnter = () => {
    clearTimeout(userCloseTimeout.current);
    if (!userClicked) setUserMenuOpen(true);
  };

  const handleUserMouseLeave = () => {
    userCloseTimeout.current = setTimeout(() => {
      if (!userClicked) setUserMenuOpen(false);
    }, 200);
  };

  const handleLanguageChange = useCallback((lng) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
    setLangClicked(false);
    setMobileMenuOpen(false);
  }, [i18n]);

  const handleLogout = () => {
    sessionStorage.clear();
    logout();
    setUserMenuOpen(false);
    setUserClicked(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const hasActiveSubmenuItem = (submenu) => {
    return submenu.some((item) => isActiveRoute(item.path));
  };

  const menuItems = [
    { name: t("home"), path: "/" },
    {
      name: t("sortiment"),
      submenu: [
        { name: t("adaptery"), path: "/adaptery" },
        { name: t("brzdice"), path: "/brzdice" },
        { name: t("desticky"), path: "/desticky" },
        { name: t("hadicky"), path: "/hadicky" },
        { name: t("kotouce"), path: "/kotouce" },
        { name: t("pumpy"), path: "/pumpy" },
        { name: t("prislusenstvi"), path: "/prislusenstvi" },
      ],
    },
    { name: t("kontakt"), path: "/contact" },
  ];

  const languages = [
    { code: "cs", name: "Česky", flagIcon: "/icons/czech.svg" },
    { code: "en", name: "English", flagIcon: "/icons/english.svg" },
    { code: "de", name: "Deutsch", flagIcon: "/icons/german.svg" },
  ];

  const currentLanguageInfo = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/logo/goldfren-logo.svg" alt="GoldFren Logo" className="h-8 w-auto" />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center flex-1">
            <ul className="flex space-x-2">
              {menuItems.map((item) => (
                item.submenu ? (
                  <li
                    key={item.name}
                    className="relative"
                    ref={sortimentMenuRef}
                    onMouseEnter={handleSortimentMouseEnter}
                    onMouseLeave={handleSortimentMouseLeave}
                  >
                    <button
                      onClick={() => {
                        const next = !sortimentMenuOpen;
                        setSortimentMenuOpen(next);
                        setSortimentClicked(next);
                      }}
                      className={`flex items-center px-4 py-2 rounded-lg font-normal transition cursor-pointer ${
                        hasActiveSubmenuItem(item.submenu)
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className={`h-4 w-4 ml-2 ${sortimentMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    {sortimentMenuOpen && (
                      <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-100">
                        <ul className="py-2">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.name}>
                              <Link
                                to={subitem.path}
                                onClick={() => {
                                  setSortimentMenuOpen(false);
                                  setSortimentClicked(false);
                                }}
                                className={`block px-4 py-3 text-sm font-normal transition ${
                                  isActiveRoute(subitem.path)
                                    ? "bg-red-50 text-red-700"
                                    : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                                }`}
                              >
                                {subitem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg font-normal transition ${
                        isActiveRoute(item.path)
                          ? "bg-red-50 text-red-700"
                          : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </nav>

          {/* Language menu section */}
          <div className="flex items-center space-x-3">
            <div
              className="relative hidden lg:block"
              ref={langMenuRef}
              onMouseEnter={handleLangMouseEnter}
              onMouseLeave={handleLangMouseLeave}
            >
              <button
                onClick={() => {
                  const next = !langMenuOpen;
                  setLangMenuOpen(next);
                  setLangClicked(next);
                }}
                className="flex items-center text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition cursor-pointer font-normal"
              >
                <img src={currentLanguageInfo.flagIcon} alt={currentLanguageInfo.code} className="h-5 w-5 mr-2 rounded-sm" />
                <span className="hidden md:inline">{currentLanguageInfo.name}</span>
                <ChevronDown className={`h-4 w-4 ml-1 ${langMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 min-w-[10rem] max-w-[12rem] rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-100">
                  <ul className="py-2">
                    {languages.map((lang) => (
                      <li key={lang.code}>
                        <button
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full text-left px-4 py-2 flex items-center gap-4 font-bold transition cursor-pointer ${
                            i18n.language === lang.code
                              ? "bg-red-50 text-red-700"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-600 font-normal"
                          }`}
                        >
                          <img src={lang.flagIcon} alt={lang.code} className="h-5 w-5 font-bold" />
                          {lang.name}
                          {i18n.language === lang.code && <span className="ml-auto font-bold text-red-600">✓</span>}
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
                onMouseEnter={handleUserMouseEnter}
                onMouseLeave={handleUserMouseLeave}
              >
                <button
                  onClick={() => {
                    const next = !userMenuOpen;
                    setUserMenuOpen(next);
                    setUserClicked(next);
                  }}
                  className="bg-white hover:bg-red-50 border-2 border-red-600 text-red-600 px-3 py-2 rounded-lg flex items-center font-medium transition cursor-pointer"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden md:inline">{userInfo.displayName}</span>
                  <ChevronDown className={`h-4 w-4 ml-1 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 min-w-[12rem] max-w-[14rem] rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-100">
                    <ul className="py-1">
                      <li className="px-4 py-2 font-bold text-gray-700">{userInfo.fullName}</li>
                      <li>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => { setUserMenuOpen(false); setUserClicked(false); }}
                          className={`block px-4 py-2 text-sm flex items-center transition ${
                            isActiveRoute("/admin")
                              ? "bg-red-50 text-red-700"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                          }`}
                        >
                          <MonitorCog className="h-4 w-4 mr-2" /> Administrace
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/account"
                          onClick={() => { setUserMenuOpen(false); setUserClicked(false); }}
                          className={`block px-4 py-2 text-sm flex items-center transition ${
                            isActiveRoute("/account")
                              ? "bg-red-50 text-red-700"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                          }`}
                        >
                          <User className="h-4 w-4 mr-2" /> Můj účet
                        </Link>
                      </li>
                      <li className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 flex items-center hover:bg-red-50 transition cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Odhlásit se
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!userInfo && (
              <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition">
                {t("login")}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-red-50 transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default React.memo(Header);
