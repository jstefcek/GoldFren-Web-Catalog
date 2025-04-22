import React from 'react';
import DataGrid from "../components/DataGrid/DataGrid"
import { useTranslation } from 'react-i18next';

function Brzdice() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 ml-6 text-left mt-4">{t('brzdice_title')}</h1>
      <DataGrid category="brzdice" apiUrl={"http://localhost/api/goldfren/internal/brzdice?limit=0"} />
    </div>
  );
}

export default Brzdice;