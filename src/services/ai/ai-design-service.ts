
import { 
  AIColorService, 
  AITypographyService, 
  AILayoutService, 
  AIComponentService,
  AIAccessibilityService
} from './design';
import { AIDesignAnalysisService } from './design/ai-design-analysis-service';

export type { ColorPaletteOptions } from './design/color-service';
export type { LayoutRecommendationOptions } from './design/layout-service';
export type { DesignAnalysisRequest, DesignAnalysisResponse } from './design/ai-design-analysis-service';

/**
 * Unified service for AI-powered design recommendations
 */
export const AIDesignService = {
  // Color palette suggestions
  suggestColorPalette: AIColorService.suggestColorPalette,
  
  // Typography recommendations
  suggestTypography: AITypographyService.suggestTypography,
  
  // Layout structure recommendations
  recommendLayouts: AILayoutService.recommendLayouts,
  
  // Component suggestions
  suggestComponents: AIComponentService.suggestComponents,
  
  // Accessibility guidelines
  generateAccessibilityGuidelines: AIAccessibilityService.generateAccessibilityGuidelines,
  
  // Design pattern analysis
  analyzeDesignPattern: AIDesignAnalysisService.analyzeDesignPattern,
  
  // Store design analysis
  storeDesignAnalysis: AIDesignAnalysisService.storeAnalysisResult
};
