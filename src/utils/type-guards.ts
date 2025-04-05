
/**
 * Utility function to safely convert an unknown value to a string array
 */
export function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  
  return value.map(item => String(item));
}
