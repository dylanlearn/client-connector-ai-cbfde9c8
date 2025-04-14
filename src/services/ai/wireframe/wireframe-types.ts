
import { CopySuggestions } from "@/components/wireframe/renderers/utilities";

/**
 * Interface for wireframe component
 */
export interface WireframeComponent {
  id: string;
  type: string;
  name?: string;
  content?: string | any;
  children?: WireframeComponent[];
  style?: Record<string, any>;
  props?: Record<string, any>;
  layout?: any;
  position?: { x: number; y: number };
  dimensions?: { width: number | string; height: number | string };
  states?: Record<string, any>;
  events?: Record<string, any>;
  variants?: string[];
  responsive?: any;
  className?: string;
  src?: string;
  alt?: string;
  components?: WireframeComponent[];
}

/**
 * Interface for animation suggestions
 */
export interface AnimationSuggestion {
  type: string;
  element: string;
  description: string;
  timingFunction?: string;
  duration?: number;
  delay?: number;
  iterations?: number;
  direction?: string;
  keyframes?: Record<string, any>[];
  code?: string;
}

/**
 * Interface for wireframe section
 */
export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  position?: { x: number; y: number };
  x?: number;
  y?: number;
  dimensions?: { width: number | string; height: number | string };
  width?: number | string;
  height?: number | string;
  components?: WireframeComponent[];
  layout?: any;
  layoutType?: string;
  style?: Record<string, any>;
  data?: Record<string, any>;
  gap?: number | string;
  copySuggestions?: CopySuggestions | CopySuggestions[];
  padding?: string;
  backgroundColor?: string;
  textAlign?: string;
  componentVariant?: string;
  animationSuggestions?: AnimationSuggestion[];
  mobileLayout?: {
    stack?: boolean;
    hideOnMobile?: boolean;
    alternatePlacement?: string;
    responsiveColumns?: number;
  };
  designReasoning?: string;
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
  dynamicElements?: Record<string, any>;
  styleVariants?: Record<string, any>;
  type?: string; // For backward compatibility
  layoutScore?: number;
  optimizationSuggestions?: any[];
  patternMatch?: string;
  positionOrder?: number;
}

/**
 * Interface for wireframe data
 */
export interface WireframeData {
  id: string;
  title: string;
  description: string;
  sections: WireframeSection[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  typography: {
    headings: string;
    body: string;
    [key: string]: string;
  };
  style?: Record<string, any> | string;
  designTokens?: Record<string, any>;
  mobileLayouts?: Record<string, any>;
  styleVariants?: Record<string, any>;
  designReasoning?: string;
  animations?: Record<string, any>;
  imageUrl?: string;
  styleToken?: string;
  darkMode?: boolean;
  metadata?: Record<string, any>;
  mobileConsiderations?: string;
  projectId?: string; // Added for API compatibility
  lastUpdated?: string; // Added to track last update time
}

// Re-export CopySuggestions interface to ensure it's available
export type { CopySuggestions };

/**
 * Interface for AI-generated wireframe
 */
export interface AIWireframe extends WireframeData {
  createdAt?: string;
  updatedAt?: string;
  variationOf?: string;
  projectId?: string;
  userId?: string;
  promptId?: string;
  originalPrompt?: string;
  feedbackSummary?: string;
  score?: number;
  data?: Record<string, any>;
  wireframe_data?: WireframeData;
}

/**
 * Parameters for wireframe generation
 */
export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  creativityLevel?: number;
  style?: string | Record<string, any>;
  industry?: string;
  targetAudience?: string;
  colorPreferences?: string | string[];
  sections?: string[];
  previousWireframeId?: string;
  templateId?: string;
  baseWireframe?: WireframeData;
  isVariation?: boolean;
  enhancedCreativity?: boolean;
  feedbackMode?: boolean;
  intakeData?: any;
  styleChanges?: string;
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    [key: string]: string | undefined;
  };
  [key: string]: any;
}

/**
 * Result of wireframe generation
 */
export interface WireframeGenerationResult {
  wireframe: WireframeData | null;
  success: boolean;
  message: string;
  errors?: string[];
  warnings?: string[];
  // Added intentData and blueprint as they're being used in useWireframe
  intentData?: any;
  blueprint?: any;
  error?: Error; // For backward compatibility
}

/**
 * Enhanced result of wireframe generation with additional data
 */
export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData: Record<string, any>;
  blueprint: Record<string, any>;
  designTokens: Record<string, any>;
}

/**
 * Type guard to check if an object is a valid WireframeData
 */
export function isWireframeData(obj: any): obj is WireframeData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.sections) &&
    typeof obj.colorScheme === 'object' &&
    typeof obj.typography === 'object'
  );
}

/**
 * Type guard to check if an object is a valid WireframeSection
 */
export function isWireframeSection(obj: any): obj is WireframeSection {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.sectionType === 'string'
  );
}

/**
 * Type guard to check if an object is a valid WireframeComponent
 */
export function isWireframeComponent(obj: any): obj is WireframeComponent {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.type === 'string'
  );
}

/**
 * Convert WireframeGenerationParams to a consistent format for API calls
 */
export function normalizeWireframeGenerationParams(params: WireframeGenerationParams): WireframeGenerationParams {
  // Create a normalized copy of params
  const normalized: WireframeGenerationParams = {
    description: params.description || '',
    projectId: params.projectId || '',
    creativityLevel: params.creativityLevel || 5,
    style: params.style || '',
    industry: params.industry || '',
    targetAudience: params.targetAudience || '',
    colorPreferences: params.colorPreferences || [],
    sections: params.sections || [],
    isVariation: !!params.isVariation,
    enhancedCreativity: !!params.enhancedCreativity,
    feedbackMode: !!params.feedbackMode,
    intakeData: params.intakeData || null,
    styleChanges: params.styleChanges || '',
  };
  
  // Handle baseWireframe specially to avoid deep copying
  if (params.baseWireframe) {
    normalized.baseWireframe = params.baseWireframe;
  }
  
  // Handle colorScheme specially to avoid losing undefined values
  if (params.colorScheme) {
    normalized.colorScheme = { ...params.colorScheme };
  }
  
  return normalized;
}

/**
 * Create a base wireframe structure with required fields
 */
export function createBaseWireframe(title: string = 'New Wireframe'): WireframeData {
  return {
    id: uuidv4(),
    title: title,
    description: '',
    sections: [],
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    },
    typography: {
      headings: 'sans-serif',
      body: 'sans-serif'
    }
  };
}

// Add missing uuidv4 import
import { v4 as uuidv4 } from 'uuid';
