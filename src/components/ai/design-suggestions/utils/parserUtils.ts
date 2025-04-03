
/**
 * Utility function to normalize and clean input text
 */
export const normalizeText = (text: string): string => {
  if (!text) return "";
  return text.trim().replace(/\s+/g, ' ');
};
