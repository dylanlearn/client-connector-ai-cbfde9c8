
// Add the missing function
export const aiWireframeToWireframeData = (aiWireframe: any): any => {
  return {
    id: aiWireframe.id || '',
    title: aiWireframe.title || 'Untitled Wireframe',
    description: aiWireframe.description || '',
    sections: aiWireframe.sections || [],
    colorScheme: aiWireframe.colorScheme || {},
    typography: aiWireframe.typography || {},
    style: aiWireframe.style || '',
    designTokens: aiWireframe.designTokens || {},
  };
};

// Export the necessary types
export interface WireframeGenerationParams {
  projectId?: string;
  description: string;
  stylePreferences?: string[];
  style?: string;
  layoutPreferences?: string[];
  baseWireframe?: any;
  componentPreferences?: string[];
  colorScheme?: Record<string, string>;
  typography?: Record<string, any>;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  saveMemory?: boolean;
  [key: string]: any;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  success: boolean;
  error?: string;
  imageUrl?: string;
  intentData?: any;
  blueprint?: any;
  generationTime?: number;
  model?: string;
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData: any;
  blueprint: any;
  designTokens: Record<string, any>;
  layoutAnalysis?: any;
  variations?: WireframeData[];
}

export interface AIWireframe {
  id: string;
  project_id: string;
  prompt: string;
  description?: string;
  design_tokens?: Record<string, any>;
  mobile_layouts?: any;
  style_variants?: any;
  design_reasoning?: any;
  animations?: any;
  generation_params?: any;
  image_url?: string;
  created_at?: string;
  sections?: WireframeSection[];
}

export interface WireframeComponent {
  id: string;
  type: string;
  content?: string | Record<string, any>;
  style?: Record<string, any>;
  children?: WireframeComponent[];
  props?: Record<string, any>;
  [key: string]: any;
}

export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
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
  style?: string;
  styleToken?: string;
  designTokens?: Record<string, any>;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: any;
  animations?: any;
  imageUrl?: string;
  lastUpdated?: string;
  layoutType?: string;
  metadata?: any;
  error?: string;
}

export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  layoutType?: string;
  dimensions?: {
    width: string | number;
    height: string | number;
  };
  components?: WireframeComponent[];
  copySuggestions?: CopySuggestions | CopySuggestions[];
  animationSuggestions?: any[];
  style?: any;
  order?: number;
  key?: string;
  designReasoning?: string;
  // Additional properties needed based on errors
  data?: any;
  position?: { x: number, y: number };
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  padding?: string;
  gap?: string | number;
  layout?: any;
  mobileLayout?: any;
  dynamicElements?: any;
  styleVariants?: any;
  variant?: string;
  layoutScore?: number;
  optimizationSuggestions?: any[];
  patternMatch?: any;
  positionOrder?: number;
}

export interface CopySuggestions {
  [key: string]: string;
}

export interface DesignMemoryData {
  id: string;
  project_id: string;
  context: string;
  preferences: Record<string, any>;
  previous_designs: any[];
  created_at?: string;
  updated_at?: string;
}

export interface DesignMemoryResponse {
  design_memory: DesignMemoryData;
  success: boolean;
  error?: string;
}

export interface FeedbackModificationResult {
  wireframe: WireframeData;
  success: boolean;
  changes?: any[];
  error?: string;
}

// Base version control interfaces
export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  branch_name: string;
  data: WireframeData;
  parent_version_id?: string;
  is_current: boolean;
  change_description?: string;
  created_at: string;
  created_by?: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  wireframe_id: string;
  created_at: string;
  is_default: boolean;
  description?: string;
  created_by?: string;
}

export interface VersionCreationOptions {
  wireframeId: string;
  data: WireframeData;
  parentVersionId?: string;
  changeDescription?: string;
  createdBy?: string;
  branchName?: string;
  versionNumber?: number;
}
