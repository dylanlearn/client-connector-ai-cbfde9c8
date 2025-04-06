
export interface WireframeData {
  title?: string;
  description?: string;
  sections?: WireframeSection[]; // Make sections optional in this interface
  pages?: WireframePage[];
  styleToken?: string;
  darkMode?: boolean;
  designTokens?: any;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: any;
  animations?: any;
  imageUrl?: string;
  style?: any; // Make style accept any type to handle both string and object
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  layoutType?: string;
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  typography?: {
    headings?: string;
    body?: string;
    fontPairings?: string[];
  };
  [key: string]: any; // Allow any additional properties
}

export interface WireframePage {
  id: string;
  name: string;
  slug?: string;
  pageType: string;
  sections: WireframeSection[];
}

export interface AIWireframe {
  id: string;
  project_id: string;
  title: string;
  description: string;
  wireframe_data: WireframeData;
  data?: WireframeData; // Adding this for backward compatibility
  feedback?: string;
  rating?: number;
  created_at: string;
  generation_params?: WireframeGenerationParams;
  sections?: WireframeSection[];
  latest_version_id?: string;
  current_version_id?: string;
}

export interface WireframeGenerationParams {
  description: string;
  prompt?: string; // Adding this for backward compatibility
  style?: string;
  projectId?: string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  baseWireframe?: WireframeData;
  multiPageLayout?: boolean;
  pages?: number;
  pageTypes?: string[];
  additionalInstructions?: string;
  industry?: string;
  typography?: string;
  complexity?: string;
  colorTheme?: string;
  colorScheme?: { // Adding colorScheme to support the new color selector
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  designTokens?: {  // Adding designTokens property to the interface
    colors?: any;
    typography?: {
      headings?: string;
      body?: string;
      fontPairings?: string[];
    };
    spacing?: any;
    [key: string]: any;
  };
  componentTypes?: string[];
  moodboardSelections?: {
    layoutPreferences?: string[];
    fonts?: string[];
    colors?: string[];
    tone?: string[];
  };
  result_data?: any; // Added this to fix errors
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  generationTime: number;
  creativityLevel?: number;
  usedModels?: string[];
  model?: string; // Adding for backward compatibility
  usage?: any;
  success?: boolean; // Adding success property
}

export interface WireframeSection {
  id?: string;
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
  styleProperties?: any;
}

export interface WireframeComponent {
  type: string;
  id?: string;
  content?: string;
  props?: Record<string, any>;
  children?: WireframeComponent[];
  [key: string]: any;
}

export interface CopySuggestions {
  headlines?: string[];
  descriptions?: string[];
  ctaText?: string[];
  [key: string]: any;
}

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
  sourceData?: WireframeSourceData;
}

export interface WireframeSourceData {
  title?: string;
  description?: string;
  sections?: any[];
  message?: string;
  tags?: string[];
  layout?: string;
  style?: string;
  components?: any[];
  [key: string]: any;
}

export interface BranchInfo {
  name: string;
  versions: WireframeVersion[];
  current_version_id?: string;
  latest_version_id?: string;
  created_at: string;
}

export interface VersionComparisonResult {
  changes: Array<{
    type: "added" | "removed" | "modified";
    path: string;
    values: [any, any];
  }>;
  summary: string;
}
