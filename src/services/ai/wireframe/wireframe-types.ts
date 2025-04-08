
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
  heading?: string | string[];
  subheading?: string | string[];
  cta?: string | string[];
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
  prompt?: string;
  generation_params?: any; // Added this property to fix the type error
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
  stylePreferences?: string[];
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
  wireframe_id: string;
  version_number: number;
  branch_name: string;
  data: any;
  parent_version_id?: string;
  is_current: boolean;
  change_description?: string;
  created_at: string;
  created_by?: string;
  sourceData?: any;
}

export interface VersionComparisonResult {
  differences: any[];
  summary: string;
  changes?: any[];
}

export interface BranchInfo {
  name: string;
  versions: WireframeVersion[];
  latestVersion?: WireframeVersion;
  latest_version_id?: string;
}
