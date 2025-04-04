
import { supabase } from "@/integrations/supabase/client";
import { BranchInfo, WireframeVersion } from '../wireframe-types';
import { baseVersionService } from './base-version-service';
import { versionCreationService } from './version-creation-service';

/**
 * Service for managing wireframe branches
 */
export const branchService = {
  /**
   * Get all branches for a wireframe
   */
  getBranches: async (wireframeId: string): Promise<BranchInfo[]> => {
    try {
      const { data: branchData, error } = await supabase
        .rpc('get_wireframe_branches', { p_wireframe_id: wireframeId });
      
      if (error) {
        console.error("Error getting wireframe branches:", error);
        throw error;
      }
      
      return (branchData || []) as unknown as BranchInfo[];
    } catch (error) {
      console.error("Error getting wireframe branches:", error);
      return [];
    }
  },

  /**
   * Create a new branch based on a specific version
   */
  createBranch: async (
    versionId: string,
    branchName: string,
    userId: string,
    description: string = `Created branch ${branchName}`
  ): Promise<WireframeVersion | null> => {
    try {
      // Get the version to branch from
      const version = await baseVersionService.getWireframeVersion(versionId);
      
      if (!version) {
        throw new Error("Version not found");
      }
      
      // Create a new version on the new branch
      return versionCreationService.createVersion(
        version.wireframe_id,
        version.data,
        description,
        userId,
        version.id,
        branchName
      );
    } catch (error) {
      console.error("Error creating wireframe branch:", error);
      return null;
    }
  },

  /**
   * Merge a branch into the main branch
   */
  mergeBranch: async (
    branchVersionId: string,
    userId: string,
    description: string = "Merged branch into main"
  ): Promise<WireframeVersion | null> => {
    try {
      // Get the branch version
      const branchVersion = await baseVersionService.getWireframeVersion(branchVersionId);
      
      if (!branchVersion) {
        throw new Error("Branch version not found");
      }
      
      // Create a new version on the main branch using the branch version data
      return versionCreationService.createVersion(
        branchVersion.wireframe_id,
        branchVersion.data,
        description,
        userId,
        branchVersion.id
      );
    } catch (error) {
      console.error("Error merging wireframe branch:", error);
      return null;
    }
  }
};
