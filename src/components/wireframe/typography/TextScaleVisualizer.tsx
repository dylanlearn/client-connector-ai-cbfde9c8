
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface TextScaleVisualizerProps {
  headingFont: string;
  bodyFont: string;
  scaleRatio?: number;
}

/**
 * Text Scale Visualizer - Shows typographic scale relationships
 */
export const TextScaleVisualizer: React.FC<TextScaleVisualizerProps> = ({
  headingFont,
  bodyFont,
  scaleRatio = 1.25,
}) => {
  // Calculate the scale steps
  const baseSize = 16; // 1rem = 16px
  const steps = [
    { name: '4xl', scale: Math.pow(scaleRatio, 4), font: headingFont },
    { name: '3xl', scale: Math.pow(scaleRatio, 3), font: headingFont },
    { name: '2xl', scale: Math.pow(scaleRatio, 2), font: headingFont },
    { name: 'xl', scale: scaleRatio, font: headingFont },
    { name: 'lg', scale: scaleRatio * 0.9, font: bodyFont },
    { name: 'base', scale: 1, font: bodyFont },
    { name: 'sm', scale: 0.875, font: bodyFont },
    { name: 'xs', scale: 0.75, font: bodyFont },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Typography Scale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step, index) => {
          const fontSize = baseSize * step.scale;
          const rem = fontSize / 16;
          
          return (
            <div
              key={step.name}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b pb-3 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 text-xs text-muted-foreground">
                  {step.name}
                </div>
                <span
                  style={{
                    fontFamily: step.font,
                    fontSize: `${rem}rem`,
                    lineHeight: index < 4 ? 1.1 : 1.5,
                    fontWeight: index < 4 ? 700 : 400,
                  }}
                  className="truncate"
                >
                  {step.name === 'base' ? (
                    <>The quick brown fox jumps over the lazy dog</>
                  ) : (
                    <>Typography Scale</>
                  )}
                </span>
              </div>
              <div className="text-xs text-muted-foreground ml-16 md:ml-0">
                {fontSize.toFixed(1)}px / {rem.toFixed(3)}rem
              </div>
            </div>
          );
        })}
        
        <div className="border-t pt-4 text-xs text-muted-foreground">
          <p>Scale ratio: {scaleRatio} (Major Third)</p>
          <p>Base size: {baseSize}px (1rem)</p>
        </div>
      </CardContent>
    </Card>
  );
};
