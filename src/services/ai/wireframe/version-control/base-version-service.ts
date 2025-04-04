
import { supabase } from "@/integrations/supabase/client";
import { WireframeData, WireframeVersion } from '../wireframe-types';

/**
 * Base version service for common version functionality
 */
export const baseVersionService = {
  /**
   * Get the latest version number for a wireframe and branch
   */
  getLatestVersionNumber: async (wireframeId: string, branchName: string = "main"): Promise<number> => {
    try {
      const { data: versionNumber, error: versionError } = await supabase
        .rpc('get_latest_version_number', { 
          p_wireframe_id: wireframeId,
          p_branch_name: branchName
        });
      
      if (versionError) {
        console.error("Error fetching last version:", versionError);
        throw versionError;
      }
      
      return typeof versionNumber === 'number' && versionNumber > 0 ? versionNumber : 0;
    } catch (error) {
      console.error("Error in get latest version:", error);
      return 0;
    }
  },

  /**
   * Get a specific wireframe version
   */
  getWireframeVersion: async (versionId: string): Promise<WireframeVersion | null> => {
    try {
      const { data: versionData, error } = await supabase
        .rpc('get_wireframe_version', { p_version_id: versionId });
      
      if (error || !versionData) {
        console.error("Error getting wireframe version:", error);
        throw error || new Error("Version not found");
      }
      
      return versionData as unknown as WireframeVersion;
    } catch (error) {
      console.error("Error getting wireframe version:", error);
      return null;
    }
  },

  /**
   * Update the main wireframe with version data
   */
  updateMainWireframe: async (wireframeId: string, versionId: string, data: WireframeData): Promise<void> => {
    try {
      // Convert wireframeData to JSON-compatible format
      const dataForMainWireframe = JSON.parse(JSON.stringify(data));
      
      const { error: wireframeUpdateError } = await supabase
        .rpc('update_wireframe_with_version', {
          p_wireframe_id: wireframeId,
          p_version_id: versionId,
          p_wireframe_data: dataForMainWireframe
        });
      
      if (wireframeUpdateError) {
        console.error("Error updating wireframe with new version:", wireframeUpdateError);
        throw wireframeUpdateError;
      }
    } catch (error) {
      console.error("Error updating main wireframe:", error);
      throw error;
    }
  }
};
