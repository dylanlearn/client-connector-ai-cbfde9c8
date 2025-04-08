
import { supabase } from "@/integrations/supabase/client";
import { 
  WireframeVersionControlOptions, 
  WireframeVersion,
  WireframeData
} from "@/types/wireframe";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for managing wireframe version control
 */
export class WireframeVersionControlService {
  /**
   * Create a new version for a wireframe
   */
  static async createVersion(
    wireframeId: string,
    data: WireframeData,
    changeDescription?: string,
    createdBy?: string
  ): Promise<WireframeVersion | null> {
    try {
      if (!wireframeId || !data) {
        throw new Error('Wireframe ID and data are required');
      }

      // Ensure we have valid data
      const wireframeData: WireframeData = {
        id: data.id || uuidv4(),
        title: data.title || 'Untitled Wireframe',
        sections: data.sections || [],
        ...data
      };

      // Get the latest version number
      const { data: latestVersions, error: fetchError } = await supabase
        .from('wireframe_versions')
        .select('version_number')
        .eq('wireframe_id', wireframeId)
        .eq('branch_name', 'main') // Default branch
        .order('version_number', { ascending: false })
        .limit(1);

      if (fetchError) {
        throw new Error(`Failed to fetch latest version: ${fetchError.message}`);
      }

      const versionNumber = latestVersions && latestVersions.length > 0
        ? (latestVersions[0].version_number + 1)
        : 1;

      // Create the version record
      const versionRecord = {
        id: uuidv4(),
        wireframe_id: wireframeId,
        version_number: versionNumber,
        branch_name: 'main', // Default branch
        data: wireframeData,
        is_current: true,
        change_description: changeDescription || `Version ${versionNumber}`,
        created_at: new Date().toISOString(),
        created_by: createdBy
      };

      // Set all other versions to not be current
      await supabase
        .from('wireframe_versions')
        .update({ is_current: false })
        .eq('wireframe_id', wireframeId)
        .eq('is_current', true);

      // Insert the new version
      const { data: insertedVersion, error: insertError } = await supabase
        .from('wireframe_versions')
        .insert(versionRecord)
        .select();

      if (insertError) {
        throw new Error(`Failed to create version: ${insertError.message}`);
      }

      // Update the wireframe's current_version_id and version_count
      const { error: updateError } = await supabase
        .from('wireframes')
        .update({
          current_version_id: versionRecord.id,
          version_count: versionNumber
        })
        .eq('id', wireframeId);

      if (updateError) {
        console.error(`Failed to update wireframe with version: ${updateError.message}`);
        // Continue anyway, we don't want to fail the whole operation
      }

      return insertedVersion[0] as WireframeVersion;
    } catch (error) {
      console.error("Error creating wireframe version:", error);
      return null;
    }
  }

  /**
   * Get all versions for a wireframe
   */
  static async getVersions(wireframeId: string): Promise<WireframeVersion[]> {
    try {
      const { data, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('version_number', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch wireframe versions: ${error.message}`);
      }

      return data as WireframeVersion[];
    } catch (error) {
      console.error("Error fetching wireframe versions:", error);
      return [];
    }
  }

  /**
   * Get a specific version for a wireframe
   */
  static async getVersion(versionId: string): Promise<WireframeVersion | null> {
    try {
      const { data, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('id', versionId)
        .limit(1)
        .single();

      if (error) {
        throw new Error(`Failed to fetch wireframe version: ${error.message}`);
      }

      return data as WireframeVersion;
    } catch (error) {
      console.error("Error fetching wireframe version:", error);
      return null;
    }
  }
}
