
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
  components?: WireframeComponent[]; // Added for nested components
  style?: Record<string, any>;
  className?: string;
  position?: { x: number; y: number };
  dimensions?: { width: number | string; height: number | string };
  layout?: string | {
    type: string;
    direction?: string;
    columns?: number;
    gap?: number;
    wrap?: boolean;
    alignItems?: string;
    justifyContent?: string;
    [key: string]: any;
  };
  responsive?: {
    mobile?: Partial<Record<string, any>>;
    tablet?: Partial<Record<string, any>>;
    desktop?: Partial<Record<string, any>>;
  };
  // Shorthand positioning and sizing properties for easier access
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  zIndex?: number;
}

// Copy suggestions for textual content
export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  primaryCta?: string;
  secondaryCta?: string;
  supportText?: string;
  supportCta?: string;
  [key: string]: string | undefined;
}

// Section definition
export interface WireframeSection extends BaseElement {
  sectionType: string;
  type?: string; // Alternative for sectionType for backwards compatibility
  backgroundColor?: string;
  components?: WireframeComponent[];
  copySuggestions?: CopySuggestions;
  style?: Record<string, any>;
  // Additional properties
  componentVariant?: string;
  layout?: string | {
    type: string;
    direction?: string;
    columns?: number;
    gap?: number;
    wrap?: boolean;
    alignItems?: string;
    justifyContent?: string;
    [key: string]: any;
  };
  layoutType?: string;
  data?: Record<string, any>;
  dimensions?: { width: number | string; height: number | string };
  position?: { x: number; y: number };
  padding?: string | number;
  gap?: string | number;
  order?: number;
  positionOrder?: number;
  designReasoning?: string;
  mobileLayout?: Record<string, any>;
  animationSuggestions?: Record<string, any>;
  dynamicElements?: Record<string, any>;
  styleVariants?: Record<string, any>;
  stats?: Array<{ id: string; value: string; label: string }>;
  
  // Shorthand positioning and sizing properties for easier access
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  
  // Analysis and optimization fields
  layoutScore?: number;
  optimizationSuggestions?: Record<string, any>;
  patternMatch?: string;
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
    fontPairings?: string[];
  };
  // Additional properties used in the application
  styleToken?: string;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  designTokens?: Record<string, any>;
  mobileLayouts?: Record<string, any>;
  styleVariants?: Record<string, any>;
  designReasoning?: Record<string, any>;
  animations?: Record<string, any>;
  imageUrl?: string;
  metadata?: Record<string, any>;
  layoutType?: string;
}

// Parameters for wireframe generation
export interface WireframeGenerationParams {
  description?: string;
  industry?: string;
  style?: string | Record<string, any>;
  optimizeForDevices?: boolean;
  generatePreview?: boolean;
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  // Additional parameters used in the application
  projectId?: string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  designRequirements?: string;
  baseWireframe?: WireframeData;
  stylePreferences?: string | Record<string, any>;
  styleToken?: string;
  feedbackMode?: boolean;
  isVariation?: boolean;
  customParams?: Record<string, any>;
}

// Result of wireframe generation
export interface WireframeGenerationResult {
  wireframe: WireframeData;
  success: boolean;
  generationTime?: number;
  model?: string;
  imageUrl?: string;
  error?: string;
  intentData?: Record<string, any>;
  blueprint?: Record<string, any>;
}

// Enhanced wireframe generation result
export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  enhancedData?: Record<string, any>;
  optimizationScore?: number;
  designTokens?: Record<string, any>;
}

// Database representation of a wireframe, may include additional fields
export interface AIWireframe {
  id: string;
  project_id: string;
  title?: string;
  description?: string;
  sections?: WireframeSection[];
  data?: WireframeData;
  wireframe_data?: WireframeData; // Legacy field
  generation_params?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  version_count?: number;
  current_version_id?: string;
  image_url?: string;
  design_tokens?: Record<string, any>;
}
