
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export interface ContentAnalysisMetrics {
  readabilityScore: number; // 0-100
  scannabilityScore: number; // 0-100
  hierarchyScore: number; // 0-100
  overallScore: number; // 0-100
  contentDensity: 'light' | 'optimal' | 'dense';
  headingStructure: 'good' | 'needs-improvement' | 'poor';
}

export interface SectionContentAnalysis {
  sectionId: string;
  name: string;
  metrics: ContentAnalysisMetrics;
  issues: Array<{
    id: string;
    type: 'critical' | 'warning' | 'suggestion';
    description: string;
  }>;
  suggestions: Array<{
    id: string;
    description: string;
    before?: string;
    after?: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}

export interface ContentStructureAnalysis {
  overallMetrics: ContentAnalysisMetrics;
  sectionAnalyses: SectionContentAnalysis[];
  globalSuggestions: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: 'readability' | 'hierarchy' | 'scannability' | 'structure';
  }>;
  improvementPotential: number; // 0-100
}

interface UseContentStructureAnalysisOptions {
  showToasts?: boolean;
}

export function useContentStructureAnalysis({ showToasts = true }: UseContentStructureAnalysisOptions = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentAnalysis, setContentAnalysis] = useState<ContentStructureAnalysis | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Analyze the content structure of a wireframe
   */
  const analyzeContentStructure = useCallback(async (
    wireframe: WireframeData
  ): Promise<ContentStructureAnalysis | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll create a mock analysis based on the wireframe sections
      
      const sections = wireframe.sections || [];
      
      // Generate mock section analyses
      const sectionAnalyses: SectionContentAnalysis[] = sections.map(section => {
        return {
          sectionId: section.id,
          name: section.name || 'Unnamed Section',
          metrics: generateMockMetrics(section),
          issues: generateMockIssues(section),
          suggestions: generateMockSuggestions(section)
        };
      });
      
      // Calculate overall metrics as an average of section metrics
      const overallMetrics = calculateOverallMetrics(sectionAnalyses.map(sa => sa.metrics));
      
      // Generate mock analysis result
      const mockAnalysis: ContentStructureAnalysis = {
        overallMetrics,
        sectionAnalyses,
        globalSuggestions: generateGlobalSuggestions(wireframe),
        improvementPotential: calculateImprovementPotential(overallMetrics)
      };
      
      setContentAnalysis(mockAnalysis);

      if (showToasts) {
        toast.success('Content structure analysis completed');
      }
      
      return mockAnalysis;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error analyzing content structure');
      setError(error);
      
      if (showToasts) {
        toast.error(`Analysis error: ${error.message}`);
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [showToasts]);
  
  /**
   * Apply a content recommendation to improve the wireframe
   */
  const applyContentRecommendation = useCallback(async (
    wireframe: WireframeData,
    recommendationId: string,
    sectionId?: string
  ): Promise<WireframeData> => {
    // In a real implementation, this would modify the wireframe content based on the recommendation
    // For now, we'll return the unmodified wireframe
    
    if (showToasts) {
      toast.success(`Applied content recommendation successfully`);
    }
    
    return wireframe;
  }, [showToasts]);
  
  return {
    isAnalyzing,
    contentAnalysis,
    error,
    analyzeContentStructure,
    applyContentRecommendation
  };
}

// Helper functions for mock data

function generateMockMetrics(section: WireframeSection): ContentAnalysisMetrics {
  // Generate mock metrics based on section type and content
  const sectionType = section.sectionType?.toLowerCase() || '';
  const hasHeadings = section.components?.some(c => 
    c.type?.includes('heading') || c.type?.includes('title'));
  
  // Base scores that we'll adjust
  let readability = 75;
  let scannability = 70;
  let hierarchy = 65;
  
  // Adjust based on section type
  if (sectionType.includes('hero')) {
    scannability += 15;
  } else if (sectionType.includes('text') || sectionType.includes('content')) {
    readability -= 10;
  } else if (sectionType.includes('features') || sectionType.includes('cards')) {
    scannability += 10;
  }
  
  // Adjust based on component presence
  if (hasHeadings) {
    hierarchy += 15;
    scannability += 10;
  }
  
  // Ensure scores are within 0-100 range
  readability = Math.max(0, Math.min(100, readability));
  scannability = Math.max(0, Math.min(100, scannability));
  hierarchy = Math.max(0, Math.min(100, hierarchy));
  
  // Calculate overall score as weighted average
  const overallScore = Math.round((readability * 0.4) + (scannability * 0.3) + (hierarchy * 0.3));
  
  // Determine content density
  const density = overallScore > 80 ? 'optimal' : overallScore > 60 ? 'light' : 'dense';
  
  // Determine heading structure quality
  const headingStructure = hasHeadings ? 'good' : 'poor';
  
  return {
    readabilityScore: readability,
    scannabilityScore: scannability,
    hierarchyScore: hierarchy,
    overallScore,
    contentDensity: density as 'light' | 'optimal' | 'dense',
    headingStructure: headingStructure as 'good' | 'needs-improvement' | 'poor'
  };
}

function generateMockIssues(section: WireframeSection): any[] {
  const issues = [];
  const sectionType = section.sectionType?.toLowerCase() || '';
  
  // Check for common issues based on section type
  if (sectionType.includes('text') || sectionType.includes('content')) {
    issues.push({
      id: `issue-${section.id}-1`,
      type: 'warning',
      description: 'Text blocks are too long, consider breaking them into smaller chunks'
    });
  }
  
  if (!section.components?.some(c => c.type?.includes('heading'))) {
    issues.push({
      id: `issue-${section.id}-2`,
      type: 'critical',
      description: 'Missing heading structure, add clear headings for better hierarchy'
    });
  }
  
  // Always add at least one suggestion
  if (issues.length === 0) {
    issues.push({
      id: `issue-${section.id}-3`,
      type: 'suggestion',
      description: 'Consider adding bullet points or numbered lists for better scannability'
    });
  }
  
  return issues;
}

function generateMockSuggestions(section: WireframeSection): any[] {
  return [
    {
      id: `suggestion-${section.id}-1`,
      description: 'Add subheadings to break up content',
      impact: 'high' as const
    },
    {
      id: `suggestion-${section.id}-2`,
      description: 'Use bullet points for key benefits',
      before: 'Our service offers speed, reliability, and excellent customer support.',
      after: 'Our service offers:\n• Speed\n• Reliability\n• Excellent customer support',
      impact: 'medium' as const
    }
  ];
}

function calculateOverallMetrics(sectionMetrics: ContentAnalysisMetrics[]): ContentAnalysisMetrics {
  if (sectionMetrics.length === 0) {
    return {
      readabilityScore: 50,
      scannabilityScore: 50,
      hierarchyScore: 50,
      overallScore: 50,
      contentDensity: 'optimal',
      headingStructure: 'needs-improvement'
    };
  }
  
  // Calculate averages
  const readabilityScore = Math.round(
    sectionMetrics.reduce((sum, m) => sum + m.readabilityScore, 0) / sectionMetrics.length
  );
  
  const scannabilityScore = Math.round(
    sectionMetrics.reduce((sum, m) => sum + m.scannabilityScore, 0) / sectionMetrics.length
  );
  
  const hierarchyScore = Math.round(
    sectionMetrics.reduce((sum, m) => sum + m.hierarchyScore, 0) / sectionMetrics.length
  );
  
  const overallScore = Math.round(
    sectionMetrics.reduce((sum, m) => sum + m.overallScore, 0) / sectionMetrics.length
  );
  
  // Determine majority vote for categorical values
  const densityCounts = {
    light: sectionMetrics.filter(m => m.contentDensity === 'light').length,
    optimal: sectionMetrics.filter(m => m.contentDensity === 'optimal').length,
    dense: sectionMetrics.filter(m => m.contentDensity === 'dense').length
  };
  
  const contentDensity = 
    densityCounts.light > densityCounts.optimal && densityCounts.light > densityCounts.dense ? 'light' :
    densityCounts.dense > densityCounts.optimal && densityCounts.dense > densityCounts.light ? 'dense' : 'optimal';
  
  const headingCounts = {
    good: sectionMetrics.filter(m => m.headingStructure === 'good').length,
    needs: sectionMetrics.filter(m => m.headingStructure === 'needs-improvement').length,
    poor: sectionMetrics.filter(m => m.headingStructure === 'poor').length
  };
  
  const headingStructure =
    headingCounts.good > headingCounts.needs && headingCounts.good > headingCounts.poor ? 'good' :
    headingCounts.poor > headingCounts.needs && headingCounts.poor > headingCounts.good ? 'poor' : 'needs-improvement';
  
  return {
    readabilityScore,
    scannabilityScore,
    hierarchyScore,
    overallScore,
    contentDensity: contentDensity as 'light' | 'optimal' | 'dense',
    headingStructure: headingStructure as 'good' | 'needs-improvement' | 'poor'
  };
}

function generateGlobalSuggestions(wireframe: WireframeData): any[] {
  return [
    {
      id: 'global-suggestion-1',
      title: 'Improve heading hierarchy',
      description: 'Ensure consistent heading levels (H1, H2, H3) throughout the wireframe',
      priority: 'high' as const,
      category: 'hierarchy' as const
    },
    {
      id: 'global-suggestion-2',
      title: 'Enhance content scannability',
      description: 'Use more bullet points, numbered lists, and highlighted text',
      priority: 'medium' as const,
      category: 'scannability' as const
    },
    {
      id: 'global-suggestion-3',
      title: 'Simplify language',
      description: 'Use simpler words and shorter sentences for better readability',
      priority: 'medium' as const,
      category: 'readability' as const
    },
    {
      id: 'global-suggestion-4',
      title: 'Balance content distribution',
      description: 'Ensure content is evenly distributed across sections',
      priority: 'low' as const,
      category: 'structure' as const
    }
  ];
}

function calculateImprovementPotential(metrics: ContentAnalysisMetrics): number {
  // Higher scores mean less improvement potential
  return Math.round(100 - metrics.overallScore);
}
