import React from 'react';
import DataGrid from "../components/DataGrid/DataGrid"
import { useTranslation } from 'react-i18next';
const serverUrl = import.meta.env.VITE_API_URL;

function Brzdice() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4 ml-4 sm:ml-6 text-left mt-8">{t('brzdice_title')}</h1>
        <div className="p-4 md:p-6"> 
          <DataGrid category="brzdice" apiUrl={`${serverUrl}/api/goldfren/internal/brzdice?limit=0`} />
        </div>
    </div>
  );
}

export default Brzdice;