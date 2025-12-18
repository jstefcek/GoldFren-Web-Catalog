import DataGrid from "../components/DataGrid/DataGrid"
import { useTranslation } from 'react-i18next';
import { trackTopSortimentCategory } from '../utils/GoogleAnalytics';
import { useEffect } from "react";
const serverUrl = import.meta.env.VITE_API_URL;

function Sortiment_Page({ sortiment_category, apiUrl }) {
  // Translation hook
  const { t } = useTranslation();

  // Track category viewed
  useEffect(() => {
    trackTopSortimentCategory({ category: sortiment_category });
  }, []);

  // Build page title for translation
  const titleKey = `${sortiment_category}_title`;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4 ml-4 sm:ml-6 text-left mt-8">{t(titleKey)}</h1>
      <div className="p-4 md:p-6">
        <DataGrid category={sortiment_category} apiUrl={`${serverUrl}/${apiUrl}`} />
      </div>
    </div>
  );
}

export default Sortiment_Page;