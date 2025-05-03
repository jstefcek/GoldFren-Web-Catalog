import { useState, useEffect } from "react";
import { Globe, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSortimentOpen, setMobileSortimentOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("cs");
  
  // Set current language from i18n
  useEffect(() => {
    if (i18n.language) {
      setCurrentLanguage(i18n.language);
    }
  }, [i18n.language]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu items definition
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

  // Languages configuration
  const languages = [
    { code: "cs", name: "Česky", flag: "🇨🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageMenuOpen(false);
  };

  const toggleMobileSortiment = () => {
    setMobileSortimentOpen(!mobileSortimentOpen);
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
  };

  const currentLanguageInfo = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="/logo/goldfren-logo.svg"
                alt="GoldFren Logo"
                className="h-8 w-auto"
                width="120"
                height="32"
              />
            </a>
          </div>

          {/* Main Menu */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <ul className="flex space-x-8">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className={`relative group ${item.submenu ? 'dropdown' : ''}`}
                >
                  {item.submenu ? (
                    <>
                      <a
                        href="#"
                        className="flex items-center text-gray-700 px-3 py-2 rounded-md hover:text-gray-600 hover:bg-gray-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                        aria-haspopup="true"
                        onClick={(e) => e.preventDefault()}
                      >
                        {item.name}
                        <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" aria-hidden="true" />
                      </a>

                      {/* Submenu dropdown on hover */}
                      <div
                        className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 -translate-y-2"
                      >
                        <ul className="py-1" role="menu" aria-orientation="vertical">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.name} role="none">
                              <a
                                href={subitem.path}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-600 transition duration-150"
                                role="menuitem"
                              >
                                {subitem.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <a
                      href={item.path}
                      className="flex items-center text-gray-700 px-3 py-2 rounded-md hover:text-gray-600 hover:bg-gray-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                    >
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side menu - Language selector and Login */}
          <div className="flex items-center space-x-2">
            
            {/* Language Selector */}
            <div className="relative group">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center text-gray-700 hover:text-gray-600 px-2 py-1 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 lg:hidden"
                aria-expanded={languageMenuOpen}
                aria-haspopup="true"
              >
                <span className="text-lg mr-1">{currentLanguageInfo.flag}</span>
                <span className="hidden md:inline mx-1">{currentLanguageInfo.name}</span>
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${languageMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Desktop language menu (hover) */}
              <div className="hidden lg:flex items-center text-gray-700 hover:text-gray-600 px-2 py-1 rounded-md transition duration-150 focus:outline-none cursor-pointer">
                <span className="text-lg mr-1">{currentLanguageInfo.flag}</span>
                <span className="hidden md:inline mx-1">{currentLanguageInfo.name}</span>
                <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
              </div>

              {/* Language dropdown */}
              <div
                className={`absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all duration-200 
                  lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:transform lg:group-hover:translate-y-0 lg:-translate-y-2
                  ${languageMenuOpen ? "opacity-100 visible transform translate-y-0" : "opacity-0 invisible transform -translate-y-2"}`}
              >
                <ul className="py-1" role="menu" aria-orientation="vertical">
                  {languages.map((lang) => (
                    <li key={lang.code} role="none">
                      <button
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-x-3 
                          ${currentLanguage === lang.code ? 'bg-gray-50 text-gray-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-600 cursor-pointer'} 
                          transition duration-150`}
                        role="menuitem"
                        aria-current={currentLanguage === lang.code ? 'true' : undefined}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Login Button */}
            <a
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-150 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              {t("login")}
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden text-gray-700 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="px-2 pt-2 pb-3 space-y-1 bg-white">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={toggleMobileSortiment}
                    className="w-full flex items-center justify-between text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:text-gray-600 hover:bg-gray-50 transition duration-150"
                    aria-expanded={mobileSortimentOpen}
                  >
                    {item.name}
                    {mobileSortimentOpen ? (
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>

                  <div
                    className={`pl-4 space-y-1 mt-1 transition-all duration-300 overflow-hidden ${
                      mobileSortimentOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {item.submenu.map((subitem) => (
                      <a
                        key={subitem.name}
                        href={subitem.path}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-600 hover:bg-gray-50 transition duration-150"
                      >
                        {subitem.name}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  href={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-600 hover:bg-gray-50 transition duration-150"
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}