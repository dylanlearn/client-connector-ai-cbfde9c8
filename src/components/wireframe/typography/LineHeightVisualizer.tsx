
import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface LineHeightVisualizerProps {
  fontFamily: string;
  showGuides?: boolean;
  className?: string;
}

/**
 * Line Height Visualizer - Visual tool for line height settings
 */
export const LineHeightVisualizer: React.FC<LineHeightVisualizerProps> = ({
  fontFamily = 'Inter, sans-serif',
  showGuides = true,
  className
}) => {
  const lineHeights = [
    { value: '1', label: 'Tight (1.0)' },
    { value: '1.2', label: 'Compact (1.2)' },
    { value: '1.5', label: 'Normal (1.5)' },
    { value: '1.7', label: 'Relaxed (1.7)' },
    { value: '2', label: 'Loose (2.0)' }
  ];

  const sampleText = 'The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.';

  return (
    <div className={cn("line-height-visualizer space-y-4", className)}>
      <Tabs defaultValue="1.5">
        <TabsList className="grid grid-cols-5">
          {lineHeights.map((lh) => (
            <TabsTrigger key={lh.value} value={lh.value}>
              {lh.value}
            </TabsTrigger>
          ))}
        </TabsList>

        {lineHeights.map((lh) => (
          <TabsContent key={lh.value} value={lh.value} className="pt-4">
            <div className="border rounded-md p-4 bg-muted/5">
              <h3 className="text-sm font-medium mb-2">
                Line Height: {lh.label}
              </h3>
              
              <div className="relative">
                {showGuides && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full grid" style={{ 
                      backgroundSize: `100% calc(1em * ${lh.value})`,
                      backgroundImage: 'linear-gradient(to bottom, rgba(100, 116, 139, 0.05) 1px, transparent 1px)'
                    }}></div>
                  </div>
                )}
                
                <p
                  style={{
                    fontFamily: fontFamily,
                    lineHeight: lh.value
                  }}
                  className="relative z-10"
                >
                  {sampleText}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>Font: {fontFamily.split(',')[0]}</span>
                <span>Line Height: {lh.value}</span>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="p-4 border rounded-md bg-muted/5">
        <h3 className="text-sm font-medium mb-2">Line Height Comparison</h3>
        <div className="space-y-6 mt-4">
          {lineHeights.map((lh) => (
            <div key={lh.value} className="relative">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{lh.label}</span>
                <span>Line Height: {lh.value}</span>
              </div>
              
              <div className="relative h-16 overflow-hidden border rounded">
                {showGuides && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full grid" style={{ 
                      backgroundSize: `100% calc(1em * ${lh.value})`,
                      backgroundImage: 'linear-gradient(to bottom, rgba(100, 116, 139, 0.1) 1px, transparent 1px)'
                    }}></div>
                  </div>
                )}
                
                <p
                  style={{
                    fontFamily: fontFamily,
                    lineHeight: lh.value
                  }}
                  className="p-2"
                >
                  {sampleText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
