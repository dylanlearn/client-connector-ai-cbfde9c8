
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
}

export interface WireframeComponent {
  id: string;
  type: string;
  content?: any;
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
  styleProperties?: any;
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
