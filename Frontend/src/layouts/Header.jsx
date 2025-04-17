import { useState, useEffect } from "react";
import { Globe, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSortimentOpen, setIsSortimentOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState("cs");

  // Set current language by i18n
  useEffect(() => {
    if (i18n.language) {
      setCurrentLanguage(i18n.language);
    }
  }, [i18n.language]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set menu items
  const menuItems = [
    { name: t("home"), path: "/" },
    { name: t("nove"), path: "/nove" },
    {
      name: t("sortiment"),
      submenu: [
        { name: t("adaptery"), path: "/sortiment/adaptery" },
        { name: t("brzdice"), path: "/sortiment/brzdice" },
        { name: t("desticky"), path: "/sortiment/desticky" },
        { name: t("hadicky"), path: "/sortiment/hadicky" },
        { name: t("kotouce"), path: "/sortiment/kotouce" },
        { name: t("pumpy"), path: "/sortiment/pumpy" },
        { name: t("prislusenstvi"), path: "/sortiment/prislusenstvi" },
      ],
    },
    { name: t("kontakt"), path: "/kontakt" },
  ];

  // Languages setup with flags
  const languages = [
    { code: "cs", name: "Čeština", flag: "🇨🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  // Change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  // Toggle sortiment windows
  const toggleSortiment = () => {
    setIsSortimentOpen(!isSortimentOpen);
  };

  // Toggle language windows
  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="/logo/goldfren-logo.svg"
                alt="GoldFren Logo"
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Main Menu - centered */}
          <div className="hidden lg:flex w-full justify-center">
            <nav className="flex space-x-8">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  //onMouseEnter={() => setIsSortimentOpen(true)}
                  //onMouseLeave={() => setIsSortimentOpen(false)}
                >
                  {item.submenu ? (
                    <div>
                      <button
                        className="flex items-center text-gray-700 px-2 py-1 hover:text-red-600 hover:bg-gray-100 rounded transition duration-150"
                        onClick={toggleSortiment}
                      >
                        {item.name}
                        {isSortimentOpen ? (
                          <ChevronUp className="h-6 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-6 w-4 ml-1" />
                        )}
                      </button>

                      {/* Main Menu - sub menu */}
                      <div
                        className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 focus:outline-none z-10 transition-all duration-200 ${
                          isSortimentOpen
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                        }`}
                      >
                        <div className="py-1">
                          {item.submenu.map((subitem) => (
                            <a
                              key={subitem.name}
                              href={subitem.path}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                            >
                              {subitem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.path}
                      className="flex items-center text-gray-700 px-2 py-1 hover:text-red-600 hover:bg-gray-100 rounded transition duration-150"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right side menu - Language selector and Login */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center text-gray-700 hover:text-red-600"
              >
                {/* Globe icon */}
                <Globe className="h-5 w-5 mr-2" />

                {/* Big screen show language name on mobile show flag */}
                <span className="hidden md:inline">
                  {
                    languages.find((lang) => lang.code === currentLanguage)
                      ?.name
                  }
                </span>
                <span className="md:hidden text-2xl">
                  {
                    languages.find((lang) => lang.code === currentLanguage)
                      ?.flag
                  }
                </span>
              </button>

              {/* Language selector */}
              <div
                className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5 focus:outline-none z-10 transition-all duration-200 ${
                  isLanguageMenuOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
              >
                <div className="py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="block w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-red-600"
                    >
                      <span className="flex items-center gap-x-3">
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Login Button */}
            <a
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-150 whitespace-nowrap"
            >
              {t("login")}
            </a>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-red-600"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu settings*/}
      <div className={`lg:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={toggleSortiment}
                    className="w-full flex items-center justify-between text-gray-700 px-3 py-2 rounded-md text-base font-medium hover:text-red-600 hover:bg-gray-100"
                  >
                    {item.name}
                    {isSortimentOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {isSortimentOpen && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.submenu.map((subitem) => (
                        <a
                          key={subitem.name}
                          href={subitem.path}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100"
                        >
                          {subitem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100"
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
