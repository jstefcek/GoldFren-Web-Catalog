import DataGrid from "../components/DataGrid/DataGrid"
import { useTranslation } from 'react-i18next';
import { trackTopSortimentCategory } from '../utils/GoogleAnalytics';
const serverUrl = import.meta.env.VITE_API_URL;

function Prislusenstvi() {
  // Translation hook
  const { t } = useTranslation();

  // Track category viewed
  trackTopSortimentCategory({ category: ['prislusenstvi'] });

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4 ml-4 sm:ml-6 text-left mt-8">{t('prislusenstvi_title')}</h1>
      <div className="p-4 md:p-6">
        <DataGrid category="prislusenstvi" apiUrl={`${serverUrl}/api/goldfren/internal/prislusenstvi?limit=0`} />
      </div>
    </div>
  );
}

export default Prislusenstvi;