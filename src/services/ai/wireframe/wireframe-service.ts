
import { WireframeGeneratorService } from './generator/wireframe-generator-service';
import { WireframeDataService } from './data/wireframe-data-service';
import { WireframeFeedbackService } from './feedback/wireframe-feedback-service';
import { WireframeManagementService } from './management/wireframe-management-service';
import { WireframeTemplateService } from './templates/wireframe-template-service';

/**
 * Main wireframe service that composes functionality from specialized services
 */
export const WireframeService = {
  // Generation methods
  generateWireframe: WireframeGeneratorService.generateWireframe,
  
  // Data access methods
  extractWireframeData: WireframeDataService.extractWireframeData,
  getProjectWireframes: WireframeDataService.getProjectWireframes,
  getWireframe: WireframeDataService.getWireframe,
  
  // Feedback methods
  updateWireframeFeedback: WireframeFeedbackService.updateWireframeFeedback,
  
  // Management methods
  updateWireframe: WireframeManagementService.updateWireframe,
  applyTemplateToWireframe: WireframeManagementService.applyTemplateToWireframe,
  deleteWireframe: WireframeManagementService.deleteWireframe,
  
  // Template and version methods
  getIndustryTemplates: WireframeTemplateService.getIndustryTemplates,
  getWireframeVersionHistory: WireframeTemplateService.getWireframeVersionHistory,
  revertToVersion: WireframeTemplateService.revertToVersion,
};
