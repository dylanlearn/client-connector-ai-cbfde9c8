
import React from 'react';
import { WireframeTypography } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';

export interface TypographyPreviewProps {
  typography: WireframeTypography;
  darkMode?: boolean;
}

/**
 * Typography Preview - Visualizes typography settings with sample text
 */
export const TypographyPreview: React.FC<TypographyPreviewProps> = ({
  typography,
  darkMode = false,
}) => {
  // Generate inline styles for the typography preview
  const headingStyles = {
    fontFamily: typography.headings || 'Inter, sans-serif',
  };

  const bodyStyles = {
    fontFamily: typography.body || 'Inter, sans-serif',
  };

  return (
    <div className={cn(
      "typography-preview space-y-8",
      darkMode ? "text-white" : "text-gray-900"
    )}>
      <div className="heading-samples space-y-6">
        <h2 className="text-lg font-medium mb-4 text-muted-foreground">Heading Typography</h2>

        <div className="px-4 py-3 border rounded-md">
          <h1 
            style={headingStyles} 
            className="text-4xl font-bold mb-2"
          >
            Heading Level 1
          </h1>
          <div className="text-xs text-muted-foreground">
            Font: {typography.headings} • Size: 2.25rem • Weight: 700
          </div>
        </div>

        <div className="px-4 py-3 border rounded-md">
          <h2 
            style={headingStyles} 
            className="text-3xl font-bold mb-2"
          >
            Heading Level 2
          </h2>
          <div className="text-xs text-muted-foreground">
            Font: {typography.headings} • Size: 1.875rem • Weight: 700
          </div>
        </div>

        <div className="px-4 py-3 border rounded-md">
          <h3 
            style={headingStyles} 
            className="text-2xl font-bold mb-2"
          >
            Heading Level 3
          </h3>
          <div className="text-xs text-muted-foreground">
            Font: {typography.headings} • Size: 1.5rem • Weight: 700
          </div>
        </div>

        <div className="px-4 py-3 border rounded-md">
          <h4 
            style={headingStyles} 
            className="text-xl font-bold mb-2"
          >
            Heading Level 4
          </h4>
          <div className="text-xs text-muted-foreground">
            Font: {typography.headings} • Size: 1.25rem • Weight: 700
          </div>
        </div>
      </div>

      <div className="body-samples space-y-6">
        <h2 className="text-lg font-medium mb-4 text-muted-foreground">Body Typography</h2>
        
        <div className="px-4 py-3 border rounded-md">
          <p 
            style={bodyStyles} 
            className="text-base mb-3"
          >
            Regular paragraph text. The quick brown fox jumps over the lazy dog. This text demonstrates the basic paragraph styling with the selected body font.
          </p>
          <div className="text-xs text-muted-foreground">
            Font: {typography.body} • Size: 1rem • Weight: 400 • Line Height: 1.5
          </div>
        </div>

        <div className="px-4 py-3 border rounded-md">
          <p 
            style={bodyStyles} 
            className="text-sm mb-3"
          >
            Small text size. The quick brown fox jumps over the lazy dog. This shows how smaller body text appears with the selected typography.
          </p>
          <div className="text-xs text-muted-foreground">
            Font: {typography.body} • Size: 0.875rem • Weight: 400 • Line Height: 1.5
          </div>
        </div>

        <div className="px-4 py-3 border rounded-md">
          <div 
            style={bodyStyles} 
            className="mb-3"
          >
            <p className="font-medium mb-2">Medium Weight Paragraph</p>
            <p className="font-bold mb-2">Bold Weight Paragraph</p>
            <p className="italic mb-2">Italic Style Paragraph</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Font: {typography.body} • Various Weights and Styles
          </div>
        </div>
      </div>

      <div className="combination-samples space-y-4">
        <h2 className="text-lg font-medium mb-4 text-muted-foreground">Typography Combinations</h2>
        
        <div className="px-4 py-6 border rounded-md bg-muted/10">
          <h3 
            style={headingStyles} 
            className="text-2xl font-bold mb-3"
          >
            Article Heading
          </h3>
          <p 
            style={bodyStyles} 
            className="text-base mb-4"
          >
            This is an example of how headings and body text work together in an article or content section. The combination of fonts should create a harmonious reading experience while maintaining visual hierarchy.
          </p>
          <h4 
            style={headingStyles} 
            className="text-xl font-bold mb-2"
          >
            Subheading Example
          </h4>
          <p 
            style={bodyStyles} 
            className="text-base"
          >
            The relationship between different text elements is crucial for readability. This preview helps visualize how your typography choices will appear in real content scenarios.
          </p>
        </div>
      </div>

      <div className="line-height-visualization space-y-4">
        <h2 className="text-lg font-medium mb-4 text-muted-foreground">Line Height Visualization</h2>
        
        <div className="px-4 py-4 border rounded-md">
          <div className="relative mb-6">
            <p 
              style={{
                ...bodyStyles,
                lineHeight: "1",
              }} 
              className="text-base mb-1"
            >
              Line height: 1 (tight)
            </p>
            <div className="grid grid-cols-1 gap-0 relative">
              <div className="bg-primary/10 h-6 relative">
                <span style={{...bodyStyles, lineHeight: "1"}} className="absolute top-0 left-0 p-0 m-0">
                  The quick brown fox
                </span>
              </div>
              <div className="bg-primary/5 h-6 relative">
                <span style={{...bodyStyles, lineHeight: "1"}} className="absolute top-0 left-0 p-0 m-0">
                  jumps over the lazy dog
                </span>
              </div>
            </div>
          </div>

          <div className="relative mb-6">
            <p 
              style={{
                ...bodyStyles,
                lineHeight: "1.5",
              }} 
              className="text-base mb-1"
            >
              Line height: 1.5 (normal)
            </p>
            <div className="grid grid-cols-1 gap-0 relative">
              <div className="bg-primary/10 h-9 relative">
                <span style={{...bodyStyles, lineHeight: "1.5"}} className="absolute top-0 left-0 p-0 m-0">
                  The quick brown fox
                </span>
              </div>
              <div className="bg-primary/5 h-9 relative">
                <span style={{...bodyStyles, lineHeight: "1.5"}} className="absolute top-0 left-0 p-0 m-0">
                  jumps over the lazy dog
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <p 
              style={{
                ...bodyStyles,
                lineHeight: "2",
              }} 
              className="text-base mb-1"
            >
              Line height: 2 (loose)
            </p>
            <div className="grid grid-cols-1 gap-0 relative">
              <div className="bg-primary/10 h-12 relative">
                <span style={{...bodyStyles, lineHeight: "2"}} className="absolute top-0 left-0 p-0 m-0">
                  The quick brown fox
                </span>
              </div>
              <div className="bg-primary/5 h-12 relative">
                <span style={{...bodyStyles, lineHeight: "2"}} className="absolute top-0 left-0 p-0 m-0">
                  jumps over the lazy dog
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
