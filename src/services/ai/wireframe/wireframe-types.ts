
export interface WireframeGenerationParams {
  description?: string;
  prompt?: string;
  projectId?: string;
  baseWireframe?: any;
  style?: string;
  colorTheme?: string;
  pageType?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  industry?: string;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  intakeFormData?: any;
  variationOf?: string;
  variationType?: string;
  stylePreferences?: any;
  enableLayoutIntelligence?: boolean;
  customParams?: Record<string, any>;
  
  // Additional props required by multiple files
  complexity?: number;
  multiPageLayout?: boolean;
  pages?: any[];
  componentTypes?: string[];
  moodboardSelections?: any;
}

export interface WireframeGenerationResult {
  wireframe: any;
  generationTime?: number;
  model?: string;
  usage?: {
    total_tokens?: number;
    completion_tokens?: number;
    prompt_tokens?: number;
  };
  success: boolean;
  error?: string;
  imageUrl?: string;
  layoutAnalysis?: any; // Added this property
  variations?: any[]; // Added this property
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData?: any;
  blueprint?: any;
  layoutAnalysis?: any;
  variations?: any[];
}

export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  [key: string]: any;
}

export interface FeedbackInterpretation {
  changes: Record<string, any>;
  summary: string;
  impact: string;
}

export interface FeedbackModificationResult {
  wireframe: any;
  modified: boolean;
  changeDescription?: string;
  modifiedSections?: string[];
  addedSections?: string[];
  removedSections?: string[];
}

export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  [key: string]: any;
}

// Added WireframeSection interface
export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  components?: WireframeComponent[];
  layout?: {
    type: string;
    direction?: string;
    alignment?: string;
    [key: string]: any;
  } | string;
  layoutType?: string;
  positionOrder?: number;
  componentVariant?: string;
  copySuggestions?: CopySuggestions;
  dimensions?: {
    width: number;
    height: number;
  };
  position?: {
    x: number;
    y: number;
  };
  backgroundColor?: string;
  textAlign?: string;
  padding?: string;
  gap?: string;
  style?: {
    [key: string]: any;
    backgroundColor?: string;
    textAlign?: string;
    padding?: string;
    gap?: string;
  };
  data?: any;
  designReasoning?: string;
  mobileLayout?: any;
  animationSuggestions?: any;
  dynamicElements?: any;
  styleVariants?: any;
  [key: string]: any;
}

// Added WireframeComponent interface
export interface WireframeComponent {
  id: string;
  type: string;
  content?: string;
  props?: Record<string, any>;
  children?: WireframeComponent[];
  style?: Record<string, any>;
  [key: string]: any;
}

// Added CopySuggestions interface
export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  body?: string;
  cta?: string;
  [key: string]: any;
}

// Added WireframeCanvasConfig interface
export interface WireframeCanvasConfig {
  width: number;
  height: number;
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  backgroundColor?: string;
  zoom?: number;
  [key: string]: any;
}

// Added DesignMemoryData interface
export interface DesignMemoryData {
  colorPalettes?: any[];
  fontPairings?: any[];
  layoutPatterns?: any[];
  componentStyles?: Record<string, any>;
  userPreferences?: Record<string, any>;
  [key: string]: any;
}

// Added DesignMemoryResponse interface
export interface DesignMemoryResponse {
  id: string;
  projectId: string;
  data: DesignMemoryData;
  createdAt: string;
  updatedAt: string;
}

// Added WireframeVersion interface
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
  version?: string;
}

// Added BranchInfo interface
export interface BranchInfo {
  name: string;
  description?: string;
  createdAt: string;
  lastUpdated: string;
  versionCount: number;
  latestVersionId: string;
  createdBy?: string;
}

// Added WireframeResult interface for backward compatibility
export interface WireframeResult extends WireframeGenerationResult {
  // This ensures WireframeResult has at least the same properties as WireframeGenerationResult
}

// Helper function to convert AIWireframe to WireframeData
export function aiWireframeToWireframeData(wireframe: AIWireframe): WireframeData {
  return {
    id: wireframe.id,
    title: wireframe.title,
    description: wireframe.description,
    sections: wireframe.sections || [],
    ...(wireframe.wireframe_data || wireframe.data || {})
  };
}
