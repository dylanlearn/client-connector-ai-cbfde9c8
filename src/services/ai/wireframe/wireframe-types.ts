export interface WireframeGenerationParams {
  description?: string;
  pageType?: string;
  style?: string;
  baseWireframe?: any;
  layoutPreferences?: any;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  projectId?: string;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  complexity?: 'simple' | 'moderate' | 'complex';
  industry?: string;
  colorTheme?: string;
  multiPageLayout?: boolean;
  pages?: number;
  componentTypes?: string[];
  moodboardSelections?: any[];
  prompt?: string;
  stylePreferences?: string[];
  enableLayoutIntelligence?: boolean;
  customParams?: {
    darkMode?: boolean;
    targetIndustry?: string;
    targetAudience?: string;
    [key: string]: any;
  };
  dimensions?: { width?: number; height?: number };
  title?: string;
  sections?: string[];
  components?: string[];
  features?: string;
  colorSchemes?: string;
  layoutOptions?: string;
  imageUrl?: string;
  success?: boolean;
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
  layoutAnalysis?: any;
}

export interface WireframeSection {
  id: string;
  name: string;
  description?: string;
  sectionType: string;
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
  styleProperties?: any;
  components?: WireframeComponent[];
  baseStyles?: any;
  responsiveConfig?: {
    tablet?: any;
    mobile?: any;
  };
  layoutType?: string;
  data?: any;
  copySuggestions?: {
    heading?: string;
    subheading?: string;
    cta?: string;
    [key: string]: any;
  } | string[];
  componentVariant?: string;
  layout?: {
    type: string;
    direction?: string;
    alignment?: string;
    [key: string]: any;
  };
  style?: {
    [key: string]: any;
    backgroundColor?: string;
    textAlign?: string;
    padding?: string;
    gap?: string;
  };
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
  dynamicElements?: any[];
  styleVariants?: any;
  layoutScore?: number;
  optimizationSuggestions?: string[];
  patternMatch?: string;
  positionOrder?: number;
}

export interface WireframeComponent {
  id: string;
  type: string;
  content?: any;
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
  styleProperties?: any;
  style?: {
    [key: string]: any;
    color?: string;
    fontSize?: string;
    padding?: string;
  };
}

export interface DesignMemoryResponse {
  id: string;
  projectId: string;
  blueprintId?: string;
  layoutPatterns?: any[];
  stylePreferences?: any;
  componentPreferences?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface DesignMemoryData {
  projectId: string;
  blueprintId?: string;
  layoutPatterns?: any[];
  stylePreferences?: any;
  componentPreferences?: any;
}

export interface WireframeCanvasConfig {
  zoom: number;
  panOffset: { x: number; y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

export interface AIWireframe {
  id: string;
  title?: string;
  description?: string;
  wireframe?: any;
  wireframe_data?: any;
  data?: WireframeData;
  sections?: WireframeSection[];
  project_id?: string;
  createdAt?: string;
  updatedAt?: string;
  updated_at?: string;
  image_url?: string;
  imageUrl?: string;
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
  style?: string | object;
  imageUrl?: string;
  pages?: any[];
  [key: string]: any;
}

export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  paragraphs?: string[];
  [key: string]: any;
}

export interface WireframeVersion {
  id: string;
  wireframeId: string;
  versionNumber: number;
  data: WireframeData;
  createdAt: string;
  createdBy?: string;
  [key: string]: any;
}

export interface BranchInfo {
  id: string;
  name: string;
  [key: string]: any;
}

export interface WireframeResult {
  wireframe: WireframeData;
  [key: string]: any;
}

export type WireframeGeneratorPrompt = WireframeGenerationParams;

export function aiWireframeToWireframeData(wireframe: AIWireframe): WireframeData | null {
  if (!wireframe) return null;
  
  if (wireframe.data) return wireframe.data;
  
  if (wireframe.wireframe_data) return wireframe.wireframe_data;
  
  if (wireframe.wireframe) {
    return {
      id: wireframe.id,
      title: wireframe.title || 'Untitled Wireframe',
      description: wireframe.description || '',
      sections: wireframe.sections || [],
    };
  }
  
  return {
    id: wireframe.id,
    title: wireframe.title || 'Untitled Wireframe',
    description: wireframe.description || '',
    sections: wireframe.sections || [],
  };
}
