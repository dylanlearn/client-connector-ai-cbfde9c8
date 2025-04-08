
/**
 * Interface for an AI-generated wireframe
 */
export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  project_id?: string;
  projectId?: string;
  data?: any;
  created_at?: string;
  generation_params?: {
    model?: string;
    prompt?: string;
    stylePreferences?: string[];
    complexity?: string;
  };
  styleToken?: string;
  wireframe_data?: WireframeData; 
  prompt?: string;
  imageUrl?: string;
}

/**
 * Interface for wireframe section data
 */
export interface WireframeSection {
  id: string;
  sectionType: string;
  name: string;
  description?: string;
  components?: any[];
  items?: any[];
  imageUrl?: string;
  layout?: string | { type: string; alignment: string };
  order?: number;
  layoutType?: string;
  copySuggestions?: {
    heading?: string | any;
    subheading?: string | any;
    cta?: string | any;
    body?: string | any;
  };
  animationSuggestions?: {
    type?: string | any;
    element?: string | any;
    timing?: string | any;
    effect?: string[] | string;
  };
  mobileLayout?: {
    structure?: string | any;
    stackOrder?: string[];
  };
  designReasoning?: string;
  componentVariant?: string;
  data?: any;
  dynamicElements?: any;
  styleVariants?: any;
}

/**
 * Interface for wireframe data structure
 */
export interface WireframeData {
  id?: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  styleToken?: string;
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
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  style?: string | object;
  pages?: any[];
  darkMode?: boolean;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: any;
  animations?: any;
  imageUrl?: string;
}

/**
 * Interface for wireframe generation parameters
 */
export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  style?: string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  darkMode?: boolean;
  baseWireframe?: any;
  prompt?: string;
  stylePreferences?: string[];
  complexity?: 'simple' | 'moderate' | 'complex';
  customParams?: Record<string, any>;
}

/**
 * Interface for wireframe generation result
 */
export interface WireframeGenerationResult {
  wireframe: WireframeData;
  insights?: any;
  components?: any[];
  generationMetadata?: {
    generationTime: number;
    promptTokens: number;
    completionTokens: number;
    model: string;
  };
}

/**
 * Interface for wireframe component
 */
export interface WireframeComponent {
  id: string;
  type: string;
  content?: string;
  description?: string;
  position?: string;
  style?: string | Record<string, any>;
  children?: WireframeComponent[];
  properties?: Record<string, any>;
}

/**
 * Interface for copy suggestions
 */
export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  body?: string;
  bullets?: string[];
}

/**
 * Interface for wireframe version
 */
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
  sourceData?: any;
}

/**
 * Interface for branch info
 */
export interface BranchInfo {
  name: string;
  current_version_id?: string;
  latest_version_id?: string;
  versions: WireframeVersion[];
}

/**
 * Interface for version comparison result
 */
export interface VersionComparisonResult {
  changes: Array<{
    type: "added" | "removed" | "modified";
    path: string;
    values: [any, any];
  }>;
  summary: string;
}
