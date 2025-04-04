
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeData, 
  WireframeVersion, 
  WireframeRevisionHistory 
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
      
      // Create the new version
      const { data: versionData, error: createVersionError } = await supabase
        .rpc('create_wireframe_version', {
          p_wireframe_id: wireframeId,
          p_version_number: newVersionNumber,
          p_data: data,
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
      await supabase.rpc('update_wireframe_with_version', {
        p_wireframe_id: wireframeId,
        p_version_id: version.id,
        p_wireframe_data: data
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
    userId: string | undefined
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
          p_change_description: `Branch created from ${version.branch_name || 'main'} version ${version.version_number}`,
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
  }
};
