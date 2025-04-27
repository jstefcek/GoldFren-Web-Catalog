import React from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center mt-12">{t('searchTitle')}</h1>
      <SearchForm />
    </div>
  );
}

export default Home;