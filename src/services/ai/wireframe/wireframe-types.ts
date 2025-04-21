
/**
 * Basic types for wireframe data structures
 */

export interface WireframeSection {
  id: string;
  name?: string;
  sectionType: string;
  components?: any[];
  layout?: any;
  [key: string]: any;
}

export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  colorScheme?: WireframeColorScheme;
  typography?: WireframeTypography;
  [key: string]: any;
}

export interface WireframeGenerationParams {
  projectId?: string;
  description?: string;
  colorScheme?: WireframeColorScheme;
  typography?: WireframeTypography;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  intakeData?: any;
  [key: string]: any;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData | null;
  success: boolean;
  message?: string;
  errors?: string[];
  intentData?: any;
  blueprint?: any;
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData?: any;
  blueprint?: any;
}

export interface WireframeComponent {
  id: string;
  type: string;
  props?: Record<string, any>;
  [key: string]: any;
}

// Add missing types that are referenced in error messages

/**
 * Color scheme for wireframes
 */
export interface WireframeColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string; // Changed from optional to required to match ColorScheme
  [key: string]: any;
}

/**
 * Typography settings for wireframes
 */
export interface WireframeTypography {
  headings: string;
  body: string;
  [key: string]: any;
}

/**
 * Legacy AIWireframe type for backward compatibility
 */
export interface AIWireframe extends WireframeData {
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Copy suggestions for wireframes
 */
export interface CopySuggestions {
  id: string;
  sectionId?: string;
  text: string;
  type: string;
  confidence: number;
  [key: string]: any;
}

/**
 * Utility function to check if an object is a valid WireframeData
 */
export function isWireframeData(obj: any): obj is WireframeData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.sections)
  );
}

/**
 * Normalize wireframe generation parameters
 */
export function normalizeWireframeGenerationParams(params: WireframeGenerationParams): WireframeGenerationParams {
  return {
    ...params,
    projectId: params.projectId || undefined,
    description: params.description || '',
    colorScheme: params.colorScheme || {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: params.typography || {
      headings: 'Inter',
      body: 'Inter'
    },
    creativityLevel: params.creativityLevel || 5
  };
}
