import React from 'react';
import DataGrid from "../components/DataGrid/DataGrid"
import { useTranslation } from 'react-i18next';

function Desticky() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4 ml-6 text-left mt-4">{t('desticky_title')}</h1>
      <DataGrid category="desticky" apiUrl={"http://localhost/api/goldfren/internal/desticky?limit=0"} />
    </div>
  );
}

export default Desticky;