import React from 'react';
import DataGrid from "../components/DataGrid/DataGrid"
import { useTranslation } from 'react-i18next';
const serverUrl = import.meta.env.VITE_API_URL;

function Adaptery() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4 ml-6 text-left mt-8">{t('adapter_title')}</h1>
      <DataGrid category="adaptery" apiUrl={`${serverUrl}/api/goldfren/internal/adaptery?limit=0`} />
    </div>
  );
}

export default Adaptery;