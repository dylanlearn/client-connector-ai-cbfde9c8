
import { FeedbackAnalysisService } from '@/services/ai/content/feedback-analysis-service';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Interface for design feedback interpretation
 */
export interface DesignFeedbackInterpretation {
  intent: 'modify' | 'add' | 'remove' | 'style' | 'layout' | 'unknown';
  targetSection?: string;
  targetElement?: string;
  suggestedChanges: Array<{
    property: string;
    value: any;
    confidence: number;
  }>;
  priority: 'high' | 'medium' | 'low';
  sentimentScore: number;
}

/**
 * Interface for feedback processing options
 */
export interface FeedbackProcessingOptions {
  wireframeId?: string;
  contextualSections?: WireframeSection[];
  userId?: string;
  detailedAnalysis?: boolean;
}

/**
 * Service for interpreting design feedback and converting it to actionable changes
 */
export class FeedbackInterpreterService {
  /**
   * Process design feedback and extract structured interpretations
   */
  static async interpretFeedback(
    feedbackText: string, 
    options: FeedbackProcessingOptions = {}
  ): Promise<DesignFeedbackInterpretation> {
    try {
      console.log('Interpreting feedback:', feedbackText);
      
      // First use the feedback analysis service to get sentiment and action items
      const analysisResult = await FeedbackAnalysisService.analyzeFeedback(feedbackText);
      
      // Default interpretation structure
      const interpretation: DesignFeedbackInterpretation = {
        intent: 'unknown',
        suggestedChanges: [],
        priority: 'medium',
        sentimentScore: 0
      };
      
      // Calculate sentiment score from analysis result
      interpretation.sentimentScore = 
        (analysisResult.toneAnalysis.positive * 1) + 
        (analysisResult.toneAnalysis.neutral * 0) + 
        (analysisResult.toneAnalysis.negative * -1);
      
      // Set priority based on analysis result
      if (analysisResult.toneAnalysis.urgent) {
        interpretation.priority = 'high';
      } else {
        const highPriorityItems = analysisResult.actionItems.filter(item => item.priority === 'high').length;
        interpretation.priority = highPriorityItems > 0 ? 'high' : 'medium';
      }
      
      // Determine intent from feedback text
      if (feedbackText.toLowerCase().includes('add') || feedbackText.toLowerCase().includes('insert')) {
        interpretation.intent = 'add';
      } else if (feedbackText.toLowerCase().includes('remove') || feedbackText.toLowerCase().includes('delete')) {
        interpretation.intent = 'remove';
      } else if (feedbackText.toLowerCase().includes('style') || feedbackText.toLowerCase().includes('color') || 
                 feedbackText.toLowerCase().includes('font') || feedbackText.toLowerCase().includes('look')) {
        interpretation.intent = 'style';
      } else if (feedbackText.toLowerCase().includes('move') || feedbackText.toLowerCase().includes('position') || 
                 feedbackText.toLowerCase().includes('layout') || feedbackText.toLowerCase().includes('arrange')) {
        interpretation.intent = 'layout';
      } else {
        interpretation.intent = 'modify';
      }
      
      // Identify target section if mentioned
      const sectionKeywords = [
        { keyword: 'hero', sectionType: 'hero' },
        { keyword: 'header', sectionType: 'hero' },
        { keyword: 'navigation', sectionType: 'navigation' },
        { keyword: 'nav', sectionType: 'navigation' },
        { keyword: 'menu', sectionType: 'navigation' },
        { keyword: 'features', sectionType: 'features' },
        { keyword: 'feature', sectionType: 'features' },
        { keyword: 'pricing', sectionType: 'pricing' },
        { keyword: 'price', sectionType: 'pricing' },
        { keyword: 'testimonials', sectionType: 'testimonials' },
        { keyword: 'testimonial', sectionType: 'testimonials' },
        { keyword: 'review', sectionType: 'testimonials' },
        { keyword: 'faq', sectionType: 'faq' },
        { keyword: 'questions', sectionType: 'faq' },
        { keyword: 'cta', sectionType: 'cta' },
        { keyword: 'call to action', sectionType: 'cta' },
        { keyword: 'contact', sectionType: 'contact' },
        { keyword: 'footer', sectionType: 'footer' },
        { keyword: 'blog', sectionType: 'blog' },
        { keyword: 'content', sectionType: 'blog' }
      ];
      
      for (const { keyword, sectionType } of sectionKeywords) {
        if (feedbackText.toLowerCase().includes(keyword)) {
          interpretation.targetSection = sectionType;
          break;
        }
      }
      
      // Extract element-specific feedback
      const elementKeywords = ['button', 'image', 'text', 'heading', 'title', 'subtitle', 'paragraph', 'icon', 'card', 'input'];
      
      for (const element of elementKeywords) {
        if (feedbackText.toLowerCase().includes(element)) {
          interpretation.targetElement = element;
          break;
        }
      }
      
      // Extract property changes based on common design terminology
      const extractPropertyChanges = () => {
        const changes = [];
        
        // Color changes
        const colorMatch = feedbackText.match(/(?:change|make|set|update)(?:\s+the)?\s+(?:color|background|bg)(?:\s+to)?\s+([a-z]+)/i);
        if (colorMatch) {
          changes.push({
            property: 'color',
            value: colorMatch[1].toLowerCase(),
            confidence: 0.8
          });
        }
        
        // Size changes
        const sizeMatch = feedbackText.match(/(?:change|make|set|update)(?:\s+the)?\s+(?:size|width|height)(?:\s+to)?\s+(\w+)/i);
        if (sizeMatch) {
          changes.push({
            property: 'size',
            value: sizeMatch[1].toLowerCase(),
            confidence: 0.7
          });
        }
        
        // Alignment changes
        const alignmentKeywords = ['center', 'left', 'right', 'justify'];
        for (const align of alignmentKeywords) {
          if (feedbackText.toLowerCase().includes(align)) {
            changes.push({
              property: 'alignment',
              value: align,
              confidence: 0.85
            });
            break;
          }
        }
        
        // Spacing changes
        if (feedbackText.toLowerCase().includes('spacing') || 
            feedbackText.toLowerCase().includes('margin') || 
            feedbackText.toLowerCase().includes('padding')) {
          const increasedSpacing = feedbackText.toLowerCase().includes('more') || 
                                feedbackText.toLowerCase().includes('increase') ||
                                feedbackText.toLowerCase().includes('larger');
          
          changes.push({
            property: 'spacing',
            value: increasedSpacing ? 'increase' : 'decrease',
            confidence: 0.75
          });
        }
        
        return changes;
      };
      
      interpretation.suggestedChanges = extractPropertyChanges();
      
      console.log('Feedback interpretation complete:', interpretation);
      return interpretation;
    } catch (error) {
      console.error('Error interpreting feedback:', error);
      
      // Return a minimal interpretation when there's an error
      return {
        intent: 'unknown',
        suggestedChanges: [],
        priority: 'low',
        sentimentScore: 0
      };
    }
  }
}
