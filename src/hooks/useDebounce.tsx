import { useEffect, useState } from "react";

/**
 * Custom React hook that debounces a changing value.
 * Useful for delaying actions like API calls until the user stops typing.
 *
 * @template T - The type of the value being debounced.
 * @param {T} value - The input value to debounce.
 * @param {number} delay - Delay in milliseconds to wait before updating the debounced value.
 * @returns {T} - The latest debounced value.
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
