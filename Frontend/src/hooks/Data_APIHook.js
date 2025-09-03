import { dataTransformers } from "./DataTransformers/DataTransformer"

export const fetchData = async (category, apiUrl, headers = null) => {
    // If no API URL is provided, return empty data
    if (!apiUrl) {
      console.warn('No API URL provided for category:', category);
      return [];
    }
  
    try {
      // If headers are provided, include them in the fetch request
      const options = {
        headers: headers ? { ...headers, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      };

      // Fetch data from the API
      const response = await fetch(apiUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result)
      
      // Use category-specific transformers if available
      const transformer = dataTransformers[category];
      if (transformer) {
        let result_data = transformer(result)
        return result_data;
      }
      
      // Default transformation if no specific transformer is available
      if (result && Array.isArray(result)) {
        return result;
      }
      
      // If the API returns an array directly
      if (Array.isArray(result)) {
        return result;
      }
      
      console.warn('Unexpected data format for category:', category);
      return [];
    } catch (error) {
      console.error(`Error fetching data for ${category}:`, error);
      throw error;
    }
  };