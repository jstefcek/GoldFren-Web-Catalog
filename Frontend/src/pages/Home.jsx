import React, { useState } from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import { useTranslation } from 'react-i18next';
import DataGrid from '../components/DataGrid/DataGrid';
const serverUrl = import.meta.env.VITE_API_URL;

function Home() {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState(null);

  // Function to handle the completion of the search
  const isSearchComplete = (data) => {
    setSearchData(data);
    console.log("VozidloKod is: ", data);
  };

  return (
    <div className="container mx-auto">
      {/* Home title */}
      <h1 className="text-3xl font-bold mb-8 text-center mt-8">{t('searchTitle')}</h1>

      {/* Search form component */}
      <SearchForm isSearchComplete={isSearchComplete} />
      
      {/* Hide vozidlo title until search is complete */}
      {searchData && (
        searchData.type === "vehicle"
          // Check if the type is vehicle
          ? (
            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-left ml-4">{searchData.filters.model}</h2>
              
            </div>
          )

          // If not its sortiment type <DataGrid category={searchData.category} apiUrl={serverUrl + searchData.api}/>
          : (
            <div>
              <h2 className="text-2xl font-bold mt-8 mb-4 text-left ml-4">{t(`search.` + searchData.category.toString() + `.title`)}</h2>
              <DataGrid
                category={searchData.page_category}
                apiCategory={searchData.category}
                apiUrl={serverUrl + searchData.api}
                filters={searchData.filters}
              />
            </div>
          )
      )}
    </div>
  );
}

export default Home;