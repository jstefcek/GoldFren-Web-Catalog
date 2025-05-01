import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from "react-i18next";

// NavigationStrip component
export function NavigationStrip({ to = "", label = "", description = "" }) {
  const handleClick = () => {
    if (to.startsWith('http')) {
      window.location.href = to;
    } else {
      window.location.pathname = to;
    }
  };

  const { t } = useTranslation();

  return (
    <nav aria-label="Breadcrumb" className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm mb-4">
      <div className="w-full px-4 md:px-6 py-3 flex items-center space-x-3 p-4">
        <button
          onClick={handleClick}
          className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          <span className="font-xs truncate">
            {label} {t(description)}
          </span>
        </button>
      </div>
    </nav>
  );
}