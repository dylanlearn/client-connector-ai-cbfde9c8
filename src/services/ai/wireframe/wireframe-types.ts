
/**
 * Interface for an AI-generated wireframe
 */
export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  project_id?: string;
  projectId?: string;
  data?: any;
  created_at?: string;
  generation_params?: {
    model?: string;
    prompt?: string;
    stylePreferences?: string[];
    complexity?: string;
  };
  styleToken?: string; // Adding styleToken property
}

/**
 * Interface for wireframe section data
 */
export interface WireframeSection {
  id: string;
  sectionType: string;
  name: string;
  description?: string;
  components?: any[];
  items?: any[];
  imageUrl?: string;
  layout?: string;
  order?: number;
}

/**
 * Interface for wireframe data structure
 */
export interface WireframeData {
  id?: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  styleToken?: string;
}
