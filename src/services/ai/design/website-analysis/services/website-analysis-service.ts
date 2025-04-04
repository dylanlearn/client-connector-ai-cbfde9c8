
import { WebsiteAnalysisResult, SectionType } from '../types';
import { DefaultsService } from './defaults-service';
import { AnalysisService } from './analysis-service';
import { StorageService } from './storage-service';

/**
 * Main service for analyzing website design patterns
 * Acts as a facade for the underlying services
 */
export const WebsiteAnalysisService = {
  /**
   * Store a website analysis result
   */
  storeWebsiteAnalysis: StorageService.storeWebsiteAnalysis,

  /**
   * Analyze a website pattern and structure the data
   */
  analyzeWebsitePattern: AnalysisService.analyzeWebsitePattern,

  /**
   * Analyze a specific section of a website
   */
  analyzeWebsiteSection: async (
    section: SectionType,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']> = {},
    contentStructure: Partial<WebsiteAnalysisResult['contentStructure']> = {},
    source: string,
    imageUrl?: string
  ): Promise<WebsiteAnalysisResult> => {
    // Map section to category
    const categoryMap = DefaultsService.getSectionCategoryMap();
    const category = categoryMap[section] || `section-${section}`;
    
    // Generate sensible default values based on the section type
    const sectionDefaults = DefaultsService.getDefaultsForSection(section);

    // Convert contentStructure to contentAnalysis for compatibility
    const contentAnalysis = contentStructure as unknown as Partial<WebsiteAnalysisResult['contentAnalysis']>;

    return AnalysisService.analyzeWebsitePattern(
      `${section.charAt(0).toUpperCase() + section.slice(1)} Section Analysis - ${source}`,
      description,
      category,
      { ...sectionDefaults.visualElements, ...visualElements } as WebsiteAnalysisResult['visualElements'],
      sectionDefaults.userExperience as WebsiteAnalysisResult['userExperience'],
      { ...sectionDefaults.contentAnalysis, ...contentAnalysis } as WebsiteAnalysisResult['contentAnalysis'],
      sectionDefaults.targetAudience || [],
      [...(sectionDefaults.tags || []), section],
      source,
      imageUrl
    );
  }
};
