
/**
 * Type definitions for wireframe components and sections
 */

export interface WireframeSection {
  id: string;
  name: string;
  description?: string;
  sectionType: string;
  componentVariant?: string;
  order?: number;
  data?: Record<string, any>;
  styleProperties?: Record<string, any>;
  
  // Additional properties needed for components
  layoutType?: string;
  layout?: {
    type?: string;
    alignment?: string;
    [key: string]: any;
  };
  components?: WireframeComponent[];
  copySuggestions?: CopySuggestions;
  designReasoning?: string;
  mobileLayout?: {
    structure?: string;
    stackOrder?: string[];
    [key: string]: any;
  };
  animationSuggestions?: {
    type?: string;
    element?: string;
    timing?: string;
    effect?: string[];
    [key: string]: any;
  };
  dynamicElements?: any;
  styleVariants?: any;
  positionOrder?: number;
}

export interface WireframeComponent {
  id: string;
  type: string;
  content?: string;
  style?: string;
  position?: string;
  [key: string]: any;
}

export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  [key: string]: any;
}

export interface WireframeData {
  id?: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  imageUrl?: string;
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
  styleToken?: string;
  darkMode?: boolean;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: any;
  animations?: any;
  version?: string;
  [key: string]: any;
}

export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  imageUrl?: string;
  createdAt?: string;
  lastModified?: string;
  isComplex?: boolean;
  hasMultiplePages?: boolean;
  pages?: WireframePage[];
  
  // Additional properties
  projectId?: string;
  project_id?: string;
  data?: any;
  wireframe_data?: any;
  created_at?: string;
  updated_at?: string;
}

export interface WireframePage {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  sections: WireframeSection[];
  order?: number;
}

export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  style?: string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  multiPageLayout?: boolean;
  pages?: number;
  complexity?: 'simple' | 'moderate' | 'complex';
  baseWireframe?: any;
  includeDesignTokens?: boolean;
  includeMobileLayouts?: boolean;
  
  // Additional properties needed
  industry?: string;
  colorTheme?: string;
  pageType?: string;
  componentTypes?: string[] | any;
  moodboardSelections?: string[] | any;
  prompt?: string;
  title?: string;
  darkMode?: boolean;
}

export interface WireframeGenerationResult {
  wireframe: any;
  prompt?: string;
  enhancedPrompt?: string;
  error?: string;
  tokens?: number;
  rawResponse?: any;
  
  // Additional properties
  success?: boolean;
  generationTime?: number;
  usedModels?: string[];
  model?: string;
  usage?: {
    total_tokens?: number;
    completion_tokens?: number;
    prompt_tokens?: number;
  };
  creativityLevel?: number;
}

// Additional interfaces for version control 
export interface WireframeVersion {
  id: string;
  wireframeId: string;
  versionNumber: number;
  data: any;
  createdAt: string;
  createdBy?: string;
  description?: string;
}

export interface VersionComparisonResult {
  differences: any[];
  summary: string;
}

export interface BranchInfo {
  name: string;
  versions: WireframeVersion[];
  latestVersion?: WireframeVersion;
}
