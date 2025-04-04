
import { supabase } from "@/integrations/supabase/client";
import { WireframeRevisionHistory } from '../wireframe-types';

/**
 * Service for retrieving wireframe version history
 */
export const versionHistoryService = {
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
      console.error("Error getting wireframe versions:", error);
      return { versions: [], current: null, branches: [] };
    }
  }
};
