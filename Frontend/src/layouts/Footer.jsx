import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { t } = useTranslation();

  // Get Application version
  const version = import.meta.env.VITE_APP_VERSION || "v1.0.0";

  // Linkedin url
  const linkedin_url = "https://www.linkedin.com/in/jakub-%C5%A1tef%C4%8Dek-a5447a253/"

  // Get curent year
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full text-center text-sm text-gray-500 py-4 mt-auto bg-white border-t border-gray-200">
      ©{year} Andrea Špačková – PRODUCT SPACEK – All rights reserved – Version: {version} – {t("footer_created")}:{" "}
      <a
        href={linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:cursor-pointer text-gray-500 hover:text-gray-800"
      >
        Jakub Štefček
      </a>
    </footer>
  );  
}
