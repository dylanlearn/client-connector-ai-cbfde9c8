
/**
 * Type definitions for wireframe version control
 */

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
}
