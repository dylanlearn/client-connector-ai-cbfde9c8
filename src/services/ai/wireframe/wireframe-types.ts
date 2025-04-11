
/**
 * Type definitions for wireframe components and sections
 */

// Basic shared properties for components and sections
export interface BaseElement {
  id: string;
  name?: string;
  description?: string;
}

// Component definition
export interface WireframeComponent extends BaseElement {
  type: string;
  content?: string;
  src?: string;
  alt?: string;
  props?: Record<string, any>;
  children?: WireframeComponent[];
  style?: Record<string, any>;
  className?: string;
  responsive?: {
    mobile?: Partial<Record<string, any>>;
    tablet?: Partial<Record<string, any>>;
    desktop?: Partial<Record<string, any>>;
  };
}

// Section definition
export interface WireframeSection extends BaseElement {
  sectionType: string;
  backgroundColor?: string;
  components?: WireframeComponent[];
  copySuggestions?: Record<string, string>;
  style?: Record<string, any>;
}

// Complete wireframe data structure
export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  style?: Record<string, any>;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headings: string;
    body: string;
  };
}

// Parameters for wireframe generation
export interface WireframeGenerationParams {
  description?: string;
  industry?: string;
  style?: string;
  optimizeForDevices?: boolean;
  generatePreview?: boolean;
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
}

// Result of wireframe generation
export interface WireframeGenerationResult {
  wireframe: WireframeData;
  success: boolean;
  generationTime?: number;
  model?: string;
  imageUrl?: string;
  error?: string;
}
