
// Centralizing wireframe-related types in one file
export interface WireframeData {
  title: string;
  description?: string;
  sections: WireframeSection[];
  layout?: any;
  styleGuide?: any;
}

export interface WireframeSection {
  id: string;
  name: string;
  description?: string;
  components?: any[];
  layout?: any;
}

export interface WireframeGenerationParams {
  prompt: string;
  projectId?: string;
  style?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  includeAnimations?: boolean;
  includeMobileLayouts?: boolean;
  result_data?: WireframeData;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  generationTime?: number;
  success: boolean;
  error?: string;
}

export interface AIWireframe {
  id: string;
  project_id?: string;
  prompt: string;
  description?: string;
  generation_params?: WireframeGenerationParams;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  status?: string;
  design_tokens?: any;
  mobile_layouts?: any;
  animations?: any;
  design_reasoning?: string;
  style_variants?: any;
  quality_flags?: any;
  image_url?: string;
}
