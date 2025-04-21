
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AIFeatureType, selectModelForFeature } from '@/services/ai/ai-model-selector';

export interface AccessibilityIssue {
  id: string;
  sectionId: string;
  type: 'contrast' | 'focus' | 'touch-target' | 'semantic' | 'aria' | 'other';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  location: string;
  recommendation: string;
  wcagCriteria?: string;
}

export interface AccessibilityAnalysisResult {
  score: number; // 0-100
  issues: AccessibilityIssue[];
  passedChecks: string[];
  summary: string;
}

/**
 * Service for analyzing wireframe accessibility and identifying issues
 */
export class AccessibilityAnalyzerService {
  /**
   * Analyze the entire wireframe for accessibility issues
   */
  static async analyzeWireframe(wireframe: WireframeData): Promise<AccessibilityAnalysisResult> {
    try {
      // First check for simple issues we can analyze directly
      const directIssues = this.identifyDirectIssues(wireframe);
      
      // Then use AI for more sophisticated analysis
      const aiIssues = await this.performAIAnalysis(wireframe);
      
      // Combine issues and calculate score
      const allIssues = [...directIssues, ...aiIssues];
      const score = this.calculateAccessibilityScore(allIssues, wireframe);
      
      // Generate overall summary
      const summary = await this.generateAccessibilitySummary(allIssues, wireframe);
      
      // Identify passed checks
      const passedChecks = this.identifyPassedChecks(allIssues, wireframe);
      
      return {
        score,
        issues: allIssues,
        passedChecks,
        summary
      };
    } catch (error) {
      console.error('Error analyzing accessibility:', error);
      toast.error('Failed to analyze accessibility');
      
      return {
        score: 0,
        issues: [],
        passedChecks: [],
        summary: 'Failed to analyze accessibility. Please try again later.'
      };
    }
  }
  
  /**
   * Analyze a specific section for accessibility issues
   */
  static async analyzeSection(section: WireframeSection): Promise<AccessibilityIssue[]> {
    try {
      // Direct issues we can identify through code
      const directIssues = this.identifySectionDirectIssues(section);
      
      // Issues requiring AI analysis
      const aiIssues = await this.performAISectionAnalysis(section);
      
      return [...directIssues, ...aiIssues];
    } catch (error) {
      console.error('Error analyzing section accessibility:', error);
      return [];
    }
  }
  
  /**
   * Find simple accessibility issues through direct code analysis
   */
  private static identifyDirectIssues(wireframe: WireframeData): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    
    // Check for color contrast issues
    if (wireframe.colorScheme) {
      const { background, text } = wireframe.colorScheme;
      if (background && text) {
        const contrastRatio = this.calculateContrastRatio(background, text);
        if (contrastRatio < 4.5) {
          issues.push({
            id: `contrast-${Date.now()}`,
            sectionId: 'global',
            type: 'contrast',
            severity: 'serious',
            description: `Insufficient contrast ratio (${contrastRatio.toFixed(2)}:1) between background and text colors.`,
            location: 'Global color scheme',
            recommendation: 'Increase the contrast ratio to at least 4.5:1 for normal text or 3:1 for large text.',
            wcagCriteria: 'WCAG 2.1 Success Criterion 1.4.3 Contrast (Minimum)'
          });
        }
      }
    }
    
    // Check sections for specific issues
    wireframe.sections.forEach(section => {
      const sectionIssues = this.identifySectionDirectIssues(section);
      issues.push(...sectionIssues);
    });
    
    return issues;
  }
  
  /**
   * Identify direct issues in a section
   */
  private static identifySectionDirectIssues(section: WireframeSection): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    
    // Check touch target sizes for interactive elements
    if (section.components) {
      section.components.forEach(component => {
        if (component.type === 'button' || component.type === 'link') {
          // Check if dimensions are provided
          if (component.dimensions) {
            const { width, height } = component.dimensions;
            const minTouchSize = 44; // 44px is recommended minimum touch target size
            
            if ((width && width < minTouchSize) || (height && height < minTouchSize)) {
              issues.push({
                id: `touch-${component.id || Date.now()}`,
                sectionId: section.id,
                type: 'touch-target',
                severity: 'moderate',
                description: `Touch target size too small (${width}x${height}px).`,
                location: `Component in section ${section.id}`,
                recommendation: `Increase touch target size to at least ${minTouchSize}x${minTouchSize}px.`,
                wcagCriteria: 'WCAG 2.1 Success Criterion 2.5.5 Target Size'
              });
            }
          }
        }
      });
    }
    
    return issues;
  }
  
  /**
   * Perform AI analysis for more sophisticated accessibility issues
   */
  private static async performAIAnalysis(wireframe: WireframeData): Promise<AccessibilityIssue[]> {
    try {
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
      const promptContent = `
        Analyze this wireframe for accessibility issues according to WCAG 2.1 AA standards.
        Focus on identifying:
        - Semantic structure problems
        - Focus order issues
        - Missing ARIA attributes or roles
        - Other accessibility concerns

        Wireframe data:
        ${JSON.stringify({
          title: wireframe.title,
          description: wireframe.description,
          colorScheme: wireframe.colorScheme,
          sections: wireframe.sections.map(s => ({
            id: s.id,
            type: s.sectionType,
            components: s.components
          }))
        })}

        Return a JSON array of accessibility issues with this format:
        [
          {
            "id": "unique-id",
            "sectionId": "section-id or 'global'",
            "type": "contrast|focus|touch-target|semantic|aria|other",
            "severity": "critical|serious|moderate|minor",
            "description": "Description of the issue",
            "location": "Where in the wireframe the issue occurs",
            "recommendation": "How to fix the issue",
            "wcagCriteria": "Relevant WCAG criterion"
          }
        ]
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are an accessibility expert specializing in web accessibility analysis. Provide detailed, actionable insights on accessibility issues following WCAG guidelines.",
          temperature: 0.3,
          model
        },
      });
      
      if (error) {
        throw new Error(`AI analysis error: ${error.message}`);
      }
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error('Error in AI accessibility analysis:', error);
      return [];
    }
  }
  
  /**
   * Perform AI analysis on a specific section
   */
  private static async performAISectionAnalysis(section: WireframeSection): Promise<AccessibilityIssue[]> {
    try {
      const model = selectModelForFeature(AIFeatureType.DesignRecommendation);
      
      const promptContent = `
        Analyze this wireframe section for accessibility issues according to WCAG 2.1 AA standards.
        Section data:
        ${JSON.stringify(section)}

        Return a JSON array of accessibility issues with this format:
        [
          {
            "id": "unique-id",
            "sectionId": "${section.id}",
            "type": "contrast|focus|touch-target|semantic|aria|other",
            "severity": "critical|serious|moderate|minor",
            "description": "Description of the issue",
            "location": "Where in the section the issue occurs",
            "recommendation": "How to fix the issue",
            "wcagCriteria": "Relevant WCAG criterion"
          }
        ]
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user",
            content: promptContent
          }],
          systemPrompt: "You are an accessibility expert specializing in web accessibility analysis.",
          temperature: 0.3,
          model
        },
      });
      
      if (error) {
        throw new Error(`AI analysis error: ${error.message}`);
      }
      
      return JSON.parse(data.response);
    } catch (error) {
      console.error('Error in AI section accessibility analysis:', error);
      return [];
    }
  }
  
  /**
   * Calculate contrast ratio between two colors
   * Based on WCAG 2.1 contrast algorithm
   */
  private static calculateContrastRatio(color1: string, color2: string): number {
    const getLuminance = (color: string): number => {
      // Convert hex to RGB
      let r, g, b;
      
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        r = parseInt(hex.substring(0, 2), 16) / 255;
        g = parseInt(hex.substring(2, 4), 16) / 255;
        b = parseInt(hex.substring(4, 6), 16) / 255;
      } else if (color.startsWith('rgb')) {
        // Extract RGB values from rgb/rgba format
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
          r = parseInt(match[0]) / 255;
          g = parseInt(match[1]) / 255;
          b = parseInt(match[2]) / 255;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
      
      // Apply gamma correction
      r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
      
      // Calculate luminance
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    
    // Calculate contrast ratio
    const lighterLum = Math.max(luminance1, luminance2);
    const darkerLum = Math.min(luminance1, luminance2);
    
    return (lighterLum + 0.05) / (darkerLum + 0.05);
  }
  
  /**
   * Calculate overall accessibility score based on issues found
   */
  private static calculateAccessibilityScore(issues: AccessibilityIssue[], wireframe: WireframeData): number {
    // Start with perfect score
    let score = 100;
    
    // Deduct points based on severity
    const deductions = {
      critical: 15,
      serious: 10,
      moderate: 5,
      minor: 2
    };
    
    // Count issues by severity
    const issueCounts = {
      critical: issues.filter(i => i.severity === 'critical').length,
      serious: issues.filter(i => i.severity === 'serious').length,
      moderate: issues.filter(i => i.severity === 'moderate').length,
      minor: issues.filter(i => i.severity === 'minor').length
    };
    
    // Apply deductions
    score -= issueCounts.critical * deductions.critical;
    score -= issueCounts.serious * deductions.serious;
    score -= issueCounts.moderate * deductions.moderate;
    score -= issueCounts.minor * deductions.minor;
    
    // Ensure score doesn't go below 0
    return Math.max(0, score);
  }
  
  /**
   * Generate a summary of accessibility issues
   */
  private static async generateAccessibilitySummary(
    issues: AccessibilityIssue[], 
    wireframe: WireframeData
  ): Promise<string> {
    if (issues.length === 0) {
      return "No accessibility issues were found. Great job!";
    }
    
    try {
      const model = selectModelForFeature(AIFeatureType.Summarization);
      
      const issueSummary = {
        critical: issues.filter(i => i.severity === 'critical').length,
        serious: issues.filter(i => i.severity === 'serious').length,
        moderate: issues.filter(i => i.severity === 'moderate').length,
        minor: issues.filter(i => i.severity === 'minor').length,
        total: issues.length
      };
      
      const promptContent = `
        Summarize the following accessibility issues found in a wireframe titled "${wireframe.title}":
        
        Issue counts:
        - Critical issues: ${issueSummary.critical}
        - Serious issues: ${issueSummary.serious}
        - Moderate issues: ${issueSummary.moderate}
        - Minor issues: ${issueSummary.minor}
        
        Top 3 issues:
        ${issues.slice(0, 3).map(issue => `- ${issue.description} (${issue.severity})`).join('\n')}
        
        Provide a brief, helpful summary of the accessibility state and most important improvements needed.
        Keep your response to 2-3 sentences.
      `;
      
      const { data, error } = await supabase.functions.invoke("generate-with-openai", {
        body: {
          messages: [{
            role: "user", 
            content: promptContent
          }],
          systemPrompt: "You are an accessibility expert providing concise, actionable summaries.",
          temperature: 0.7,
          model
        },
      });
      
      if (error) {
        throw new Error(`Summary generation error: ${error.message}`);
      }
      
      return data.response;
    } catch (error) {
      console.error('Error generating accessibility summary:', error);
      return `Found ${issues.length} accessibility issues. Please review and address them to improve accessibility.`;
    }
  }
  
  /**
   * Identify checks that passed (no issues found)
   */
  private static identifyPassedChecks(issues: AccessibilityIssue[], wireframe: WireframeData): string[] {
    const passedChecks: string[] = [];
    
    // Define all checks we perform
    const allChecks = [
      'Color contrast (normal text)',
      'Color contrast (large text)',
      'Touch target size',
      'Keyboard focus order',
      'Alternative text for images',
      'Heading structure',
      'Form labels',
      'ARIA attributes'
    ];
    
    // Check which issues were not found
    const issueTypes = issues.map(issue => issue.type);
    
    if (!issueTypes.includes('contrast')) {
      passedChecks.push('Color contrast (normal text)');
      passedChecks.push('Color contrast (large text)');
    }
    
    if (!issueTypes.includes('touch-target')) {
      passedChecks.push('Touch target size');
    }
    
    if (!issueTypes.includes('focus')) {
      passedChecks.push('Keyboard focus order');
    }
    
    if (!issueTypes.includes('semantic')) {
      passedChecks.push('Alternative text for images');
      passedChecks.push('Heading structure');
    }
    
    if (!issueTypes.includes('aria')) {
      passedChecks.push('ARIA attributes');
    }
    
    // For any checks we didn't explicitly handle, but aren't in the issues
    allChecks.forEach(check => {
      if (!passedChecks.includes(check)) {
        const relatedIssueFound = issues.some(issue => 
          issue.description.toLowerCase().includes(check.toLowerCase())
        );
        
        if (!relatedIssueFound) {
          passedChecks.push(check);
        }
      }
    });
    
    return passedChecks;
  }
}
