
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

// Add missing interfaces referenced in other files
export interface WireframeSection {
  id?: string;
  name: string;
  sectionType: string;
  layoutType?: string;
  layout?: any;
  components?: WireframeComponent[];
  copySuggestions?: CopySuggestions;
  designReasoning?: string;
  mobileLayout?: any;
  animationSuggestions?: any;
  dynamicElements?: any;
  styleVariants?: any;
  positionOrder?: number;
  description?: string;
}

export interface WireframeComponent {
  type: string;
  id?: string;
  content?: string;
  props?: Record<string, any>;
  children?: WireframeComponent[];
  [key: string]: any;
}

export interface CopySuggestions {
  headlines?: string[];
  descriptions?: string[];
  ctaText?: string[];
  [key: string]: any;
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
  sourceData?: WireframeSourceData;
}

export interface WireframeSourceData {
  title?: string;
  description?: string;
  sections?: any[];
  message?: string;
  tags?: string[];
  layout?: string;
  style?: string;
  components?: any[];
  [key: string]: any;
}

export interface BranchInfo {
  name: string;
  versions: WireframeVersion[];
  current_version_id?: string;
  created_at: string;
}

export interface VersionComparisonResult {
  changes: Array<{
    type: "added" | "removed" | "modified";
    path: string;
    values: [any, any];
  }>;
  summary: string;
}
