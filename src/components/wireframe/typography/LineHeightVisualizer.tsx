
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface LineHeightVisualizerProps {
  headingFont: string;
  bodyFont: string;
  lineHeights: {
    heading: number;
    body: number;
  };
  className?: string;
  darkMode?: boolean; // Add darkMode prop
}

/**
 * Line Height Visualizer - Shows how different line heights affect typography
 */
export const LineHeightVisualizer: React.FC<LineHeightVisualizerProps> = ({
  headingFont,
  bodyFont,
  lineHeights = { heading: 1.1, body: 1.5 },
  className,
  darkMode = false // Default to false
}) => {
  const sampleHeading = "The quick brown fox jumps over the lazy dog";
  const sampleBody = "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing.";
  
  return (
    <Card className={cn("overflow-hidden", className, darkMode ? 'bg-gray-900 text-gray-100' : '')}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Line Height Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Heading Font: {lineHeights.heading}x</h3>
            <div className="space-y-4">
              {[0.9, 1.1, 1.3, 1.5].map((lineHeight) => (
                <div key={lineHeight} className="border p-4 rounded-md space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
                    <span>Line Height: {lineHeight}x</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded",
                      lineHeight === lineHeights.heading 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}>
                      {lineHeight === lineHeights.heading ? "Current" : "Alternative"}
                    </span>
                  </div>
                  <h2 
                    style={{ 
                      fontFamily: headingFont,
                      lineHeight: lineHeight,
                      fontWeight: 700
                    }} 
                    className="text-xl"
                  >
                    {sampleHeading}
                  </h2>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Body Font: {lineHeights.body}x</h3>
            <div className="space-y-4">
              {[1.3, 1.5, 1.7, 1.9].map((lineHeight) => (
                <div key={lineHeight} className="border p-4 rounded-md space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
                    <span>Line Height: {lineHeight}x</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded",
                      lineHeight === lineHeights.body 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}>
                      {lineHeight === lineHeights.body ? "Current" : "Alternative"}
                    </span>
                  </div>
                  <p 
                    style={{ 
                      fontFamily: bodyFont,
                      lineHeight: lineHeight
                    }}
                  >
                    {sampleBody}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground border-t pt-4">
          <p>Optimal line height depends on font size and reading context:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Headings: 1.0-1.3x (tighter for impact)</li>
            <li>Body text: 1.4-1.6x (better readability)</li>
            <li>Small text: 1.5-1.7x (improved legibility)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
