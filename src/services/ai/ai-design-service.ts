
import { 
  AIColorService, 
  AITypographyService, 
  AILayoutService, 
  AIComponentService,
  AIAccessibilityService
} from './design';

export type { ColorPaletteOptions } from './design/color-service';
export type { LayoutRecommendationOptions } from './design/layout-service';

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
  generateAccessibilityGuidelines: AIAccessibilityService.generateAccessibilityGuidelines
};
