
import React, { useState, useEffect } from 'react';
import { WireframeTypography } from '@/services/ai/wireframe/wireframe-types';
import { TypographyPreview } from './TypographyPreview';
import { TypographyControls } from './TypographyControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTypographySystem } from '@/hooks/wireframe/use-typography-system';

export interface TypographyManagerProps {
  typography: WireframeTypography;
  onChange: (typography: WireframeTypography) => void;
  darkMode?: boolean;
}

/**
 * Typography Management System - Manages and visualizes typography settings
 */
export const TypographyManager: React.FC<TypographyManagerProps> = ({
  typography,
  onChange,
  darkMode = false,
}) => {
  const {
    fontFamilies,
    typographyScale,
    lineHeights,
    fontWeights,
    generateScalePreview,
    generateSystemCSS,
  } = useTypographySystem(typography);

  const [activeTab, setActiveTab] = useState<string>('preview');

  const handleTypographyChange = (updates: Partial<WireframeTypography>) => {
    onChange({
      ...typography,
      ...updates,
    });
  };

  // Generate CSS for the typography system
  const systemCSS = generateSystemCSS();

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Typography System</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4 px-6">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="scale">Scale</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="px-6 pb-6">
            <ScrollArea className="h-[400px]">
              <TypographyPreview 
                typography={typography} 
                darkMode={darkMode}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="controls" className="px-6 pb-6">
            <TypographyControls
              typography={typography}
              onChange={handleTypographyChange}
              fontFamilies={fontFamilies}
              lineHeights={lineHeights}
              fontWeights={fontWeights}
            />
          </TabsContent>

          <TabsContent value="scale" className="px-6 pb-6">
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Typographic Scale</h3>
                <div className="space-y-6">
                  {generateScalePreview()}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">CSS Variables</h3>
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                    {systemCSS}
                  </pre>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
