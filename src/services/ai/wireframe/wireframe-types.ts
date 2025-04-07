
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
  heading?: string | string[];
  subheading?: string | string[];
  cta?: string | string[];
  body?: string | string[];
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
    text?: string;
  };
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
  };
  designTokens?: Record<string, any>;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: string;
  animations?: any;
  imageUrl?: string;
  pages?: any[];
  style?: string | object;
  colorTheme?: string;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
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
  wireframe_data?: WireframeData; // Legacy support
  title?: string;
  pages?: any[];
}

/**
 * Type for wireframe generation result
 */
export interface WireframeGenerationResult {
  wireframe?: WireframeData;
  model?: string;
  usage?: {
    total_tokens: number;
    completion_tokens: number;
    prompt_tokens: number;
  };
  generationTime?: number;
  usedModels?: string[];
  success?: boolean;
  creativityLevel?: number;
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
  // Extended properties
  style?: string;
  enhancedCreativity?: boolean;
  colorTheme?: string;
  darkMode?: boolean;
  multiPageLayout?: boolean;
  pages?: number;
  pageTypes?: string[];
  typography?: any;
  componentTypes?: string[];
  moodboardSelections?: any;
  additionalInstructions?: string;
  title?: string;
  timestamp?: string;
}

// Additional types needed for version control
export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  branch_name: string;
  data: Record<string, any>;
  parent_version_id?: string;
  is_current: boolean;
  change_description?: string;
  created_at: string;
  created_by?: string;
}

export interface BranchInfo {
  name: string;
  versions: WireframeVersion[];
  latest_version_id?: string;
}

export interface VersionComparisonResult {
  changes: Array<{
    type: "added" | "removed" | "modified";
    path: string;
    values: [any, any];
  }>;
  summary: string;
}
