import React from 'react';
import DataGrid from "../components/DataGrid/DataGrid"
import { useTranslation } from 'react-i18next';

function Adaptery() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-left mt-4">{t('adapter_title')}</h1>
      <DataGrid category="adaptery" />
    </div>
  );
}

export default Adaptery;