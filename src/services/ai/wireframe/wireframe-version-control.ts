
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeData, 
  WireframeVersion, 
  WireframeRevisionHistory,
  BranchInfo,
  VersionComparisonResult
} from './wireframe-types';

/**
 * Version control service for wireframes
 */
export const WireframeVersionControlService = {
  /**
   * Create a new version of a wireframe
   */
  createVersion: async (
    wireframeId: string,
    data: WireframeData,
    changeDescription: string = "Updated wireframe",
    userId: string,
    parentVersionId?: string,
    branchName: string = "main"
  ): Promise<WireframeVersion | null> => {
    try {
      // First, convert wireframeData to JSON-compatible format
      const wireframeDataJson = JSON.parse(JSON.stringify(data));
      
      // Get the latest version number for this wireframe
      const { data: versionNumber, error: versionError } = await supabase
        .rpc('get_latest_version_number', { 
          p_wireframe_id: wireframeId,
          p_branch_name: branchName
        });
      
      if (versionError) {
        console.error("Error fetching last version:", versionError);
        throw versionError;
      }
      
      // Calculate next version number
      const nextVersion = typeof versionNumber === 'number' && versionNumber > 0 ? versionNumber + 1 : 1;
      
      // If this is a new version on the main branch, set all previous versions as not current
      if (branchName === "main") {
        // Update previous versions as inactive
        const { error: updateError } = await supabase
          .rpc('set_versions_inactive', { 
            p_wireframe_id: wireframeId, 
            p_branch_name: branchName 
          });
        
        if (updateError) {
          console.error("Error updating previous versions:", updateError);
        }
      }
      
      // Insert the new version
      const { data: newVersion, error: insertError } = await supabase
        .rpc('create_wireframe_version', {
          p_wireframe_id: wireframeId,
          p_version_number: nextVersion,
          p_data: wireframeDataJson,
          p_change_description: changeDescription,
          p_created_by: userId,
          p_is_current: true,
          p_parent_version_id: parentVersionId || null,
          p_branch_name: branchName
        });
      
      if (insertError || !newVersion) {
        console.error("Error creating wireframe version:", insertError || "No version data returned");
        throw insertError || new Error("Failed to create version");
      }
      
      // Update the main wireframe to reference this version's data if on main branch
      if (branchName === "main") {
        // Convert wireframeData to JSON-compatible format again to ensure clean data
        const dataForMainWireframe = JSON.parse(JSON.stringify(data));
        
        const { error: wireframeUpdateError } = await supabase
          .rpc('update_wireframe_with_version', {
            p_wireframe_id: wireframeId,
            p_version_id: newVersion.id,
            p_wireframe_data: dataForMainWireframe
          });
        
        if (wireframeUpdateError) {
          console.error("Error updating wireframe with new version:", wireframeUpdateError);
        }
      }
      
      return newVersion as unknown as WireframeVersion;
    } catch (error) {
      console.error("Error in wireframe version creation:", error);
      return null;
    }
  },
  
  /**
   * Get all versions of a wireframe
   */
  getVersionHistory: async (wireframeId: string): Promise<WireframeRevisionHistory> => {
    try {
      // Get all versions for this wireframe
      const { data: versionsData, error } = await supabase
        .rpc('get_wireframe_versions', { p_wireframe_id: wireframeId });
      
      if (error || !versionsData) {
        console.error("Error getting wireframe versions:", error);
        throw error || new Error("Failed to get wireframe versions");
      }
      
      const versions = versionsData as unknown as WireframeVersion[];
      
      // Find current version and branches
      const current = versions.find(version => 
        version.is_current && version.branch_name === "main") || null;
      
      // Find all unique branches
      const branches = Array.from(new Set(versions.map(v => v.branch_name)));
      
      return {
        versions,
        current,
        branches
      };
    } catch (error) {
      console.error("Error getting wireframe versions:", error);
      return { versions: [], current: null, branches: [] };
    }
  },
  
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
      const { data: versionData, error } = await supabase
        .rpc('get_wireframe_version', { p_version_id: versionId });
      
      if (error || !versionData) {
        console.error("Error getting version to revert to:", error);
        throw error || new Error("Version not found");
      }
      
      const version = versionData as unknown as WireframeVersion;
      
      // Create a new version with the content of the old version
      return WireframeVersionControlService.createVersion(
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
  createBranch: async (
    versionId: string,
    branchName: string,
    userId: string,
    description: string = `Created branch ${branchName}`
  ): Promise<WireframeVersion | null> => {
    try {
      // Get the version to branch from
      const { data: versionData, error } = await supabase
        .rpc('get_wireframe_version', { p_version_id: versionId });
      
      if (error || !versionData) {
        console.error("Error getting version to branch from:", error);
        throw error || new Error("Version not found");
      }
      
      const version = versionData as unknown as WireframeVersion;
      
      // Create a new version on the new branch
      return WireframeVersionControlService.createVersion(
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
      const { data: versionData, error } = await supabase
        .rpc('get_wireframe_version', { p_version_id: branchVersionId });
      
      if (error || !versionData) {
        console.error("Error getting branch version:", error);
        throw error || new Error("Branch version not found");
      }
      
      const branchVersion = versionData as unknown as WireframeVersion;
      
      // Create a new version on the main branch using the branch version data
      return WireframeVersionControlService.createVersion(
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
  },
  
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
   * Compare two wireframe versions
   */
  compareVersions: async (
    versionId1: string,
    versionId2: string
  ): Promise<VersionComparisonResult> => {
    try {
      // Compare versions
      const { data: comparisonData, error } = await supabase
        .rpc('compare_wireframe_versions', { 
          p_version_id1: versionId1,
          p_version_id2: versionId2 
        });
      
      if (error || !comparisonData) {
        console.error("Error comparing wireframe versions:", error);
        throw error || new Error("Could not compare versions");
      }
      
      return comparisonData as unknown as VersionComparisonResult;
    } catch (error) {
      console.error("Error comparing wireframe versions:", error);
      return { changes: [], summary: "Could not compare versions due to an error." };
    }
  }
};

/**
 * Helper function to compare two objects and find differences
 * This function is kept here for reference, but we'll use a server-side RPC function instead
 */
function compareObjects(
  obj1: any,
  obj2: any,
  path: string = ''
): { type: 'added' | 'removed' | 'modified', path: string, values: [any, any] }[] {
  const changes: { type: 'added' | 'removed' | 'modified', path: string, values: [any, any] }[] = [];
  
  if (typeof obj1 !== typeof obj2) {
    changes.push({ type: 'modified', path, values: [obj1, obj2] });
    return changes;
  }
  
  if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
    if (obj1 !== obj2) {
      changes.push({ type: 'modified', path, values: [obj1, obj2] });
    }
    return changes;
  }
  
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLength = Math.max(obj1.length, obj2.length);
    for (let i = 0; i < maxLength; i++) {
      const newPath = `${path}[${i}]`;
      if (i >= obj1.length) {
        changes.push({ type: 'added', path: newPath, values: [undefined, obj2[i]] });
      } else if (i >= obj2.length) {
        changes.push({ type: 'removed', path: newPath, values: [obj1[i], undefined] });
      } else {
        changes.push(...compareObjects(obj1[i], obj2[i], newPath));
      }
    }
    return changes;
  }
  
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    
    if (!(key in obj1)) {
      changes.push({ type: 'added', path: newPath, values: [undefined, obj2[key]] });
    } else if (!(key in obj2)) {
      changes.push({ type: 'removed', path: newPath, values: [obj1[key], undefined] });
    } else {
      changes.push(...compareObjects(obj1[key], obj2[key], newPath));
    }
  }
  
  return changes;
}
