
import { industryTemplateService } from '../industry-templates';
import { WireframeVersionControlService } from '../version-control/wireframe-version-control-service';

/**
 * Service for template and version management
 */
export const WireframeTemplateService = {
  /**
   * Get available industry templates
   */
  getIndustryTemplates: (industry?: string) => {
    if (industry) {
      return industryTemplateService.getTemplatesForIndustry(industry);
    }
    return industryTemplateService.getAllTemplates();
  },
  
  /**
   * Get wireframe version history
   */
  getWireframeVersionHistory: (wireframeId: string) => {
    return WireframeVersionControlService.getVersionHistory(wireframeId);
  },
  
  /**
   * Revert to a specific wireframe version
   */
  revertToVersion: (versionId: string, userId: string) => {
    return WireframeVersionControlService.revertToVersion(versionId, userId);
  }
};
