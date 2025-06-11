import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "cs", name: "Česky", flagIcon: "/icons/czech.svg" },
  { code: "en", name: "English", flagIcon: "/icons/english.svg" },
  { code: "de", name: "Deutsch", flagIcon: "/icons/german.svg" },
];

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = useCallback((lng) => {
    i18n.changeLanguage(lng);
  }, [i18n]);

  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex items-center justify-center mb-3">
        <span className="text-sm text-gray-500">{t("selectLanguage")}</span>
      </div>
      <div className="flex justify-center space-x-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center px-3 py-2 rounded-md border transition-all duration-200 ${
              i18n.language === lang.code
                ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <img src={lang.flagIcon} alt={lang.code} className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline text-sm font-medium">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}