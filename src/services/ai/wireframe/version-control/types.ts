
import { WireframeData } from '../wireframe-types';

/**
 * Interface for wireframe version data
 */
export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  data: WireframeData;
  parent_version_id?: string;
  created_at: string;
  created_by?: string;
  change_description?: string;
  is_current: boolean;
}

/**
 * Interface for branch information
 */
export interface BranchInfo {
  id: string;
  name: string;
  wireframe_id: string;
  created_at: string;
  created_by?: string;
  description?: string;
  is_default?: boolean;
}

/**
 * Interface for version creation options
 */
export interface VersionCreationOptions {
  wireframeId: string;
  data: WireframeData;
  parentVersionId?: string;
  changeDescription?: string;
  branchName?: string;
  createdBy?: string;
}
