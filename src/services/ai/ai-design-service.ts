
import { 
  AIColorService, 
  AITypographyService, 
  AILayoutService, 
  AIComponentService,
  AIAccessibilityService
} from './design';
import { AIDesignAnalysisService } from './design/ai-design-analysis-service';
import { ModernLayoutService } from './design/modern-layout-service';
import { LandBookService } from './design/land-book-service';
import { PatternRecognitionService } from './design/pattern-recognition-service';

export type { ColorPaletteOptions } from './design/color-service';
export type { LayoutRecommendationOptions } from './design/layout-service';
export type { DesignAnalysisRequest, DesignAnalysisResponse } from './design/ai-design-analysis-service';
export type { DesignMemoryEntry, DesignMemoryQueryOptions } from './design/design-memory-service';
export type { ModernLayoutRecommendation } from './design/modern-layout-service';
export type { 
  LandBookQueryOptions, 
  LandBookAnalysis, 
  LandBookPaginatedResult 
} from './design/land-book-service';
export type { 
  PatternRecognitionResult, 
  PatternFeatureVector, 
  PatternRecognitionOptions 
} from './design/pattern-recognition-service';
export type { DesignInsight } from './design/types/design-insight-types';

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
  storeDesignAnalysis: AIDesignAnalysisService.storeAnalysisResult,
  
  // Modern conversion-optimized layouts
  modernLayouts: {
    getAll: ModernLayoutService.getAllPatterns,
    getById: ModernLayoutService.getPatternById,
    recommendForIndustry: ModernLayoutService.recommendLayoutsForIndustry
  },
  
  // Land-book inspired design patterns
  landBook: {
    queryPatterns: LandBookService.queryPatterns,
    getPatternsForIndustry: LandBookService.getPatternsForIndustry,
    getDesignAnalysis: LandBookService.getDesignAnalysis,
    clearCache: LandBookService.clearCache,
    setCacheEnabled: LandBookService.setCacheEnabled
  },
  
  // Automatic pattern recognition
  patternRecognition: {
    identifyPattern: PatternRecognitionService.identifyPattern,
    extractFeatures: PatternRecognitionService.extractFeaturesFromMemory,
    findSimilarPatterns: PatternRecognitionService.findSimilarPatterns,
    learnFromFeedback: PatternRecognitionService.learnFromFeedback
  }
};
