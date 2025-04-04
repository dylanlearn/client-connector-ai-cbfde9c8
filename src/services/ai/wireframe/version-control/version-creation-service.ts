
import { supabase } from "@/integrations/supabase/client";
import { WireframeData, WireframeVersion } from '../wireframe-types';
import { baseVersionService } from './base-version-service';

/**
 * Service for creating wireframe versions
 */
export const versionCreationService = {
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
      const versionNumber = await baseVersionService.getLatestVersionNumber(wireframeId, branchName);
      
      // Calculate next version number
      const nextVersion = versionNumber + 1;
      
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
        await baseVersionService.updateMainWireframe(wireframeId, newVersion.id, data);
      }
      
      return newVersion as unknown as WireframeVersion;
    } catch (error) {
      console.error("Error in wireframe version creation:", error);
      return null;
    }
  }
};
