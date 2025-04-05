
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Utility function to combine class names using clsx and tailwind-merge
 * 
 * @param inputs - Class names to combine
 * @returns Combined class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a human-readable format
 * 
 * @param dateString - ISO date string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = {}) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Creates gradient text class based on gradient type
 * 
 * @param gradientType - 'primary' or 'secondary'  
 * @returns Tailwind CSS class string for gradient text
 */
export function gradientText(gradientType: 'primary' | 'secondary' = 'primary') {
  return gradientType === 'primary' 
    ? 'bg-gradient-primary bg-clip-text text-transparent'
    : 'bg-gradient-secondary bg-clip-text text-transparent';
}

/**
 * Creates gradient background class based on gradient type
 * 
 * @param gradientType - 'primary' or 'secondary'
 * @returns Tailwind CSS class string for gradient background
 */
export function gradientBg(gradientType: 'primary' | 'secondary' = 'primary') {
  return gradientType === 'primary' ? 'bg-gradient-primary' : 'bg-gradient-secondary';
}

/**
 * Truncates text to a maximum length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length of the text
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number) {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}
