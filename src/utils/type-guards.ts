
/**
 * Type guard utility functions to ensure data is of the correct type
 */

/**
 * Ensures an array of unknown items is cast to an array of strings
 * Filters out any non-string values
 */
export function toStringArray(arr: unknown[]): string[] {
  return arr.filter(item => typeof item === 'string') as string[];
}
