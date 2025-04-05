// Import necessary modules and types
import { Wireframe, WireframeVersion, WireframeSourceData } from "@/types/wireframe";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { toStringArray } from '@/utils/type-guards';

/**
 * Service for managing wireframe version control.
 * This service provides methods for creating, retrieving, updating, and comparing wireframe versions.
 */
export class WireframeVersionControlService {
  /**
   * Creates a new version of a wireframe.
   * @param wireframeId The ID of the wireframe.
   * @param sourceData The source data of the wireframe.
   * @param userId The ID of the user creating the version.
   * @returns The created wireframe version.
   */
  static async createWireframeVersion(
    wireframeId: string,
    sourceData: WireframeSourceData,
    userId: string
  ): Promise<WireframeVersion> {
    const versionId = uuidv4();
    const now = new Date();

    const newVersion: WireframeVersion = {
      id: versionId,
      wireframeId: wireframeId,
      versionNumber: 1, // Initial version number, will be updated later
      sourceData: sourceData,
      createdAt: now,
      createdBy: userId,
      updatedAt: now,
      updatedBy: userId,
      isCurrent: true,
      message: sourceData.message || 'Initial version',
      tags: toStringArray(sourceData.tags || []),
    };

    // Insert the new version into the database
    const { data, error } = await supabase
      .from('wireframe_versions')
      .insert([newVersion])
      .select('*')
      .single();

    if (error) {
      console.error("Error creating wireframe version:", error);
      throw new Error("Failed to create wireframe version");
    }

    // Update the version number and set the new version as current
    await this.updateVersionMetadata(wireframeId, versionId);

    return data as WireframeVersion;
  }

  /**
   * Retrieves a wireframe version by its ID.
   * @param versionId The ID of the wireframe version.
   * @returns The wireframe version, or null if not found.
   */
  static async getWireframeVersion(versionId: string): Promise<WireframeVersion | null> {
    const { data, error } = await supabase
      .from('wireframe_versions')
      .select('*')
      .eq('id', versionId)
      .single();

    if (error) {
      console.error("Error fetching wireframe version:", error);
      return null;
    }

    return data as WireframeVersion | null;
  }

  /**
   * Retrieves all versions of a wireframe.
   * @param wireframeId The ID of the wireframe.
   * @returns An array of wireframe versions.
   */
  static async getWireframeVersions(wireframeId: string): Promise<WireframeVersion[]> {
    const { data, error } = await supabase
      .from('wireframe_versions')
      .select('*')
      .eq('wireframeId', wireframeId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error("Error fetching wireframe versions:", error);
      return [];
    }

    return data as WireframeVersion[];
  }

  /**
   * Updates a wireframe version.
   * @param versionId The ID of the wireframe version to update.
   * @param sourceData The updated source data.
   * @param userId The ID of the user updating the version.
   * @returns The updated wireframe version, or null if the update fails.
   */
  static async updateWireframeVersion(
    versionId: string,
    sourceData: WireframeSourceData,
    userId: string
  ): Promise<WireframeVersion | null> {
    const now = new Date();

    const updatedVersion: Partial<WireframeVersion> = {
      sourceData: sourceData,
      updatedAt: now,
      updatedBy: userId,
      message: sourceData.message || 'Updated version',
      tags: toStringArray(sourceData.tags || []),
    };

    const { data, error } = await supabase
      .from('wireframe_versions')
      .update(updatedVersion)
      .eq('id', versionId)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating wireframe version:", error);
      return null;
    }

    return data as WireframeVersion | null;
  }

  /**
   * Restores a wireframe to a specific version.
   * @param wireframeId The ID of the wireframe.
   * @param versionId The ID of the version to restore to.
   * @param userId The ID of the user restoring the version.
   * @returns The restored wireframe version, or null if the restoration fails.
   */
  static async restoreWireframeVersion(
    wireframeId: string,
    versionId: string,
    userId: string
  ): Promise<WireframeVersion | null> {
    // Get the wireframe version to restore
    const versionToRestore = await this.getWireframeVersion(versionId);
    if (!versionToRestore) {
      console.error("Version not found");
      return null;
    }

    // Create a new version with the source data of the restored version
    const restoredVersion = await this.createWireframeVersion(
      wireframeId,
      versionToRestore.sourceData,
      userId
    );

    return restoredVersion;
  }

  /**
   * Compares two wireframe versions and returns the differences.
   * @param versionId1 The ID of the first wireframe version.
   * @param versionId2 The ID of the second wireframe version.
   * @returns An object containing the differences between the two versions.
   */
  static async compareVersions(versionId1: string, versionId2: string): Promise<WireframeVersionDiff> {
    try {
      const { data, error } = await supabase.functions.invoke('compare-wireframe-versions', {
        body: { version_id_1: versionId1, version_id_2: versionId2 }
      });
      
      if (error) {
        console.error('Error comparing versions:', error);
        throw new Error(`Failed to compare versions: ${error.message}`);
      }
      
      // Use toStringArray to ensure we get string arrays
      return {
        added: toStringArray(data.added || []),
        removed: toStringArray(data.removed || []),
        modified: toStringArray(data.modified || [])
      };
    } catch (error) {
      console.error('Error in compareVersions:', error);
      throw error;
    }
  }

  /**
   * Deeply compares two objects and returns the differences.
   * @param obj1 The first object.
   * @param obj2 The second object.
   * @returns An object containing the differences between the two objects.
   */
  private static deepCompare(obj1: any, obj2: any): any {
    const diff: any = {};

    for (const key in obj1) {
      if (!(key in obj2)) {
        diff[key] = {
          oldValue: obj1[key],
          newValue: undefined,
        };
      } else if (typeof obj1[key] === 'object' && obj1[key] !== null && obj2[key] !== null) {
        const nestedDiff = this.deepCompare(obj1[key], obj2[key]);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
      } else if (obj1[key] !== obj2[key]) {
        diff[key] = {
          oldValue: obj1[key],
          newValue: obj2[key],
        };
      }
    }

    for (const key in obj2) {
      if (!(key in obj1)) {
        diff[key] = {
          oldValue: undefined,
          newValue: obj2[key],
        };
      }
    }

    return diff;
  }

  /**
   * Updates the version number and sets the new version as current.
   * @param wireframeId The ID of the wireframe.
   * @param versionId The ID of the new version.
   */
  private static async updateVersionMetadata(wireframeId: string, versionId: string): Promise<void> {
    // Get the current max version number
    const { data: maxVersionData, error: maxVersionError } = await supabase
      .from('wireframe_versions')
      .select('versionNumber')
      .eq('wireframeId', wireframeId)
      .order('versionNumber', { ascending: false })
      .limit(1);

    if (maxVersionError) {
      console.error("Error fetching max version number:", maxVersionError);
      throw new Error("Failed to fetch max version number");
    }

    const currentMaxVersion = maxVersionData && maxVersionData.length > 0 ? maxVersionData[0].versionNumber : 0;
    const newVersionNumber = currentMaxVersion + 1;

    // Update the new version with the new version number
    const { error: updateError } = await supabase
      .from('wireframe_versions')
      .update({ versionNumber: newVersionNumber, isCurrent: true })
      .eq('id', versionId);

    if (updateError) {
      console.error("Error updating version number:", updateError);
      throw new Error("Failed to update version number");
    }

    // Set all other versions to not current
    const { error: resetError } = await supabase
      .from('wireframe_versions')
      .update({ isCurrent: false })
      .eq('wireframeId', wireframeId)
      .neq('id', versionId);

    if (resetError) {
      console.error("Error resetting isCurrent flag:", resetError);
      throw new Error("Failed to reset isCurrent flag");
    }
  }

  /**
   * Deletes a wireframe version by its ID.
   * @param versionId The ID of the wireframe version to delete.
   * @returns True if the deletion was successful, false otherwise.
   */
  static async deleteWireframeVersion(versionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('wireframe_versions')
      .delete()
      .eq('id', versionId);

    if (error) {
      console.error("Error deleting wireframe version:", error);
      return false;
    }

    return true;
  }
}

export const wireframeVersionControl = new WireframeVersionControlService();
