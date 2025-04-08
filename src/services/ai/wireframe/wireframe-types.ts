import { v4 as uuidv4 } from 'uuid';

// Component within a wireframe section
export interface WireframeComponent {
  id: string;
  type: string;
  content?: any;
  style?: string | object;
  position?: string;
  [key: string]: any;
}

// Suggestions for copy/content
export interface CopySuggestions {
  heading?: string | string[];
  subheading?: string | string[];
  body?: string | string[];
  cta?: string | string[];
  [key: string]: any;
}

// Animation suggestions for a section
export interface AnimationSuggestions {
  type?: string;
  element?: string;
  timing?: string;
  effect?: string | string[];
  [key: string]: any;
}

// Mobile layout configuration
export interface MobileLayout {
  structure?: string;
  stackOrder?: string[];
  [key: string]: any;
}

export interface WireframeSection {
  id: string;
  name: string;
  type?: string;
  sectionType?: string;
  content?: any;
  description?: string;
  config?: any;
  isHidden?: boolean;
  
  // Additional properties used across the codebase
  layout?: string | { type: string; alignment?: string; [key: string]: any };
  layoutType?: string;
  components?: WireframeComponent[];
  copySuggestions?: CopySuggestions;
  designReasoning?: string;
  mobileLayout?: MobileLayout;
  animationSuggestions?: AnimationSuggestions;
  dynamicElements?: any;
  styleVariants?: any;
  positionOrder?: number;
  data?: any; // For section-specific data
  componentVariant?: string; // For component variants
  order?: number; // For ordering sections
}

export interface WireframeData {
  id?: string; // Optional since it might be a new wireframe
  title?: string;
  description?: string;
  sections?: WireframeSection[];
  imageUrl?: string;
  designTokens?: any;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: string;
  animations?: any;
  lastUpdated?: string; // Adding lastUpdated property
  layoutType?: string; // Used in several components
  style?: string | object; // Used for styling
  pages?: any[]; // For multi-page wireframes
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
}

export interface AIWireframe {
  id: string; // Required for existing wireframes
  title?: string;
  description?: string;
  project_id?: string;
  projectId?: string;
  prompt?: string;
  sections?: WireframeSection[];
  data?: any;
  created_at?: string;
  updated_at?: string; // Adding updated_at property
  generation_params?: any;
  design_tokens?: any;
  mobile_layouts?: any;
  style_variants?: any;
  design_reasoning?: string;
  animations?: any;
  image_url?: string;
  wireframe_data?: WireframeData; // Added to fix references
}

export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  prompt?: string;
  pageType?: string;
  style?: string;
  stylePreferences?: string[];
  complexity?: 'simple' | 'moderate' | 'complex';
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  darkMode?: boolean;
  multiPageLayout?: boolean;
  pages?: number;
  baseWireframe?: any;
  
  // Additional properties used in the codebase
  industry?: string;
  colorTheme?: string;
  componentTypes?: string[];
  moodboardSelections?: any;
  customParams?: any;
}

export interface WireframeGenerationResult {
  wireframe?: WireframeData;
  imageUrl?: string;
  error?: string;
  
  // Additional properties used in the codebase
  success?: boolean;
  generationTime?: number;
  model?: string;
}

// Add version control related interfaces
export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  branch_name: string;
  parent_version_id?: string;
  is_current: boolean;
  change_description?: string;
  created_at: string;
  created_by?: string;
  data?: any;
}

export interface BranchInfo {
  name: string;
  versions: WireframeVersion[];
  latest_version_id?: string;
  latestVersion?: WireframeVersion;
}

export interface VersionComparisonResult {
  additions: any[];
  deletions: any[];
  modifications: any[];
  summary: string;
}

// Helper function to convert WireframeData to AIWireframe format
export function wireframeDataToAIWireframe(data: WireframeData, projectId?: string): AIWireframe {
  return {
    id: data.id || uuidv4(),
    title: data.title || "Untitled Wireframe",
    description: data.description || "",
    project_id: projectId,
    projectId: projectId,
    sections: data.sections || [],
    updated_at: data.lastUpdated,
    image_url: data.imageUrl,
    wireframe_data: data // Add the wireframe_data property
  };
}

// Helper function to convert AIWireframe to WireframeData format
export function aiWireframeToWireframeData(wireframe: AIWireframe): WireframeData {
  // First check if wireframe_data exists and use it
  if (wireframe.wireframe_data) {
    return {
      ...wireframe.wireframe_data,
      id: wireframe.id,
      lastUpdated: wireframe.updated_at || new Date().toISOString()
    };
  }
  
  // Otherwise build from other properties
  return {
    id: wireframe.id,
    title: wireframe.title || wireframe.description || "Untitled Wireframe",
    description: wireframe.description || "",
    sections: wireframe.sections || [],
    imageUrl: wireframe.image_url || "",
    lastUpdated: wireframe.updated_at || new Date().toISOString()
  };
}
