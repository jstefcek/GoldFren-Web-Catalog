import React, { useState, useMemo } from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import { useTranslation } from 'react-i18next';
import DataGrid from '../components/DataGrid/DataGrid';
import { useCategoryResults } from "../hooks/Categories_APIHook";

const serverUrl = import.meta.env.VITE_API_URL;

function Home() {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState(null);

  // Construct API path
  const searchDataAPI = (searchData?.type === "vehicle" && searchData?.vozidlo_kod && searchData?.api)
    ? `${serverUrl}${searchData.api}${searchData.vozidlo_kod}`
    : null;

  // Fetch API
  const { data: sortimentData } = useCategoryResults(searchDataAPI);

  // When search is complete continue
  const isSearchComplete = (data) => {
    setSearchData(data);
    console.log("Data is:", data);
  };

  // Transformed data
  const transformedSortimentData = useMemo(() => {
    if (!sortimentData) return {};
  
    return Object.fromEntries(
      Object.entries(sortimentData).map(([key, categoryData]) => [
        key,
        {
          ...categoryData,
          items: categoryData.items.map((item) => ({
            ...item,
            obrazek: item.obrazek ? `${serverUrl}/GoldFren_Media/${key}/image/${item.obrazek}` : null,
            vektor: item.vektor ? `${serverUrl}/GoldFren_Media/${key}/vector/${item.vektor}`: null,
          })),
        },
      ])
    );
  }, [sortimentData]);
  

  return (
    <div className="container mx-auto">
      {/* Home title */}
      <h1 className="text-3xl font-bold mb-8 text-center mt-8">{t('searchTitle')}</h1>

      {/* Search form component */}
      <SearchForm isSearchComplete={isSearchComplete} />

      {/* Hide vozidlo or sortiment title until search is complete */}
      {searchData && (
        searchData.type === "vehicle" && searchData.vozidlo_kod ? (
          <div>
            {/* Show sortiment data for categories */}
            <h2 className="text-3xl font-bold mt-4 text-left ml-4 mr-4">
              {searchData.filters.model}
            </h2>

            {/* Show sortiment data for categories */}
            {transformedSortimentData && Object.entries(transformedSortimentData).map(([key, categoryData]) => (
              categoryData.items.length > 0 && (
                <div key={key} className="mb-4">
                  <h3 className="text-2xl font-semibold capitalize mt-4 ml-4 mr-4">{t(key)}</h3>
                  <DataGrid
                    category={key}
                    apiCategory={key + "_home"}
                    apiData={categoryData.items}
                    listAll={true}
                  />
                </div>
              )
            ))}
          </div>
        ) : (
          <div>
            {/* Show sortiment title */}
            <h2 className="text-3xl font-bold mt-4 mb-4 text-left ml-4 mr-4">
              {t(`search.${searchData.category}.title`)}
            </h2>

            {/* Show sortiment values inside datagrid */}
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