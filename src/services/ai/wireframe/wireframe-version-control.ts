
import { supabase } from "@/integrations/supabase/client";
import { AIWireframe, WireframeData } from './wireframe-types';

export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  created_at: string;
  created_by: string;
  data: WireframeData;
  change_description: string;
  is_current: boolean;
  parent_version_id?: string;
  branch_name?: string;
}

export interface WireframeRevisionHistory {
  versions: WireframeVersion[];
  current: WireframeVersion | null;
  branches: string[];
}

export interface BranchInfo {
  name: string;
  created_at: string;
  version_count: number;
  latest_version_id: string;
}

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
      // Get the latest version number for this wireframe
      const { data: versions, error: versionError } = await supabase
        .from('wireframe_versions')
        .select('version_number')
        .eq('wireframe_id', wireframeId)
        .eq('branch_name', branchName)
        .order('version_number', { ascending: false })
        .limit(1);
      
      if (versionError) {
        console.error("Error fetching last version:", versionError);
        throw versionError;
      }
      
      // Calculate next version number
      const nextVersion = versions && versions.length > 0 
        ? versions[0].version_number + 1 
        : 1;
      
      // If this is a new version on the main branch, set all previous versions as not current
      if (branchName === "main") {
        const { error: updateError } = await supabase
          .from('wireframe_versions')
          .update({ is_current: false })
          .eq('wireframe_id', wireframeId)
          .eq('branch_name', branchName);
        
        if (updateError) {
          console.error("Error updating previous versions:", updateError);
        }
      }
      
      // Insert the new version
      const { data: newVersion, error: insertError } = await supabase
        .from('wireframe_versions')
        .insert({
          wireframe_id: wireframeId,
          version_number: nextVersion,
          data: data as any, // Type assertion for supabase json
          change_description: changeDescription,
          created_by: userId,
          is_current: true,
          parent_version_id: parentVersionId,
          branch_name: branchName
        })
        .select('*')
        .single();
      
      if (insertError) {
        console.error("Error creating wireframe version:", insertError);
        throw insertError;
      }
      
      // Update the main wireframe to reference this version's data
      if (branchName === "main") {
        const { error: wireframeUpdateError } = await supabase
          .from('ai_wireframes')
          .update({
            generation_params: {
              ...data,
              latest_version_id: newVersion.id
            }
          })
          .eq('id', wireframeId);
        
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
      const { data: versions, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Find current version
      const current = versions.find(version => version.is_current && version.branch_name === "main") || null;
      
      // Find all unique branches
      const branches = Array.from(new Set(versions.map(v => v.branch_name)));
      
      return {
        versions: versions as unknown as WireframeVersion[],
        current: current as unknown as WireframeVersion,
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
      const { data: version, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('id', versionId)
        .single();
      
      if (error) {
        throw error;
      }
      
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
      const { data: version, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('id', versionId)
        .single();
      
      if (error) {
        throw error;
      }
      
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
      const { data: branchVersion, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('id', branchVersionId)
        .single();
      
      if (error) {
        throw error;
      }
      
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
      const { data: versions, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('wireframe_id', wireframeId);
      
      if (error) {
        throw error;
      }
      
      const branchMap = new Map<string, BranchInfo>();
      
      // Group by branch name
      versions.forEach(version => {
        const branchName = version.branch_name || 'main';
        
        if (!branchMap.has(branchName)) {
          branchMap.set(branchName, {
            name: branchName,
            created_at: version.created_at,
            version_count: 1,
            latest_version_id: version.id
          });
        } else {
          const branch = branchMap.get(branchName)!;
          branch.version_count += 1;
          
          // Check if this version is newer
          if (new Date(version.created_at) > new Date(branch.created_at)) {
            branch.latest_version_id = version.id;
          }
        }
      });
      
      return Array.from(branchMap.values());
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
  ): Promise<{ 
    changes: { type: 'added' | 'removed' | 'modified', path: string, values: [any, any] }[],
    summary: string
  }> => {
    try {
      // Fetch both versions
      const { data: versions, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .in('id', [versionId1, versionId2]);
      
      if (error || versions.length !== 2) {
        throw error || new Error("Could not find both versions");
      }
      
      // Get data from both versions for comparison
      const v1 = versions[0].data;
      const v2 = versions[1].data;
      
      // Perform a deep comparison (simplified version)
      const changes = compareObjects(v1, v2);
      
      // Generate a summary of changes
      const summary = generateChangeSummary(changes);
      
      return { changes, summary };
    } catch (error) {
      console.error("Error comparing wireframe versions:", error);
      return { changes: [], summary: "Could not compare versions due to an error." };
    }
  }
};

/**
 * Helper function to compare two objects and find differences
 */
function compareObjects(
  obj1: any,
  obj2: any,
  path: string = ''
): { type: 'added' | 'removed' | 'modified', path: string, values: [any, any] }[] {
  const changes: { type: 'added' | 'removed' | 'modified', path: string, values: [any, any] }[] = [];
  
  // Simple implementation for demonstration
  // In a real app, this would be a more sophisticated deep comparison
  
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
    // Simple array comparison (not tracking moved items)
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
  
  // Compare object properties
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

/**
 * Generate a human-readable summary of changes
 */
function generateChangeSummary(
  changes: { type: 'added' | 'removed' | 'modified', path: string, values: [any, any] }[]
): string {
  if (changes.length === 0) {
    return "No changes detected between versions.";
  }
  
  const added = changes.filter(c => c.type === 'added').length;
  const removed = changes.filter(c => c.type === 'removed').length;
  const modified = changes.filter(c => c.type === 'modified').length;
  
  let summary = `${changes.length} changes detected: `;
  
  const parts = [];
  if (added) parts.push(`${added} additions`);
  if (removed) parts.push(`${removed} removals`);
  if (modified) parts.push(`${modified} modifications`);
  
  summary += parts.join(', ');
  
  // Add details about significant changes
  const significantChanges = changes.filter(c => {
    // Focus on high-level structure changes
    return c.path.split('.').length <= 2 || 
           c.path.includes('sections') || 
           c.path.includes('title') ||
           c.path.includes('layout');
  }).slice(0, 3);
  
  if (significantChanges.length > 0) {
    summary += ". Key changes include: ";
    summary += significantChanges
      .map(c => {
        switch (c.type) {
          case 'added':
            return `Added ${c.path.split('.').pop()}`;
          case 'removed':
            return `Removed ${c.path.split('.').pop()}`;
          case 'modified':
            return `Changed ${c.path.split('.').pop()}`;
        }
      })
      .join(', ');
    
    if (significantChanges.length < changes.length) {
      summary += `, and ${changes.length - significantChanges.length} other changes`;
    }
  }
  
  return summary;
}
