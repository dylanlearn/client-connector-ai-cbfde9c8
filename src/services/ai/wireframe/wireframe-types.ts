
import { v4 as uuidv4 } from 'uuid';

export interface WireframeSection {
  id: string;
  name: string;
  type?: string;
  sectionType?: string;
  content?: any;
  description?: string;
  config?: any;
  isHidden?: boolean;
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
}

export interface WireframeGenerationResult {
  wireframe?: WireframeData;
  imageUrl?: string;
  error?: string;
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
    image_url: data.imageUrl
  };
}

// Helper function to convert AIWireframe to WireframeData format
export function aiWireframeToWireframeData(wireframe: AIWireframe): WireframeData {
  return {
    id: wireframe.id,
    title: wireframe.title || wireframe.description || "Untitled Wireframe",
    description: wireframe.description || "",
    sections: wireframe.sections || [],
    imageUrl: wireframe.image_url || "",
    lastUpdated: wireframe.updated_at || new Date().toISOString()
  };
}
