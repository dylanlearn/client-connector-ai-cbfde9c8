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
  title?: string;
  description?: string;
  sections?: any[]; // Make sections optional here too
  layoutType?: string;
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  typography?: {
    headings?: string;
    body?: string;
    fontPairings?: string[];
  };
  designTokens?: Record<string, any>;
  [key: string]: any; // Allow any other properties
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

export interface WireframeVersionDiff {
  added: string[];
  removed: string[];
  modified: string[];
}

export interface WireframeBranch {
  name: string;
  versions: WireframeVersion[];
  current_version_id?: string;
  created_at: string;
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
