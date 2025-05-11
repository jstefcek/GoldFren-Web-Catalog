import React, { useState, useEffect, useRef, useCallback } from "react";
import { Globe, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSortimentOpen, setMobileSortimentOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  // Close mobile menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSortimentOpen(false);
  }, [location.pathname]);

  const handleLanguageChange = useCallback((lng) => {
    i18n.changeLanguage(lng);
  }, [i18n]);

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
    { name: t("kontakt"), path: "/kontakt" },
  ];

  const languages = [
    { code: "cs", name: "Česky", flag: "🇨🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const currentLanguageInfo = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/logo/goldfren-logo.svg"
                alt="GoldFren Logo"
                className="h-8 w-auto"
                width="120"
                height="32"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <ul className="flex space-x-8">
              {menuItems.map((item) => (
                <li key={item.name} className={`relative group ${item.submenu ? "dropdown" : ""}`}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center text-gray-700 px-3 py-2 rounded-md hover:text-gray-600 hover:bg-gray-50 transition"
                        aria-haspopup="true"
                      >
                        {item.name}
                        <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                      </button>
                      <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-200">
                        <ul className="py-1">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.name}>
                              <Link
                                to={subitem.path}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-600 transition"
                              >
                                {subitem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="flex items-center text-gray-700 px-3 py-2 rounded-md hover:text-gray-600 hover:bg-gray-50 transition"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side: Language + Login + Mobile Toggle */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative hidden lg:block group">
              <div className="flex items-center text-gray-700 hover:text-gray-600 px-2 py-1 rounded-md cursor-pointer">
                <span className="text-lg mr-1">{currentLanguageInfo.flag}</span>
                <span className="hidden md:inline mx-1">{currentLanguageInfo.name}</span>
                <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
              </div>
              <div className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2 transition-all duration-200">
                <ul className="py-1">
                  {languages.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-x-3 ${
                          i18n.language === lang.code ? "bg-gray-50 text-gray-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-600"
                        } transition`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Login */}
            <Link
              to="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              {t("login")}
            </Link>

            {/* Mobile Toggle */}
            <button
              type="button"
              className="lg:hidden text-gray-700 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 p-1 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} id="mobile-menu" className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-40 overflow-y-auto shadow-lg">
          <nav className="px-2 pt-2 pb-20 space-y-1">
            {/* Mobile Language Selector */}
            <div className="border-b border-gray-200 pb-3 mb-2">
              <div className="flex items-center px-3 py-2">
                <Globe className="h-5 w-5 text-gray-500 mr-2" />
                <p className="text-sm font-medium text-gray-500">{t("selectLanguage")}</p>
              </div>
              <div className="mt-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 flex items-center gap-x-3 rounded-md ${
                      i18n.language === lang.code ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    } transition`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {i18n.language === lang.code && <span className="ml-auto text-green-600">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setMobileSortimentOpen(!mobileSortimentOpen)}
                      className="w-full flex items-center justify-between text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:text-gray-900 hover:bg-gray-50 transition"
                      aria-expanded={mobileSortimentOpen}
                    >
                      <span>{item.name}</span>
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${mobileSortimentOpen ? "bg-gray-200" : ""}`}>
                        {mobileSortimentOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>
                    <div className={`transition-all duration-300 overflow-hidden ${mobileSortimentOpen ? "max-h-96" : "max-h-0"}`}>
                      <div className="pl-4 space-y-1 mt-1 bg-gray-50 rounded-md mx-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            to={subitem.path}
                            className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition"
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default React.memo(Header);
