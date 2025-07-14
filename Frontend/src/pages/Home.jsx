import React, { useState, useMemo, useRef, useEffect } from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import { useTranslation } from 'react-i18next';
import DataGrid from '../components/DataGrid/DataGrid';
import { useCategoryResults } from "../hooks/Categories_APIHook";

const serverUrl = import.meta.env.VITE_API_URL;

function Home() {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const vehicleTitleRef = useRef(null);
  const sortimentTitleRef = useRef(null);

  // API URL for vehicle search data
  const searchDataAPI = (searchData?.type === "vehicle" && searchData?.vozidlo_kod && searchData?.api)
    ? `${serverUrl}${searchData.api}${searchData.vozidlo_kod}`
    : null;

  const { data: sortimentData } = useCategoryResults(searchDataAPI);

  // Check if search is complete
  const isSearchComplete = (data) => {
    setSearchData(data);
    setIsDataReady(false);
    console.log("Data is:", data);
  };

  // Transform sortiment data to include full image URLs
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

  // Detect when data is ready atleast one category has items
  useEffect(() => {
    if (searchData?.type === "vehicle" && transformedSortimentData) {
      const hasItems = Object.values(transformedSortimentData).some(category => category.items.length > 0);
      if (hasItems) {
        setIsDataReady(true);
      }
    } else {
      setIsDataReady(true);
    }
  }, [transformedSortimentData, searchData]);

  // Scroll to the h2 title when data is ready
  useEffect(() => {
    if (!isDataReady) return;

    // Header offset for fixed header
    const headerOffset = 80;

    // Choose the target element where to scroll
    const targetElement = vehicleTitleRef.current || sortimentTitleRef.current;
    if (!targetElement) return;

    // Get the position
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    // Scroll to the position with smooth animation
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }, [isDataReady]);

  // Helper to flatten filter values for API
  const flattenFilters = (filters) => {
    if (!filters) return {};
    const result = {};
    for (const [key, val] of Object.entries(filters)) {
      if (val && typeof val === "object" && "value" in val) {
        result[key] = val.value;
      } else {
        result[key] = val;
      }
    }
    return result;
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center mt-8">{t('searchTitle')}</h1>

      {/* Search form component */}
      <SearchForm isSearchComplete={isSearchComplete} />

      {/* Show search results when search is complete */}
      {searchData && (
        searchData.type === "vehicle" && searchData.vozidlo_kod ? (
          <div>
            {/* Vehicel title */}
            {isDataReady && (
              <div>
              <h2 ref={vehicleTitleRef} className="text-3xl font-bold mt-4 text-left ml-4 mr-4">
                {searchData.filters.vyrobce?.label || searchData.filters.vyrobce} {searchData.filters.model?.label || searchData.filters.model}
              </h2>
                <p className="font-light text-sm text-left ml-4 mr-4">
                  {searchData.filters.year?.label || searchData.filters.year}
                </p>
              </div>
            )}

            {/* Show sortiment data */}
            {transformedSortimentData && Object.entries(transformedSortimentData).map(([key, categoryData]) => (
              categoryData.items.length > 0 && (
                <div key={key} className="mb-4">
                  {/* Category title */}
                  <h3 className="text-2xl font-semibold capitalize mt-4 ml-4 mr-4">{t(key)}</h3>

                  {/* Display the data with Datagrid component */}
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
          
          // If not vehicle search, show category data
          <div>
            {/* Sortiment title */}
            <h2 ref={sortimentTitleRef} className="text-3xl font-bold mt-4 mb-4 text-left ml-4 mr-4">
              {t(`search.${searchData.category}.title`)}
            </h2>

            {/* Display the data with Datagrid component */}
            <DataGrid
              category={searchData.page_category}
              apiCategory={searchData.category}
              apiUrl={serverUrl + searchData.api}
              filters={flattenFilters(searchData.filters)}
            />
          </div>
        )
      )}
    </div>
  );
}

export default Home;