
/**
 * Types for wireframe components
 */
export interface WireframeComponent {
  id: string;
  type: string;
  content?: string;
  props?: Record<string, any>;
  children?: WireframeComponent[];
}

/**
 * Types for copy suggestions
 */
export interface CopySuggestions {
  heading?: string[];
  subheading?: string[];
  cta?: string[];
  body?: string[];
}

/**
 * Type for a wireframe section
 */
export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  layoutType?: string;
  layout?: any;
  components?: WireframeComponent[];
  copySuggestions?: CopySuggestions;
  designReasoning?: string;
  mobileLayout?: any;
  animationSuggestions?: any;
  dynamicElements?: any;
  styleVariants?: any;
  positionOrder?: number;
  description?: string;
  componentVariant?: string;
  styleProperties?: Record<string, any>;
}

/**
 * Type for wireframe data
 */
export interface WireframeData {
  title: string;
  description?: string;
  sections: WireframeSection[];
  layoutType?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography?: {
    headings: string;
    body: string;
  };
  designTokens?: Record<string, any>;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: string;
  animations?: any;
  imageUrl?: string;
}

/**
 * Type for AI wireframe database record
 */
export interface AIWireframe {
  id: string;
  project_id?: string;
  prompt: string;
  description?: string;
  design_tokens?: any;
  mobile_layouts?: any;
  style_variants?: any;
  design_reasoning?: string;
  animations?: any;
  generation_params?: any;
  image_url?: string;
  feedback?: string;
  rating?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  sections?: WireframeSection[];
  data?: WireframeData;
}

/**
 * Type for wireframe generation result
 */
export interface WireframeGenerationResult {
  wireframe?: WireframeData;
  model?: string;
}

/**
 * Type for wireframe generation parameters
 */
export interface WireframeGenerationParams {
  projectId?: string;
  prompt?: string;
  description?: string;
  industry?: string;
  pageType?: string;
  stylePreferences?: string[];
  complexity?: 'simple' | 'moderate' | 'complex';
  baseWireframe?: WireframeData;
  creativityLevel?: number;
}
