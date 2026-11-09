import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a changing value by a specified delay.
 * Useful for delaying expensive operations like API search requests until typing stops.
 *
 * @param {*} value - The input value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default 500ms)
 * @returns {*} debouncedValue
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
