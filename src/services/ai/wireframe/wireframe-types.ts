
// If this file doesn't exist yet, let's create it with the necessary types

export interface WireframeSection {
  id?: string;
  sectionType: string;
  layout: string;
  components: any[];
  // Add other section properties as needed
}

export interface WireframeData {
  title: string;
  description?: string;
  sections: WireframeSection[];
  // Add other wireframe data properties as needed
}

export interface WireframeGenerationParams {
  prompt: string;
  userId?: string;
  projectId?: string;
  sectionTypes?: string[];
  stylePreferences?: Record<string, string>;
  baseWireframe?: any;
  templateId?: string;
  // Add other parameters as needed
}

export interface WireframeGenerationResult {
  wireframe?: WireframeData;
  model?: string;
  success: boolean;
  errorMessage?: string;
  // Add other result properties as needed
}

export interface AIWireframe {
  id: string;
  project_id?: string;
  description?: string;
  prompt: string;
  generation_params?: any;
  data?: WireframeData;
  status?: string;
  created_at: string;
  updated_at?: string;
  feedback?: string;
  rating?: number;
  sections?: WireframeSection[];
  // Add other wireframe properties as needed
}

export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  data: WireframeData;
  change_description?: string;
  created_at: string;
  created_by?: string;
  is_current: boolean;
  parent_version_id?: string;
  branch_name?: string;
}

export interface WireframeRevisionHistory {
  versions: WireframeVersion[];
  current: WireframeVersion | null;
  branches: string[];
}
