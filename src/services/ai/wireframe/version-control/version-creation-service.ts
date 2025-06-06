import { BaseVersionService } from './base-version-service';
import { WireframeData } from '../wireframe-types';
import { WireframeVersion, VersionCreationOptions } from './types';

/**
 * Service for creating new wireframe versions
 */
export class VersionCreationService extends BaseVersionService {
  /**
   * Create a new version of a wireframe
   */
  createVersion(
    wireframeId: string,
    versionData: WireframeData,
    options?: {
      parentVersionId?: string;
      versionNumber?: number;
      changeDescription?: string;
      branchName?: string;
      createdBy?: string;
    }
  ): Promise<WireframeVersion> {
    // Implementation that internally uses the options parameter format
    const createOptions: VersionCreationOptions = {
      wireframeId,
      data: versionData,
      ...options
    };
    
    return this.createVersionInternal(createOptions);
  }
  
  private async createVersionInternal(options: VersionCreationOptions): Promise<WireframeVersion> {
    try {
      // Get the latest version number for this wireframe
      const versionNumber = await this.getNextVersionNumber(options.wireframeId);
      
      // Create the new version
      const version = await super.createVersion(
        options.wireframeId,
        options.data,
        {
          parentVersionId: options.parentVersionId,
          versionNumber,
          changeDescription: options.changeDescription,
          branchName: options.branchName || 'main',
          createdBy: options.createdBy
        }
      );
      
      // In a real implementation, mark previous versions as not current
      console.log(`Created version ${versionNumber} for wireframe ${options.wireframeId}`);
      
      return version;
    } catch (error: any) {
      console.error('Error creating version:', error);
      throw new Error(`Failed to create version: ${error.message}`);
    }
  }
  
  /**
   * Get the next version number for a wireframe
   */
  private async getNextVersionNumber(wireframeId: string): Promise<number> {
    try {
      // In a real implementation, query the database for the latest version number
      // For demonstration, return a simple number
      return 1;
    } catch (error: any) {
      console.error('Error getting next version number:', error);
      throw new Error(`Failed to get next version number: ${error.message}`);
    }
  }
}

// Create a singleton instance
const versionCreationService = new VersionCreationService();
export default versionCreationService;
