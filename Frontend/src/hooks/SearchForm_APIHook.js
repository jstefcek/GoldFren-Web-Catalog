const serverUrl = import.meta.env.VITE_API_URL;

export async function fetchAPI(api_url, api_params = [], params = [], options = {}) {
  try {
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
    return await response.json();

  } catch (error) {
    // If error then logs it
    console.error("fetchAPI error:", error);
    throw error; 
  }
}