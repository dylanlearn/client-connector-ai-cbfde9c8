
import React from 'react';
import { Card } from '@/components/ui/card';

export interface TypographyPreviewProps {
  headingFont: string;
  bodyFont: string;
  scaleRatio: number;
  lineHeights: {
    heading: number;
    body: number;
  };
  darkMode?: boolean;
}

export const TypographyPreview: React.FC<TypographyPreviewProps> = ({
  headingFont,
  bodyFont,
  scaleRatio,
  lineHeights,
  darkMode = false
}) => {
  // Calculate font sizes based on scale ratio
  const h1Size = 2.5 * scaleRatio;
  const h2Size = 2 * scaleRatio;
  const h3Size = 1.75 * scaleRatio;
  const bodySize = 1;
  const smallSize = 0.875;

  return (
    <Card className={`p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : ''}`}>
      <div className="space-y-6">
        <div>
          <h1 
            style={{ 
              fontFamily: headingFont, 
              fontSize: `${h1Size}rem`,
              lineHeight: lineHeights.heading,
              fontWeight: 700
            }}
          >
            Typography Preview
          </h1>
          <h2 
            style={{ 
              fontFamily: headingFont, 
              fontSize: `${h2Size}rem`,
              lineHeight: lineHeights.heading,
              fontWeight: 600
            }}
          >
            See how text will appear
          </h2>
          <h3 
            style={{ 
              fontFamily: headingFont, 
              fontSize: `${h3Size}rem`,
              lineHeight: lineHeights.heading,
              fontWeight: 600
            }}
          >
            With your design system
          </h3>
        </div>
        
        <div>
          <p 
            style={{ 
              fontFamily: bodyFont, 
              fontSize: `${bodySize}rem`,
              lineHeight: lineHeights.body
            }}
            className="mb-4"
          >
            This is how body text will appear in your wireframe. The typography system controls font
            families, sizes, weights, and line heights across your design.
          </p>
          
          <p 
            style={{ 
              fontFamily: bodyFont, 
              fontSize: `${smallSize}rem`,
              lineHeight: lineHeights.body
            }}
            className="text-muted-foreground"
          >
            This is smaller text often used for captions, footnotes, or supporting information.
          </p>
        </div>
      </div>
    </Card>
  );
};
