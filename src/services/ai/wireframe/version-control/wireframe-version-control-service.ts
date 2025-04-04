
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeData, 
  WireframeVersion, 
  WireframeRevisionHistory,
  BranchInfo
} from "../wireframe-types";

/**
 * Service for wireframe version control operations
 */
export const wireframeVersionControl = {
  /**
   * Create a new version of a wireframe
   */
  createVersion: async (
    wireframeId: string,
    data: WireframeData,
    changeDescription: string,
    userId: string | undefined,
    branchName: string = 'main'
  ): Promise<WireframeVersion | null> => {
    try {
      // Get the latest version number for this branch
      const { data: versionNumberData, error: versionNumberError } = await supabase
        .rpc('get_latest_version_number', {
          p_wireframe_id: wireframeId,
          p_branch_name: branchName
        });
        
      if (versionNumberError) {
        console.error('Error getting latest version number:', versionNumberError);
        return null;
      }
      
      const newVersionNumber = (versionNumberData || 0) + 1;
      
      // Set all versions of this branch to inactive
      await supabase.rpc('set_versions_inactive', {
        p_wireframe_id: wireframeId,
        p_branch_name: branchName
      });
      
      // Create the new version - converting WireframeData to a JSON compatible format
      const jsonData = JSON.parse(JSON.stringify(data));
      
      const { data: versionData, error: createVersionError } = await supabase
        .rpc('create_wireframe_version', {
          p_wireframe_id: wireframeId,
          p_version_number: newVersionNumber,
          p_data: jsonData,
          p_change_description: changeDescription || `Version ${newVersionNumber}`,
          p_created_by: userId,
          p_is_current: true,
          p_parent_version_id: null, // For now, we're not tracking parent versions
          p_branch_name: branchName
        });
        
      if (createVersionError) {
        console.error('Error creating wireframe version:', createVersionError);
        return null;
      }
      
      // Convert the returned data to WireframeVersion type
      const version: WireframeVersion = {
        ...versionData,
        data: data
      };
      
      // Update the wireframe with the version data
      // Convert WireframeData to JSON compatible format for the update
      const jsonDataForUpdate = JSON.parse(JSON.stringify(data));
      
      await supabase.rpc('update_wireframe_with_version', {
        p_wireframe_id: wireframeId,
        p_version_id: version.id,
        p_wireframe_data: jsonDataForUpdate
      });
      
      return version;
    } catch (error) {
      console.error('Error in createVersion:', error);
      return null;
    }
  },
  
  /**
   * Revert to a specific version
   */
  revertToVersion: async (
    versionId: string,
    userId: string | undefined
  ): Promise<boolean> => {
    try {
      // Get the version to revert to
      const { data: versionData, error: versionError } = await supabase
        .rpc('get_wireframe_version', {
          p_version_id: versionId
        });
        
      if (versionError || !versionData) {
        console.error('Error getting version:', versionError);
        return false;
      }
      
      const version = versionData;
      const wireframeId = version.wireframe_id;
      const branchName = version.branch_name || 'main';
      
      // Set all versions of this branch to inactive
      await supabase.rpc('set_versions_inactive', {
        p_wireframe_id: wireframeId,
        p_branch_name: branchName
      });
      
      // Parse the data if it's a string
      const wireframeData = typeof version.data === 'string' 
        ? JSON.parse(version.data) 
        : version.data;
      
      // Create a new version based on the old one
      const changeDescription = `Reverted to version ${version.version_number}`;
      
      // Get the latest version number for this branch
      const { data: versionNumberData, error: versionNumberError } = await supabase
        .rpc('get_latest_version_number', {
          p_wireframe_id: wireframeId,
          p_branch_name: branchName
        });
        
      if (versionNumberError) {
        console.error('Error getting latest version number:', versionNumberError);
        return false;
      }
      
      const newVersionNumber = (versionNumberData || 0) + 1;
      
      // Create the new version
      const { data: newVersionData, error: createVersionError } = await supabase
        .rpc('create_wireframe_version', {
          p_wireframe_id: wireframeId,
          p_version_number: newVersionNumber,
          p_data: wireframeData,
          p_change_description: changeDescription,
          p_created_by: userId,
          p_is_current: true,
          p_parent_version_id: versionId,
          p_branch_name: branchName
        });
        
      if (createVersionError) {
        console.error('Error creating wireframe version:', createVersionError);
        return false;
      }
      
      // Update the wireframe with the version data
      await supabase.rpc('update_wireframe_with_version', {
        p_wireframe_id: wireframeId,
        p_version_id: newVersionData.id,
        p_wireframe_data: wireframeData
      });
      
      return true;
    } catch (error) {
      console.error('Error in revertToVersion:', error);
      return false;
    }
  },
  
  /**
   * Create a new branch based on a specific version
   */
  createBranch: async (
    versionId: string,
    newBranchName: string,
    userId: string | undefined,
    description?: string
  ): Promise<boolean> => {
    try {
      // Get the version to branch from
      const { data: versionData, error: versionError } = await supabase
        .rpc('get_wireframe_version', {
          p_version_id: versionId
        });
        
      if (versionError || !versionData) {
        console.error('Error getting version:', versionError);
        return false;
      }
      
      const version = versionData;
      const wireframeId = version.wireframe_id;
      
      // Parse the data if it's a string
      const wireframeData = typeof version.data === 'string' 
        ? JSON.parse(version.data) 
        : version.data;
      
      // Create version 1 in the new branch
      const { error: createVersionError } = await supabase
        .rpc('create_wireframe_version', {
          p_wireframe_id: wireframeId,
          p_version_number: 1, // Start with version 1 in the new branch
          p_data: wireframeData,
          p_change_description: description || `Branch created from ${version.branch_name || 'main'} version ${version.version_number}`,
          p_created_by: userId,
          p_is_current: true,
          p_parent_version_id: versionId,
          p_branch_name: newBranchName
        });
        
      if (createVersionError) {
        console.error('Error creating branch version:', createVersionError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createBranch:', error);
      return false;
    }
  },
  
  /**
   * Compare two versions
   */
  compareVersions: async (
    version1Id: string,
    version2Id: string
  ): Promise<any> => {
    try {
      const { data, error } = await supabase
        .rpc('compare_wireframe_versions', {
          p_version_id1: version1Id,
          p_version_id2: version2Id
        });
        
      if (error) {
        console.error('Error comparing versions:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in compareVersions:', error);
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
      
      // Process the versions to ensure correct types
      const versions = versionsData.map(version => ({
        ...version,
        data: typeof version.data === 'string' 
          ? JSON.parse(version.data) 
          : version.data
      }));
      
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
      console.error("Error in getVersionHistory:", error);
      return { versions: [], current: null, branches: [] };
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
      
      return (branchData || []) as BranchInfo[];
    } catch (error) {
      console.error("Error in getBranches:", error);
      return [];
    }
  },

  /**
   * Merge a branch into the main branch
   */
  mergeBranch: async (
    branchVersionId: string,
    userId: string | undefined,
    description: string = "Merged branch into main"
  ): Promise<WireframeVersion | null> => {
    try {
      // Get the branch version
      const { data: versionData, error: versionError } = await supabase
        .rpc('get_wireframe_version', { p_version_id: branchVersionId });
      
      if (versionError || !versionData) {
        console.error("Error getting branch version:", versionError);
        throw versionError || new Error("Branch version not found");
      }

      const branchVersion = versionData;
      
      // Parse the data if it's a string
      const wireframeData = typeof branchVersion.data === 'string' 
        ? JSON.parse(branchVersion.data) 
        : branchVersion.data;
      
      // Create a new version on the main branch
      return wireframeVersionControl.createVersion(
        branchVersion.wireframe_id,
        wireframeData,
        description,
        userId,
        'main'
      );
    } catch (error) {
      console.error("Error merging branch:", error);
      return null;
    }
  },
};
