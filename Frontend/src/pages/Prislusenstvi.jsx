import React from 'react';
import DataGrid from "../components/DataGrid/DataGrid"
import { useTranslation } from 'react-i18next';
const serverUrl = import.meta.env.VITE_API_URL;

function Prislusenstvi() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4 ml-6 text-left mt-8">{t('prislusenstvi_title')}</h1>
      <DataGrid category="prislusenstvi" apiUrl={`${serverUrl}/api/goldfren/internal/prislusenstvi?limit=0`} />
    </div>
  );
}

export default Prislusenstvi;