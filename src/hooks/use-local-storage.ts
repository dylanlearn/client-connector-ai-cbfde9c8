
import { useCallback } from 'react';

export function useLocalStorage() {
  /**
   * Get an item from localStorage
   */
  const getItem = useCallback((key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  }, []);

  /**
   * Set an item in localStorage
   */
  const setItem = useCallback((key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      return false;
    }
  }, []);

  /**
   * Remove an item from localStorage
   */
  const removeItem = useCallback((key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
      return false;
    }
  }, []);

  /**
   * Clear all items from localStorage
   */
  const clear = useCallback((): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }, []);

  /**
   * Get all items from localStorage
   */
  const getAllItems = useCallback((): Record<string, string> => {
    try {
      return Object.keys(localStorage).reduce((acc, key) => {
        acc[key] = localStorage.getItem(key) || '';
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error('Error getting all items from localStorage:', error);
      return {};
    }
  }, []);

  /**
   * Get all keys from localStorage
   */
  const getAllKeys = useCallback((): string[] => {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting all keys from localStorage:', error);
      return [];
    }
  }, []);

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    getAllItems,
    getAllKeys
  };
}
