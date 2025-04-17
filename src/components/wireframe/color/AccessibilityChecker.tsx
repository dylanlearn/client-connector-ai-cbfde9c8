
import React, { useState, useEffect } from 'react';
import { ColorScheme } from '../ColorSchemeSelector';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, AlertTriangle, Info, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AccessibilityCheckerProps {
  colorScheme: ColorScheme;
}

interface ContrastResult {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
}

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({ colorScheme }) => {
  const [contrastResults, setContrastResults] = useState<Record<string, ContrastResult>>({});
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);

  useEffect(() => {
    // Check all relevant color combinations
    const results: Record<string, ContrastResult> = {
      'text-on-background': checkContrast(colorScheme.text, colorScheme.background),
      'primary-on-background': checkContrast(colorScheme.primary, colorScheme.background),
      'secondary-on-background': checkContrast(colorScheme.secondary, colorScheme.background),
      'accent-on-background': checkContrast(colorScheme.accent, colorScheme.background),
      'white-on-primary': checkContrast('#ffffff', colorScheme.primary),
      'black-on-primary': checkContrast('#000000', colorScheme.primary),
    };

    setContrastResults(results);

    // Generate issues
    const accessibilityIssues: AccessibilityIssue[] = [];

    // Check text on background contrast
    if (!results['text-on-background'].aa) {
      accessibilityIssues.push({
        type: 'error',
        title: 'Insufficient text contrast',
        description: `Text on background has a contrast ratio of ${results['text-on-background'].ratio.toFixed(2)}, which doesn't meet WCAG AA standards (minimum 4.5:1).`
      });
    }

    // Check primary button text contrast
    const primaryTextContrast = results['white-on-primary'].ratio > results['black-on-primary'].ratio
      ? results['white-on-primary']
      : results['black-on-primary'];
    
    if (!primaryTextContrast.aa) {
      accessibilityIssues.push({
        type: 'error',
        title: 'Poor button text contrast',
        description: `Button text may not be readable on primary color with a contrast ratio of ${primaryTextContrast.ratio.toFixed(2)}.`
      });
    }

    // Warning for secondary colors
    if (!results['secondary-on-background'].aa) {
      accessibilityIssues.push({
        type: 'warning',
        title: 'Low secondary color contrast',
        description: 'The secondary color may not be clearly visible against the background.'
      });
    }

    // Suggestions
    if (accessibilityIssues.length === 0) {
      accessibilityIssues.push({
        type: 'info',
        title: 'Color scheme passes basic checks',
        description: 'Your color scheme meets WCAG AA standards for contrast.'
      });
    } else {
      accessibilityIssues.push({
        type: 'info',
        title: 'Consider color blindness',
        description: 'Test your palette with different types of color vision deficiency simulators.'
      });
    }

    setIssues(accessibilityIssues);

  }, [colorScheme]);

  // Calculate contrast ratio between two colors
  function checkContrast(color1: string, color2: string): ContrastResult {
    const ratio = calculateContrastRatio(color1, color2);
    return {
      ratio,
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
      aaLarge: ratio >= 3,
      aaaLarge: ratio >= 4.5
    };
  }

  // Calculate luminance of a color
  function calculateLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    
    // Convert RGB to sRGB
    const sR = r / 255;
    const sG = g / 255;
    const sB = b / 255;
    
    // Calculate luminance
    const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
    const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
    const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  // Calculate contrast ratio between two colors
  function calculateContrastRatio(color1: string, color2: string): number {
    const luminance1 = calculateLuminance(color1);
    const luminance2 = calculateLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Convert hex to RGB
  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Render a contrast rating indicator
  const ContrastRating = ({ result }: { result: ContrastResult }) => {
    const getColor = () => {
      if (result.aaa) return "bg-green-500";
      if (result.aa) return "bg-yellow-500";
      if (result.aaLarge) return "bg-orange-500";
      return "bg-red-500";
    };

    const getLabel = () => {
      if (result.aaa) return "AAA";
      if (result.aa) return "AA";
      if (result.aaLarge) return "AA Large";
      return "Fail";
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`w-16 px-2 py-0.5 text-white text-xs font-medium text-center rounded ${getColor()}`}>
          {getLabel()}
        </div>
        <span className="text-sm">{result.ratio.toFixed(2)}:1</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Accessibility Checks</h3>
        
        <div className="grid gap-4 mb-6">
          {Object.entries(contrastResults).map(([key, result]) => (
            <div key={key} className="flex justify-between items-center">
              <Label className="capitalize">{key.replace(/-/g, ' ')}</Label>
              <ContrastRating result={result} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Issues & Recommendations</h3>
        
        {issues.map((issue, index) => (
          <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
            {issue.type === 'error' && <AlertTriangle className="h-4 w-4" />}
            {issue.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
            {issue.type === 'info' && <Info className="h-4 w-4" />}
            <AlertTitle>{issue.title}</AlertTitle>
            <AlertDescription>
              {issue.description}
            </AlertDescription>
          </Alert>
        ))}
        
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Label>Overall Accessibility Score</Label>
              <span className="text-sm font-medium">
                {Object.values(contrastResults).filter(r => r.aa).length} / {Object.values(contrastResults).length} Checks Passed
              </span>
            </div>
            <Progress 
              value={
                (Object.values(contrastResults).filter(r => r.aa).length / 
                Object.values(contrastResults).length) * 100
              } 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccessibilityChecker;
