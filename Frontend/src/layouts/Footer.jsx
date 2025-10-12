import { useTranslation } from 'react-i18next';
import React from 'react';

// Static constants outside component to avoid reallocation
const version = import.meta.env.VITE_APP_VERSION || "v1.0.0";
const linkedinUrl = "https://www.linkedin.com/in/jakub-%C5%A1tef%C4%8Dek-a5447a253/";
const currentYear = new Date().getFullYear();

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full min-h-[48px] text-center text-sm text-gray-500 py-4 bg-white border-t border-gray-200">
      © {currentYear} GOLD FREN s.r.o. • All rights reserved • v{version} • {t("footer_created")}:{" "}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:cursor-pointer text-gray-500 hover:text-gray-800"
        title="LinkedIn profile of Jakub Štefček"
      >
        Jakub Štefček
      </a>
    </footer>
  );
}

export default React.memo(Footer);