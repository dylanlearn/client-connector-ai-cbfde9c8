
import { supabase } from "@/integrations/supabase/client";
import { VersionComparisonResult } from '../wireframe-types';

/**
 * Service for comparing wireframe versions
 */
export const versionComparisonService = {
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
