
// Update wireframe types to match usage in components and services

export interface WireframeSection {
  id?: string;
  sectionType: string;
  layout: string;
  components: any[];
  // Adding missing fields that are used in the components
  name?: string;
  description?: string;
  layoutType?: string;
  mobileLayout?: any;
  styleVariants?: any;
  animationSuggestions?: any;
  copySuggestions?: any;
  designReasoning?: string;
  // Add other section properties as needed
}

export interface WireframeData {
  title: string;
  description?: string;
  sections: WireframeSection[];
  // Adding missing fields that are used in the components
  designTokens?: any;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: string;
  animations?: any;
  imageUrl?: string;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  qualityFlags?: any;
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
  // Adding missing fields used in components and services
  style?: string;
  complexity?: string;
  industry?: string;
  pages?: number;
  moodboardSelections?: any;
  additionalInstructions?: string;
  typography?: string;
  // Add other parameters as needed
}

export interface WireframeGenerationResult {
  wireframe?: WireframeData;
  model?: string;
  success: boolean;
  errorMessage?: string;
  generationTime?: number;
  usage?: any;
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

export interface BranchInfo {
  name: string;
  created_at: string;
  version_count: number;
  latest_version_id: string;
}

export interface VersionComparisonResult {
  changes: {
    type: 'added' | 'removed' | 'modified';
    path: string;
    values: [any, any];
  }[];
  summary: string;
}
