import { useState, useEffect, Dispatch, SetStateAction } from "react";

const isBrowser = typeof window !== "undefined";

type UseLocalStorageResult<T> = [
  storedValue: T,
  setStoredValue: Dispatch<SetStateAction<T>>,
  remove: () => void,
];

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): UseLocalStorageResult<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: failed to read key "${key}"`, error);

      return initialValue;
    }
  });

  const remove = () => {
    if (!isBrowser) return;

    try {
      window.localStorage.removeItem(key);

      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`useLocalStorage: failed to delete key "${key}"`, error);
    }
  };

  useEffect(() => {
    if (!isBrowser) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`useLocalStorage: failed to write key "${key}"`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue, remove];
};

export default useLocalStorage;
