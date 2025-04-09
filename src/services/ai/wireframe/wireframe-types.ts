
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  style?: string | object;
  pageType?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  baseWireframe?: any;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  stylePreferences?: any;
  customParams?: Record<string, any>;
  enableLayoutIntelligence?: boolean;
  industry?: string;
  intakeFormData?: any;
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
  error?: string;
  success: boolean;
  imageUrl?: string;
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData?: any;
  blueprint?: any;
  layoutAnalysis?: any;
  variations?: any[];
}

export interface FeedbackModificationResult {
  wireframe: any;
  modified: boolean;
  changeDescription: string;
  modifiedSections?: string[];
  addedSections?: string[];
  removedSections?: string[];
}

// Use export type for re-exporting a type when isolatedModules is enabled
export type { WireframeCanvasConfig };

// Define the AIWireframe interface
export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  [key: string]: any;
}

// Add missing types that are being imported elsewhere
export interface WireframeData {
  id: string; 
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
  imageUrl?: string;
  [key: string]: any;
}

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
    justifyContent?: string;
    columns?: number;
    gap?: number;
    wrap?: boolean;
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
  // Additional styling properties
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
  data?: Record<string, any>;
  animationSuggestions?: {
    type?: string;
    element?: string;
    timing?: string;
    effect?: string[];
  };
  mobileLayout?: {
    structure?: string;
    stackOrder?: string[];
  };
  designReasoning?: string;
  [key: string]: any;
}

export interface WireframeComponent {
  id: string;
  type: string;
  content?: string;
  style?: Record<string, any>;
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
  [key: string]: any;
}

export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  body?: string;
  [key: string]: any;
}

export interface WireframeResult {
  wireframe: WireframeData;
  generationTime?: number;
  model?: string;
  usage?: any;
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
}

export interface BranchInfo {
  name: string;
  current_version_id?: string;
  versions: string[];
}

export interface DesignMemoryData {
  projectId: string;
  designs: any[];
  preferences: Record<string, any>;
  insights: Record<string, any>;
}

export interface DesignMemoryResponse {
  memory: DesignMemoryData;
  recommendations: any[];
  success: boolean;
}

// Helper function to convert AIWireframe to WireframeData
export const aiWireframeToWireframeData = (wireframe: AIWireframe): WireframeData => {
  return {
    id: wireframe.id,
    title: wireframe.title,
    description: wireframe.description || '',
    sections: wireframe.sections || [],
    // Map any other properties as needed
    ...wireframe
  };
};
