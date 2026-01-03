import { useCallback, useEffect, useRef, useState } from "react";

const serverUrl = import.meta.env.VITE_API_URL;

export function useStatsAPI(endpointURL, access_token, { auto = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Used to re-trigger fetch manually without changing endpoint
  const [reloadKey, setReloadKey] = useState(0);

  // Avoid setting state after unmount
  const abortRef = useRef(null);

  const refetch = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!endpointURL) return;
    if (!auto && reloadKey === 0) return;

    const fetchData = async () => {
      // Abort previous request if any
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const headers = {};
        if (access_token) {
          headers["Authorization"] = `Bearer ${access_token}`;
        }

        const response = await fetch(`${serverUrl}${endpointURL}`, {
          headers,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch results (${response.status})`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err?.message || "Failed to fetch results");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [endpointURL, access_token, auto, reloadKey]);

  return { data, loading, error, refetch };
}