/**
 * Type definitions for wireframe version control
 */

export interface Wireframe {
  id: string;
  project_id: string;
  description?: string;
  sections?: any[];
  data?: WireframeData;
  generation_params?: any;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  version_count?: number;
  current_version_id?: string;
}

export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  components?: any[];
  layout?: {
    type: string;
    direction?: string;
    alignment?: string;
    justifyContent?: string;
    columns?: number;
    gap?: number;
    wrap?: boolean;
    [key: string]: any;
  } | string; // This allows the layout to be a string
  layoutType?: string;
  positionOrder?: number;
  componentVariant?: string;
  copySuggestions?: {
    heading?: string;
    subheading?: string;
    [key: string]: any;
  };
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
  [key: string]: any;
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

export interface WireframeData {
  id: string; // Required id field
  title: string;
  description?: string;
  sections: any[];
  layoutType?: string;
  colorScheme?: {
    primary: string; // Required to match service type
    secondary: string; // Required to match service type
    accent: string; // Required to match service type
    background: string; // Required to match service type
    text?: string;
  };
  typography?: {
    headings: string; // Required to match service type
    body: string; // Required to match service type
    fontPairings?: string[];
  };
  designTokens?: Record<string, any>;
  mobileConsiderations?: string; // Add this field
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

export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  branch_name: string;
  data: Record<string, any>; // Made required
  parent_version_id?: string;
  is_current: boolean;
  change_description?: string;
  created_at: string;
  created_by?: string;
  sourceData?: WireframeSourceData;
  version?: string; // Add this field for the version property
}

export interface WireframeVersionDiff {
  added: string[];
  removed: string[];
  modified: string[];
}

export interface WireframeBranch {
  name: string;
  versions: WireframeVersion[];
  current_version_id?: string;
  latest_version_id?: string;
}

export interface WireframeVersionTree {
  branches: Record<string, WireframeBranch>;
  main_branch: string;
  current?: WireframeVersion;
}

export interface WireframeVersionControlOptions {
  projectId: string;
  wireframeId: string;
  data?: WireframeData;
  sourceData?: WireframeSourceData;
  changeDescription?: string;
  branchName?: string;
  createdBy?: string;
}

export interface WireframeCompareResult {
  changes: Array<{
    type: "added" | "removed" | "modified";
    path: string;
    values: [any, any];
  }>;
  summary: string;
}

export interface WireframeHistoryState {
  versions: WireframeVersion[];
  branches: WireframeBranch[];
  current?: WireframeVersion;
}

export interface WireframeCanvasConfig {
  width: number;
  height: number;
  zoom: number;
  panOffset: { x: number, y: number };
  showGrid?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  backgroundColor: string;
  gridType?: 'lines' | 'dots' | 'columns';
  snapTolerance?: number;
  showSmartGuides?: boolean;
  [key: string]: any;
}
