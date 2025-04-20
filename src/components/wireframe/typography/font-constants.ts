
/**
 * Common font families for use in typography system
 */

export interface FontFamilyOption {
  name: string;
  value: string;
  category: 'serif' | 'sans-serif' | 'display' | 'monospace';
  description?: string;
}

export const COMMON_FONT_FAMILIES: FontFamilyOption[] = [
  // Sans-serif fonts
  {
    name: 'Inter',
    value: 'Inter',
    category: 'sans-serif',
    description: 'A versatile, highly legible sans-serif font designed for screens'
  },
  {
    name: 'Arial',
    value: 'Arial',
    category: 'sans-serif',
    description: 'A classic sans-serif font available on most systems'
  },
  {
    name: 'Helvetica',
    value: 'Helvetica',
    category: 'sans-serif',
    description: 'A neo-grotesque sans-serif typeface with clean lines'
  },
  {
    name: 'Roboto',
    value: 'Roboto',
    category: 'sans-serif',
    description: 'Google\'s signature font designed for Android'
  },
  {
    name: 'Open Sans',
    value: 'Open Sans',
    category: 'sans-serif',
    description: 'A humanist sans-serif with excellent readability'
  },
  {
    name: 'Montserrat',
    value: 'Montserrat',
    category: 'sans-serif',
    description: 'A geometric sans-serif with modern proportions'
  },
  
  // Serif fonts
  {
    name: 'Georgia',
    value: 'Georgia',
    category: 'serif',
    description: 'A serif typeface designed for screen legibility'
  },
  {
    name: 'Times New Roman',
    value: 'Times New Roman',
    category: 'serif',
    description: 'A traditional serif typeface used in print and web'
  },
  {
    name: 'Merriweather',
    value: 'Merriweather',
    category: 'serif',
    description: 'A serif designed for on-screen reading with large x-height'
  },
  
  // Display fonts
  {
    name: 'Playfair Display',
    value: 'Playfair Display',
    category: 'display',
    description: 'An elegant serif display face with high contrast'
  },
  {
    name: 'Abril Fatface',
    value: 'Abril Fatface',
    category: 'display',
    description: 'A modern display serif with high contrast and ample curves'
  },
  
  // Monospace fonts
  {
    name: 'Consolas',
    value: 'Consolas',
    category: 'monospace',
    description: 'A monospaced font with excellent readability for code'
  },
  {
    name: 'Courier New',
    value: 'Courier New',
    category: 'monospace',
    description: 'A classic monospaced serif typeface'
  },
  {
    name: 'JetBrains Mono',
    value: 'JetBrains Mono',
    category: 'monospace',
    description: 'A typeface for developers with increased height and clear distinctions'
  }
];

/**
 * Common type scales with their ratios
 */
export interface TypeScaleOption {
  name: string;
  ratio: number;
  description?: string;
}

export const TYPE_SCALES: TypeScaleOption[] = [
  { name: 'Minor Second', ratio: 1.067, description: 'Very subtle, barely perceptible scale' },
  { name: 'Major Second', ratio: 1.125, description: 'Conservative, subtle scale' },
  { name: 'Minor Third', ratio: 1.2, description: 'Moderate, readable scale' },
  { name: 'Major Third', ratio: 1.25, description: 'Classic scale, good for most designs' },
  { name: 'Perfect Fourth', ratio: 1.333, description: 'Standard web scale with clear hierarchy' },
  { name: 'Augmented Fourth', ratio: 1.414, description: 'Balanced yet distinct type hierarchy' },
  { name: 'Perfect Fifth', ratio: 1.5, description: 'Bold scale with strong differentiation' },
  { name: 'Golden Ratio', ratio: 1.618, description: 'Harmonious, natural progression' }
];

/**
 * Get scale name from ratio
 */
export function getScaleName(ratio: number): string {
  const scale = TYPE_SCALES.find(s => Math.abs(s.ratio - ratio) < 0.01);
  return scale ? scale.name : `Custom (${ratio})`;
}

/**
 * Parse a font stack string to get the primary font name
 */
export function getPrimaryFontName(fontStack: string): string {
  // Extract first font name from a font stack (e.g. "Inter, sans-serif" -> "Inter")
  const matches = fontStack.match(/^"?([^",]+)"?(?:,|$)/);
  return matches ? matches[1].trim() : fontStack;
}
