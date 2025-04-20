
import React, { useMemo } from 'react';
import { WireframeTypography } from '@/services/ai/wireframe/wireframe-types';

interface TypographySystemOptions {
  baseSize?: number; // in pixels
  scaleRatio?: number;
}

/**
 * Hook for managing typography system
 */
export const useTypographySystem = (
  typography: WireframeTypography,
  options: TypographySystemOptions = {}
) => {
  const { baseSize = 16, scaleRatio = 1.25 } = options;
  
  // Available font families - could be extended or loaded dynamically
  const fontFamilies = useMemo(() => [
    'Inter',
    'Raleway',
    'Roboto', 
    'Open Sans', 
    'Montserrat',
    'Playfair Display', 
    'Source Sans Pro',
    'Lato',
    'Merriweather',
    'Poppins',
    'Work Sans',
    'Nunito',
    'PT Serif',
    'Fira Sans',
    'DM Sans'
  ], []);

  // Line height options
  const lineHeights = useMemo(() => [
    { label: 'Tight (1.0)', value: '1' },
    { label: 'Compact (1.2)', value: '1.2' },
    { label: 'Normal (1.5)', value: '1.5' },
    { label: 'Relaxed (1.7)', value: '1.7' },
    { label: 'Loose (2.0)', value: '2' }
  ], []);

  // Font weight options
  const fontWeights = useMemo(() => [
    { label: 'Thin (100)', value: '100' },
    { label: 'Extra Light (200)', value: '200' },
    { label: 'Light (300)', value: '300' },
    { label: 'Regular (400)', value: '400' },
    { label: 'Medium (500)', value: '500' },
    { label: 'Semi Bold (600)', value: '600' },
    { label: 'Bold (700)', value: '700' },
    { label: 'Extra Bold (800)', value: '800' },
    { label: 'Black (900)', value: '900' }
  ], []);

  // Calculate typographic scale
  const typographyScale = useMemo(() => {
    const scale = [];
    const levels = 8; // Number of scale steps to generate

    for (let i = 0; i < levels; i++) {
      const size = Math.round(baseSize * Math.pow(scaleRatio, i) * 100) / 100;
      const rem = size / 16; // Convert to rem
      
      scale.push({
        step: i,
        px: size,
        rem: rem,
        name: getScaleName(i)
      });
    }

    return scale;
  }, [baseSize, scaleRatio]);

  // Generate scale preview elements
  const generateScalePreview = () => {
    return (
      <div className="space-y-4">
        {typographyScale.map((step, index) => (
          <div key={index} className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{step.name}</span>
              <span className="text-xs text-muted-foreground">
                {step.px}px / {step.rem.toFixed(3)}rem
              </span>
            </div>
            <div
              style={{
                fontSize: `${step.rem}rem`,
                fontFamily: index > 2 ? typography.headings : typography.body,
                lineHeight: index > 2 ? 1.2 : 1.5,
                fontWeight: index > 2 ? 700 : 400
              }}
              className="truncate"
            >
              Typography Example
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Generate system CSS variables
  const generateSystemCSS = () => {
    return `/* Typography System CSS Variables */
:root {
  /* Base Typography */
  --font-family-headings: ${typography.headings || 'Inter'}, sans-serif;
  --font-family-body: ${typography.body || 'Inter'}, sans-serif;
  --font-size-base: ${baseSize}px;
  
  /* Typographic Scale */
${typographyScale
  .map(
    (step) =>
      `  --font-size-${step.name.toLowerCase()}: ${step.rem}rem; /* ${step.px}px */`
  )
  .join('\n')}

  /* Line Heights */
  --line-height-headings: 1.2;
  --line-height-body: 1.5;
  --line-height-tight: 1;
  --line-height-relaxed: 1.7;

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}`;
  };

  return {
    fontFamilies,
    typographyScale,
    lineHeights,
    fontWeights,
    generateScalePreview,
    generateSystemCSS
  };
};

// Helper function to get scale step name
function getScaleName(step: number): string {
  const names = [
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
  ];
  return names[step] || `text-${step}xl`;
}
