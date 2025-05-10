import { useEffect, useState } from "react";

export function useCategoryResults(searchData_API) {
  const [data, setData] = useState({});

  // Call API for categories and return
  useEffect(() => {
    if (!searchData_API) return;

    const fetchData = async () => {
      try {
        const response = await fetch(searchData_API);
        if (!response.ok) throw new Error("Failed to fetch results");

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.log("Error calling API: " + err);
        setData({});
      }
    };

    fetchData();
  }, [searchData_API]);

  return { data };
}
