
export interface WireframeData {
  title?: string;
  description?: string;
  sections?: any[];
  pages?: any[];
  styleToken?: string;
  darkMode?: boolean;
}

export interface AIWireframe {
  id: string;
  project_id: string;
  title: string;
  description: string;
  wireframe_data: WireframeData;
  feedback?: string;
  rating?: number;
  created_at: string;
}

export interface WireframeGenerationParams {
  description: string;
  style?: string;
  projectId?: string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  baseWireframe?: WireframeData;
  multiPageLayout?: boolean;
  pages?: number;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  generationTime: number;
  creativityLevel?: number;
  usedModels?: string[];
}
