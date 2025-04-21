
import { useState, useCallback } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { LayoutAnalyzerService, LayoutAnalysisResult } from '@/services/ai/design/layout-analysis/layout-analyzer-service';
import { toast } from 'sonner';

// Define our own LayoutRecommendation type that matches what's used in LayoutAnalysisPanel
export interface LayoutRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  severity: 'critical' | 'warning' | 'info';
  suggestedFix: string;
  beforeAfterComparison?: {
    before: string;
    after: string;
  };
}

interface UseLayoutIntelligenceOptions {
  showToasts?: boolean;
}

/**
 * Hook for using the Layout Analyzer Service
 */
export function useLayoutIntelligence({
  showToasts = true
}: UseLayoutIntelligenceOptions = {}) {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<LayoutAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Analyze a wireframe for layout issues and recommendations
   */
  const analyzeLayout = useCallback(async (wireframe: WireframeData): Promise<LayoutAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await LayoutAnalyzerService.analyzeLayout(wireframe);
      setAnalysisResult(result);
      
      if (showToasts) {
        if (result.recommendations.length === 0) {
          toast.success('No layout issues found. Your layout looks great!');
        } else {
          toast.info(`Found ${result.recommendations.length} layout recommendations.`);
        }
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error analyzing layout');
      setError(error);
      
      if (showToasts) {
        toast.error('Error analyzing layout: ' + error.message);
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [showToasts]);
  
  /**
   * Apply a layout recommendation to the wireframe
   */
  const applyRecommendation = useCallback(
    async (wireframe: WireframeData, recommendation: LayoutRecommendation): Promise<WireframeData | null> => {
      setError(null);
      
      try {
        // In a real implementation, this would intelligently modify the wireframe
        // based on the specific recommendation
        // For this demo, we'll make some basic modifications
        
        const updatedWireframe = JSON.parse(JSON.stringify(wireframe)) as WireframeData;
        
        // Apply recommendation based on its category
        switch (recommendation.category) {
          case 'spacing':
            updatedWireframe.sections = updatedWireframe.sections.map(section => ({
              ...section,
              layout: {
                ...section.layout,
                gap: 24
              },
              style: {
                ...section.style,
                padding: '40px 24px'
              }
            }));
            break;
            
          case 'alignment':
            updatedWireframe.sections = updatedWireframe.sections.map(section => ({
              ...section,
              layout: {
                ...section.layout,
                alignment: 'center',
                justifyContent: 'center'
              },
              style: {
                ...section.style,
                textAlign: 'center'
              }
            }));
            break;
            
          case 'hierarchy':
            // Update section order based on importance
            updatedWireframe.sections.sort((a, b) => {
              if (a.sectionType === 'hero') return -1;
              if (b.sectionType === 'hero') return 1;
              if (a.sectionType === 'features') return -1;
              if (b.sectionType === 'features') return 1;
              return 0;
            });
            break;
            
          case 'visual-balance':
            // Apply consistent styling to create balance
            updatedWireframe.sections = updatedWireframe.sections.map(section => ({
              ...section,
              layout: {
                ...section.layout,
                columns: 2,
                gap: 32
              }
            }));
            break;
            
          case 'responsiveness':
            // Ensure mobile considerations
            updatedWireframe.mobileConsiderations = "Layout adjusted for mobile viewports. All sections stack vertically on small screens.";
            break;
            
          default:
            // Generic improvements
            updatedWireframe.sections = updatedWireframe.sections.map(section => ({
              ...section,
              style: {
                ...section.style,
                maxWidth: '1200px',
                margin: '0 auto'
              }
            }));
        }
        
        if (showToasts) {
          toast.success(`Applied recommendation: ${recommendation.title}`);
        }
        
        return updatedWireframe;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error applying recommendation');
        setError(error);
        
        if (showToasts) {
          toast.error('Error applying recommendation: ' + error.message);
        }
        
        return null;
      }
    },
    [showToasts]
  );
  
  /**
   * Clear the current analysis
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);
  
  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeLayout,
    applyRecommendation,
    clearAnalysis
  };
}
