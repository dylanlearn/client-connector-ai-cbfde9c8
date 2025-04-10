
import { WireframeData } from '../wireframe-types';
import { WireframeVersion } from './types';

/**
 * Base service for wireframe version control functionality
 */
export class BaseVersionService {
  /**
   * Create a new version of a wireframe
   */
  protected async createVersion(
    wireframeId: string,
    versionData: WireframeData,
    options: {
      parentVersionId?: string;
      versionNumber?: number;
      changeDescription?: string;
      branchName?: string;
      createdBy?: string;
    } = {}
  ): Promise<WireframeVersion> {
    try {
      const now = new Date().toISOString();
      
      // Create the new version object
      const version: WireframeVersion = {
        id: `v_${Date.now()}`, // Simple ID for demonstration
        wireframe_id: wireframeId,
        version_number: options.versionNumber || 1,
        data: versionData,
        parent_version_id: options.parentVersionId,
        created_at: now,
        created_by: options.createdBy || 'system',
        change_description: options.changeDescription || 'New version created',
        is_current: true
      };
      
      // In a real implementation, store this in the database
      console.log('Created new version:', version);
      
      return version;
    } catch (error) {
      console.error('Error creating version:', error);
      throw new Error(`Failed to create version: ${error.message}`);
    }
  }
  
  /**
   * Compare two wireframe versions
   */
  protected compareVersions(
    version1: WireframeVersion,
    version2: WireframeVersion
  ): { changes: string[]; summary: string } {
    // Simple implementation for demonstration
    const changes: string[] = [];
    let sectionsAdded = 0;
    let sectionsRemoved = 0;
    
    // Compare section counts
    const v1SectionCount = version1.data.sections?.length || 0;
    const v2SectionCount = version2.data.sections?.length || 0;
    
    if (v1SectionCount !== v2SectionCount) {
      if (v1SectionCount < v2SectionCount) {
        sectionsAdded = v2SectionCount - v1SectionCount;
        changes.push(`Added ${sectionsAdded} section(s)`);
      } else {
        sectionsRemoved = v1SectionCount - v2SectionCount;
        changes.push(`Removed ${sectionsRemoved} section(s)`);
      }
    }
    
    // Check if titles are different
    if (version1.data.title !== version2.data.title) {
      changes.push('Title changed');
    }
    
    // Check if descriptions are different
    if (version1.data.description !== version2.data.description) {
      changes.push('Description changed');
    }
    
    // Generate a summary
    let summary = changes.length > 0 
      ? `${changes.length} change(s): ${changes.join(', ')}` 
      : 'No significant changes detected';
    
    return {
      changes,
      summary
    };
  }
}
