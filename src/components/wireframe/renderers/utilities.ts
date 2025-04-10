import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Gets a suggested text from copySuggestions, or returns a default if not found
 */
export function getSuggestion(
  copySuggestions: Record<string, string> | undefined,
  key: string,
  defaultValue: string
): string {
  if (!copySuggestions) return defaultValue;
  return copySuggestions[key] || defaultValue;
}

/**
 * Creates a valid style object from section style property which can be string or object
 */
export function createStyleObject(
  style: string | Record<string, any> | undefined
): React.CSSProperties {
  if (!style) return {};
  
  if (typeof style === 'string') {
    // Try to parse it as JSON
    try {
      return JSON.parse(style);
    } catch (e) {
      // If it's not valid JSON, return empty object
      return {};
    }
  }
  
  return style;
}

/**
 * Gets the appropriate background color for a section based on its type and dark mode
 */
export function getSectionBackground(
  section: WireframeSection,
  darkMode: boolean
): string {
  // Use section background color if it exists
  if (section.backgroundColor) {
    return section.backgroundColor;
  }
  
  // If section has a specific style.backgroundColor, use that
  if (section.style && typeof section.style === 'object' && section.style.backgroundColor) {
    return section.style.backgroundColor;
  }
  
  // Otherwise return default based on section type and dark mode
  switch (section.sectionType) {
    case 'hero':
      return darkMode ? '#1F2937' : '#F9FAFB';
    case 'features':
      return darkMode ? '#111827' : '#FFFFFF';
    case 'pricing':
      return darkMode ? '#1F2937' : '#F9FAFB';
    case 'testimonials':
      return darkMode ? '#111827' : '#FFFFFF';
    case 'cta':
      return darkMode ? '#2563EB' : '#3B82F6';
    case 'footer':
      return darkMode ? '#111827' : '#F3F4F6';
    default:
      return darkMode ? '#1F2937' : '#FFFFFF';
  }
}

/**
 * Gets the appropriate text color based on background color
 */
export function getTextColor(backgroundColor: string): string {
  // Convert to hex if not
  let hexColor = backgroundColor;
  
  if (hexColor.startsWith('rgb')) {
    // Extract RGB values
    const rgbMatch = backgroundColor.match(/\d+/g);
    if (rgbMatch && rgbMatch.length >= 3) {
      const [r, g, b] = rgbMatch.map(Number);
      hexColor = rgbToHex(r, g, b);
    }
  }
  
  // Get brightness of background color
  const brightness = getColorBrightness(hexColor);
  
  // Return appropriate text color
  return brightness > 128 ? '#111827' : '#FFFFFF';
}

/**
 * Converts RGB values to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Calculates the brightness of a color (0-255)
 */
function getColorBrightness(hexColor: string): number {
  // Remove # if present
  hexColor = hexColor.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hexColor.substr(0, 2), 16) || 0;
  const g = parseInt(hexColor.substr(2, 2), 16) || 0;
  const b = parseInt(hexColor.substr(4, 2), 16) || 0;
  
  // Calculate brightness
  return (r * 299 + g * 587 + b * 114) / 1000;
}
