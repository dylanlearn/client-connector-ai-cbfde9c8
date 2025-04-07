
import { createHash } from 'crypto';
import { 
  WireframeGenerationParams, 
  WireframeData, 
  WireframeGenerationResult 
} from './wireframe-types';

/**
 * Service for caching wireframe generation requests and results
 */
export class WireframeCacheService {
  /**
   * Generate a cache key for wireframe generation parameters
   */
  static generateCacheKey(params: WireframeGenerationParams): string {
    // Extract the parameters that affect the wireframe generation result
    const keyParams: Record<string, any> = {
      description: params.description || '',
      industry: params.industry || '',
      pageType: params.pageType || '',
      style: params.style || '',
      colorTheme: params.colorTheme || '',
      complexity: params.complexity || 'moderate',
      creativityLevel: params.creativityLevel || 8,
      enhancedCreativity: params.enhancedCreativity || false
    };
    
    // Add special handling for multi-page layouts
    if (params.multiPageLayout) {
      keyParams.multiPageLayout = true;
      keyParams.pages = params.pages || 1;
    }
    
    // Add specific component types if specified
    if (params.componentTypes && params.componentTypes.length > 0) {
      keyParams.componentTypes = params.componentTypes.join(',');
    }
    
    // Add moodboard selections if included
    if (params.moodboardSelections && params.moodboardSelections.length > 0) {
      keyParams.moodboardSelections = params.moodboardSelections.join(',');
    }
    
    // Create a JSON string from the parameters
    const paramString = JSON.stringify(keyParams);
    
    // Return SHA-256 hash of the parameter string
    return createHash('sha256')
      .update(paramString)
      .digest('hex');
  }
  
  /**
   * Check if the wireframe data requires regeneration based on parameter changes
   */
  static requiresRegeneration(
    currentParams: WireframeGenerationParams,
    previousParams: WireframeGenerationParams
  ): boolean {
    // Compare critical parameters that would require regeneration
    const criticalChanges = [
      currentParams.description !== previousParams.description,
      currentParams.industry !== previousParams.industry,
      currentParams.pageType !== previousParams.pageType,
      currentParams.complexity !== previousParams.complexity,
      currentParams.style !== previousParams.style,
      currentParams.colorTheme !== previousParams.colorTheme
    ];
    
    // If multi-page layout is involved, check page count
    if (currentParams.multiPageLayout || previousParams.multiPageLayout) {
      criticalChanges.push(
        currentParams.multiPageLayout !== previousParams.multiPageLayout ||
        (currentParams.pages || 0) !== (previousParams.pages || 0)
      );
    }
    
    return criticalChanges.some(change => change === true);
  }
  
  /**
   * Compare two wireframes to calculate similarity score
   */
  static calculateSimilarityScore(wireframe1: WireframeData, wireframe2: WireframeData): number {
    let score = 0;
    let totalFactors = 0;
    
    // Check section count similarity
    const sectionCountSimilarity = 
      Math.min(wireframe1.sections.length, wireframe2.sections.length) / 
      Math.max(wireframe1.sections.length, wireframe2.sections.length);
    score += sectionCountSimilarity;
    totalFactors++;
    
    // Check multi-page similarity if applicable
    const hasPages1 = !!(wireframe1.pages && wireframe1.pages.length > 0);
    const hasPages2 = !!(wireframe2.pages && wireframe2.pages.length > 0);
    
    if (hasPages1 && hasPages2) {
      const pageCountSimilarity =
        Math.min((wireframe1.pages || []).length, (wireframe2.pages || []).length) /
        Math.max((wireframe1.pages || []).length, (wireframe2.pages || []).length);
      score += pageCountSimilarity;
      totalFactors++;
    }
    
    // Calculate section type similarity
    const sectionTypes1 = wireframe1.sections.map(s => s.sectionType);
    const sectionTypes2 = wireframe2.sections.map(s => s.sectionType);
    
    const commonSectionTypes = sectionTypes1.filter(type => sectionTypes2.includes(type));
    const sectionTypeSimilarity = 
      commonSectionTypes.length / Math.max(sectionTypes1.length, sectionTypes2.length);
    
    score += sectionTypeSimilarity;
    totalFactors++;
    
    // Return average score (scale 0-1)
    return score / totalFactors;
  }
}
