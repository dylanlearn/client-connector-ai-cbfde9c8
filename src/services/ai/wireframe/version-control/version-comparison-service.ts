
import { supabase } from "@/integrations/supabase/client";
import { VersionComparisonResult } from "../wireframe-types";

// Example version comparison service implementation
export const versionComparisonService = {
  compareVersions: async (
    version1Id: string,
    version2Id: string
  ): Promise<VersionComparisonResult | null> => {
    try {
      const { data, error } = await supabase
        .rpc('compare_wireframe_versions', {
          p_version_id1: version1Id,
          p_version_id2: version2Id
        });
      
      if (error) {
        console.error("Error comparing versions:", error);
        return null;
      }
      
      // Ensure we have a properly typed result
      if (data && typeof data === 'object' && 'changes' in data && 'summary' in data) {
        return data as VersionComparisonResult;
      }
      
      // Create a fallback result if the data doesn't match expected format
      return {
        changes: [],
        summary: "Could not format comparison results"
      };
    } catch (error) {
      console.error("Error in compareVersions:", error);
      return null;
    }
  }
};
