import { useState, useEffect } from "react";

/**
 * Custom hook to fetch data from a given URL with AbortController support.
 * Cancels pending requests when the URL changes or the component unmounts.
 *
 * @param {string|null} url - API endpoint to fetch
 * @returns {{ data: any, loading: boolean, error: string|null }}
 */
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data (status ${response.status})`);
        }

        const result = await response.json();

        setData(result);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch data");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
