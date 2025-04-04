
import { WireframeData, WireframeVersion, WireframeRevisionHistory, BranchInfo, VersionComparisonResult } from '../wireframe-types';
import { baseVersionService } from './base-version-service';
import { versionCreationService } from './version-creation-service';
import { branchService } from './branch-service';
import { versionHistoryService } from './version-history-service';
import { versionComparisonService } from './version-comparison-service';

/**
 * Main version control service for wireframes
 */
export const WireframeVersionControlService = {
  /**
   * Create a new version of a wireframe
   */
  createVersion: versionCreationService.createVersion,
  
  /**
   * Get all versions of a wireframe
   */
  getVersionHistory: versionHistoryService.getVersionHistory,
  
  /**
   * Revert to a specific version
   */
  revertToVersion: async (
    versionId: string,
    userId: string,
    description: string = "Reverted to previous version"
  ): Promise<WireframeVersion | null> => {
    try {
      // Get the version to revert to
      const version = await baseVersionService.getWireframeVersion(versionId);
      
      if (!version) {
        throw new Error("Version not found");
      }
      
      // Create a new version with the content of the old version
      return versionCreationService.createVersion(
        version.wireframe_id,
        version.data,
        description,
        userId,
        version.id
      );
    } catch (error) {
      console.error("Error reverting wireframe version:", error);
      return null;
    }
  },
  
  /**
   * Create a new branch based on a specific version
   */
  createBranch: branchService.createBranch,
  
  /**
   * Merge a branch into the main branch
   */
  mergeBranch: branchService.mergeBranch,
  
  /**
   * Get all branches for a wireframe
   */
  getBranches: branchService.getBranches,
  
  /**
   * Compare two wireframe versions
   */
  compareVersions: versionComparisonService.compareVersions
};

// Export helper utilities as well
export { baseVersionService };
