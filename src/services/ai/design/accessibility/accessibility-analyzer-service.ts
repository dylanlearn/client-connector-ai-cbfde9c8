
import { WireframeData, WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';

// Define types for accessibility analysis
export interface AccessibilityIssue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  type: 'contrast' | 'focus-order' | 'touch-target' | 'text-alternative' | 'keyboard' | 'other';
  wcagCriteria?: string;
  affectedElements: string[];
  fixSuggestion: string;
  isFixed?: boolean;
}

export interface AccessibilityAnalysisResult {
  overallScore: number;
  issues: AccessibilityIssue[];
  passedChecks: string[];
  metadata: {
    analyzedAt: string;
    autoFixable: number;
  };
}

// Color contrast helpers
interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Accessibility Analyzer Service - Analyzes wireframes for accessibility issues
 */
export const AccessibilityAnalyzerService = {
  /**
   * Analyze a wireframe for accessibility issues
   */
  analyzeWireframe: async (wireframe: WireframeData): Promise<AccessibilityAnalysisResult> => {
    // In a real implementation, this would be a comprehensive analysis with AI assistance
    // For this demo, we'll implement some basic checks
    
    const issues: AccessibilityIssue[] = [];
    const passedChecks: string[] = [];
    let id = 1;
    
    // Check color contrast between background and text
    const contrastIssues = checkColorContrast(wireframe);
    issues.push(...contrastIssues.map(issue => ({ ...issue, id: `a11y-${id++}` })));
    
    if (contrastIssues.length === 0) {
      passedChecks.push('All text elements have sufficient color contrast');
    }
    
    // Check touch target sizes
    const touchTargetIssues = checkTouchTargetSizes(wireframe);
    issues.push(...touchTargetIssues.map(issue => ({ ...issue, id: `a11y-${id++}` })));
    
    if (touchTargetIssues.length === 0) {
      passedChecks.push('All interactive elements have sufficient touch target size');
    }
    
    // Check for alt text on images
    const altTextIssues = checkAltText(wireframe);
    issues.push(...altTextIssues.map(issue => ({ ...issue, id: `a11y-${id++}` })));
    
    if (altTextIssues.length === 0) {
      passedChecks.push('All images have alternative text');
    }
    
    // Check for keyboard accessibility
    const keyboardIssues = checkKeyboardAccessibility(wireframe);
    issues.push(...keyboardIssues.map(issue => ({ ...issue, id: `a11y-${id++}` })));
    
    if (keyboardIssues.length === 0) {
      passedChecks.push('All interactive elements are keyboard accessible');
    }
    
    // Calculate overall score based on number and severity of issues
    let score = 100;
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 15;
          break;
        case 'serious':
          score -= 10;
          break;
        case 'moderate':
          score -= 5;
          break;
        case 'minor':
          score -= 2;
          break;
      }
    });
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    // Count auto-fixable issues
    const autoFixable = issues.filter(issue => 
      issue.type === 'contrast' || issue.type === 'touch-target'
    ).length;
    
    return {
      overallScore: score,
      issues,
      passedChecks,
      metadata: {
        analyzedAt: new Date().toISOString(),
        autoFixable
      }
    };
  },
  
  /**
   * Apply a fix for an accessibility issue
   */
  applyFix: async (
    wireframe: WireframeData,
    issue: AccessibilityIssue
  ): Promise<WireframeData> => {
    // Apply the appropriate fix based on the issue type
    switch (issue.type) {
      case 'contrast':
        return fixContrastIssue(wireframe, issue);
      case 'touch-target':
        return fixTouchTargetIssue(wireframe, issue);
      case 'text-alternative':
        return fixAltTextIssue(wireframe, issue);
      default:
        // For other types, we may need manual intervention
        return wireframe;
    }
  }
};

/**
 * Check color contrast throughout the wireframe
 */
function checkColorContrast(wireframe: WireframeData): Omit<AccessibilityIssue, 'id'>[] {
  const issues: Omit<AccessibilityIssue, 'id'>[] = [];
  
  // Convert color scheme colors to RGB for contrast calculation
  const backgroundRGB = hexToRgb(wireframe.colorScheme.background);
  const textRGB = hexToRgb(wireframe.colorScheme.text);
  const primaryRGB = hexToRgb(wireframe.colorScheme.primary);
  
  // Check global color scheme contrast
  if (backgroundRGB && textRGB) {
    const contrastRatio = calculateContrastRatio(backgroundRGB, textRGB);
    if (contrastRatio < 4.5) {
      issues.push({
        title: 'Insufficient text contrast in color scheme',
        description: `The contrast ratio between background and text colors is ${contrastRatio.toFixed(2)}:1, which is below the WCAG AA minimum of 4.5:1 for normal text.`,
        severity: 'serious',
        type: 'contrast',
        wcagCriteria: 'WCAG 1.4.3 Contrast (Minimum)',
        affectedElements: ['global-color-scheme'],
        fixSuggestion: 'Increase the contrast between background and text colors to at least 4.5:1.'
      });
    }
  }
  
  // Check buttons against their background
  if (backgroundRGB && primaryRGB) {
    const buttonContrastRatio = calculateContrastRatio(primaryRGB, backgroundRGB);
    if (buttonContrastRatio < 3) {
      issues.push({
        title: 'Low button contrast',
        description: `The contrast ratio between primary button color and background is ${buttonContrastRatio.toFixed(2)}:1, which may make buttons hard to distinguish.`,
        severity: 'moderate',
        type: 'contrast',
        wcagCriteria: 'WCAG 1.4.11 Non-text Contrast',
        affectedElements: ['button-components'],
        fixSuggestion: 'Increase the contrast between button and background colors.'
      });
    }
  }
  
  // Check sections and components with custom colors
  wireframe.sections.forEach(section => {
    // Check section background color if specified
    if (section.backgroundColor) {
      const sectionBgRGB = hexToRgb(section.backgroundColor);
      if (sectionBgRGB && textRGB) {
        const sectionContrastRatio = calculateContrastRatio(sectionBgRGB, textRGB);
        if (sectionContrastRatio < 4.5) {
          issues.push({
            title: `Low contrast in ${section.sectionType} section`,
            description: `The contrast ratio between section background and text is ${sectionContrastRatio.toFixed(2)}:1, which is below the recommended 4.5:1.`,
            severity: 'serious',
            type: 'contrast',
            wcagCriteria: 'WCAG 1.4.3 Contrast (Minimum)',
            affectedElements: [section.id],
            fixSuggestion: 'Adjust the section background or text color to increase contrast.'
          });
        }
      }
    }
    
    // Check component-specific styles
    section.components.forEach(component => {
      if (component.style?.backgroundColor && component.style?.color) {
        const componentBgRGB = hexToRgb(component.style.backgroundColor);
        const componentTextRGB = hexToRgb(component.style.color);
        
        if (componentBgRGB && componentTextRGB) {
          const componentContrastRatio = calculateContrastRatio(componentBgRGB, componentTextRGB);
          if (componentContrastRatio < 4.5) {
            issues.push({
              title: `Low contrast in component ${component.id}`,
              description: `The contrast ratio in this component is ${componentContrastRatio.toFixed(2)}:1, which is below the recommended 4.5:1.`,
              severity: 'serious',
              type: 'contrast',
              wcagCriteria: 'WCAG 1.4.3 Contrast (Minimum)',
              affectedElements: [component.id],
              fixSuggestion: 'Adjust the component background or text color to increase contrast.'
            });
          }
        }
      }
    });
  });
  
  return issues;
}

/**
 * Check touch target sizes for interactive elements
 */
function checkTouchTargetSizes(wireframe: WireframeData): Omit<AccessibilityIssue, 'id'>[] {
  const issues: Omit<AccessibilityIssue, 'id'>[] = [];
  const minTouchTargetSize = 44; // Minimum size in pixels (WCAG 2.5.5)
  
  wireframe.sections.forEach(section => {
    section.components.forEach(component => {
      // Check buttons, links, and other interactive elements
      if (component.type === 'button' || component.type === 'link' || component.type === 'icon-button') {
        // Check if dimensions are specified and convert to numbers
        const width = typeof component.dimensions?.width === 'string' 
          ? parseInt(component.dimensions.width) 
          : (typeof component.dimensions?.width === 'number' ? component.dimensions.width : 0);
          
        const height = typeof component.dimensions?.height === 'string' 
          ? parseInt(component.dimensions.height) 
          : (typeof component.dimensions?.height === 'number' ? component.dimensions.height : 0);
        
        if (width < minTouchTargetSize || height < minTouchTargetSize) {
          issues.push({
            title: `Small touch target in ${component.type}`,
            description: `The touch target size (${width}x${height}px) is smaller than the recommended minimum of ${minTouchTargetSize}x${minTouchTargetSize}px.`,
            severity: 'moderate',
            type: 'touch-target',
            wcagCriteria: 'WCAG 2.5.5 Target Size',
            affectedElements: [component.id],
            fixSuggestion: `Increase the size of the ${component.type} to at least ${minTouchTargetSize}x${minTouchTargetSize}px.`
          });
        }
      }
    });
  });
  
  return issues;
}

/**
 * Check for alt text on images
 */
function checkAltText(wireframe: WireframeData): Omit<AccessibilityIssue, 'id'>[] {
  const issues: Omit<AccessibilityIssue, 'id'>[] = [];
  
  wireframe.sections.forEach(section => {
    section.components.forEach(component => {
      if (component.type === 'image') {
        if (!component.alt && !component.props?.alt) {
          issues.push({
            title: 'Missing alt text',
            description: `The image in section ${section.sectionType} is missing alternative text which is essential for screen reader users.`,
            severity: 'serious',
            type: 'text-alternative',
            wcagCriteria: 'WCAG 1.1.1 Non-text Content',
            affectedElements: [component.id],
            fixSuggestion: 'Add descriptive alt text to this image.'
          });
        }
      }
    });
  });
  
  return issues;
}

/**
 * Check for keyboard accessibility
 */
function checkKeyboardAccessibility(wireframe: WireframeData): Omit<AccessibilityIssue, 'id'>[] {
  const issues: Omit<AccessibilityIssue, 'id'>[] = [];
  
  // Check for potential keyboard traps or focus issues
  wireframe.sections.forEach(section => {
    // Check for modals without clear exit
    const hasModal = section.components.some(c => 
      c.type === 'modal' || c.type === 'dialog' || c.type === 'popup'
    );
    
    if (hasModal) {
      const hasCloseButton = section.components.some(c => 
        (c.type === 'button' && c.content?.toLowerCase().includes('close')) ||
        (c.type === 'button' && c.props?.action === 'close')
      );
      
      if (!hasCloseButton) {
        issues.push({
          title: 'Modal without keyboard exit',
          description: `The modal/dialog in section ${section.sectionType} does not appear to have a clear way to close it using keyboard.`,
          severity: 'critical',
          type: 'keyboard',
          wcagCriteria: 'WCAG 2.1.2 No Keyboard Trap',
          affectedElements: [section.id],
          fixSuggestion: 'Add a close button to the modal that can be accessed via keyboard.'
        });
      }
    }
  });
  
  return issues;
}

// Helper function to apply contrast issue fixes
function fixContrastIssue(wireframe: WireframeData, issue: AccessibilityIssue): WireframeData {
  if (issue.affectedElements.includes('global-color-scheme')) {
    // Adjust global text color for better contrast
    const textColor = adjustColorForContrast(wireframe.colorScheme.background, wireframe.colorScheme.text);
    
    return {
      ...wireframe,
      colorScheme: {
        ...wireframe.colorScheme,
        text: textColor
      }
    };
  }
  
  // Fix section-specific contrast issues
  return {
    ...wireframe,
    sections: wireframe.sections.map(section => {
      if (issue.affectedElements.includes(section.id)) {
        // Adjust section text color or background
        return {
          ...section,
          style: {
            ...section.style,
            color: section.backgroundColor 
              ? adjustColorForContrast(section.backgroundColor, wireframe.colorScheme.text)
              : wireframe.colorScheme.text
          }
        };
      }
      
      // Fix component-specific contrast issues
      if (section.components.some(c => issue.affectedElements.includes(c.id))) {
        return {
          ...section,
          components: section.components.map(component => {
            if (issue.affectedElements.includes(component.id) && component.style) {
              return {
                ...component,
                style: {
                  ...component.style,
                  color: component.style.backgroundColor
                    ? adjustColorForContrast(component.style.backgroundColor, component.style.color || wireframe.colorScheme.text)
                    : wireframe.colorScheme.text
                }
              };
            }
            return component;
          })
        };
      }
      
      return section;
    })
  };
}

// Helper function to fix touch target size issues
function fixTouchTargetIssue(wireframe: WireframeData, issue: AccessibilityIssue): WireframeData {
  const minSize = 44; // 44x44px minimum touch target
  
  return {
    ...wireframe,
    sections: wireframe.sections.map(section => {
      return {
        ...section,
        components: section.components.map(component => {
          if (issue.affectedElements.includes(component.id)) {
            return {
              ...component,
              dimensions: {
                width: Math.max(minSize, component.dimensions?.width ? Number(component.dimensions.width) : minSize),
                height: Math.max(minSize, component.dimensions?.height ? Number(component.dimensions.height) : minSize)
              }
            };
          }
          return component;
        })
      };
    })
  };
}

// Helper function to fix alt text issues
function fixAltTextIssue(wireframe: WireframeData, issue: AccessibilityIssue): WireframeData {
  return {
    ...wireframe,
    sections: wireframe.sections.map(section => {
      return {
        ...section,
        components: section.components.map(component => {
          if (issue.affectedElements.includes(component.id) && component.type === 'image') {
            return {
              ...component,
              alt: 'Image of ' + (section.sectionType || 'content'),
              props: {
                ...component.props,
                alt: 'Image of ' + (section.sectionType || 'content')
              }
            };
          }
          return component;
        })
      };
    })
  };
}

// Helper functions for color calculations
function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function calculateContrastRatio(color1: RGBColor, color2: RGBColor): number {
  // Calculate relative luminance
  const luminance1 = calculateRelativeLuminance(color1);
  const luminance2 = calculateRelativeLuminance(color2);
  
  // Calculate contrast ratio
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function calculateRelativeLuminance(color: RGBColor): number {
  // Convert RGB values to sRGB
  const srgb = {
    r: color.r / 255,
    g: color.g / 255,
    b: color.b / 255
  };
  
  // Apply gamma correction
  const rgb = {
    r: srgb.r <= 0.03928 ? srgb.r / 12.92 : Math.pow((srgb.r + 0.055) / 1.055, 2.4),
    g: srgb.g <= 0.03928 ? srgb.g / 12.92 : Math.pow((srgb.g + 0.055) / 1.055, 2.4),
    b: srgb.b <= 0.03928 ? srgb.b / 12.92 : Math.pow((srgb.b + 0.055) / 1.055, 2.4)
  };
  
  // Calculate relative luminance
  return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
}

function adjustColorForContrast(backgroundColor: string, textColor: string): string {
  const bgRGB = hexToRgb(backgroundColor);
  const textRGB = hexToRgb(textColor);
  
  if (!bgRGB || !textRGB) return textColor;
  
  const contrastRatio = calculateContrastRatio(bgRGB, textRGB);
  
  if (contrastRatio >= 4.5) return textColor; // Already sufficient
  
  // Determine if we should darken or lighten
  const bgLuminance = calculateRelativeLuminance(bgRGB);
  
  if (bgLuminance > 0.5) {
    // Background is light, text should be darker
    return darkenColor(textColor);
  } else {
    // Background is dark, text should be lighter
    return lightenColor(textColor);
  }
}

function darkenColor(color: string): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return rgbToHex({
    r: Math.max(0, rgb.r - 50),
    g: Math.max(0, rgb.g - 50),
    b: Math.max(0, rgb.b - 50)
  });
}

function lightenColor(color: string): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return rgbToHex({
    r: Math.min(255, rgb.r + 50),
    g: Math.min(255, rgb.g + 50),
    b: Math.min(255, rgb.b + 50)
  });
}

function rgbToHex(color: RGBColor): string {
  return '#' + 
    color.r.toString(16).padStart(2, '0') +
    color.g.toString(16).padStart(2, '0') +
    color.b.toString(16).padStart(2, '0');
}
