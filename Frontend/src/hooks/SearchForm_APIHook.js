import { transformers } from "./DataTransformers/SearchDataTransformer";
import { categories } from "../components/SearchForm/Categories";
const serverUrl = import.meta.env.VITE_API_URL;

export async function fetchAPI(api_url, api_params = [], params = [], options = {}, name = "", categoryID = []) {
  try {
    // Specific case for kategorie kod
    if (api_params.includes("kategorie_kod") && categoryID) {
    const category = categories.find((cat) => cat.key === categoryID);
      if (category) {
        const index = api_params.indexOf("kategorie_kod");
        params[index] = category.id;
      }
    }

    // Validate parameters
    if (api_params.length !== params.length) {
      console.error("Parameter mismatch:");
      console.error("api_params:", api_params);
      console.error("params:", params);
      throw new Error("Number of params and their values don't match");
    }

    // Build URL
    let url = `${serverUrl}${api_url}`;
    const queryParams = new URLSearchParams();

    // Build params
    for (let i = 0; i < api_params.length; i++) {
      queryParams.append(api_params[i], params[i]);
    }

    // Add optional params if defined
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    // Fetch and return data if everything ok
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const rawData = await response.json();
    const transformer = transformers[name] || transformers.default;
    return transformer(rawData);

  } catch (error) {
    // If error then logs it
    console.error("fetchAPI error:", error);
    throw error; 
  }
}