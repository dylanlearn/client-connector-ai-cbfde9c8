
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import ColorManagementSystem from './ColorManagementSystem';
import ColorSchemeSelector, { ColorScheme } from './ColorSchemeSelector';
import AccessibilityChecker from './color/AccessibilityChecker';
import ColorThemePreview from './color/ColorThemePreview';
import ColorPaletteGenerator from './color/ColorPaletteGenerator';

const ColorManagementDemo: React.FC = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>({
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#111827'
  });
  const [width, setWidth] = useState(800);

  const handleColorSchemeChange = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme);
  };

  return (
    <div className="p-6 space-y-8">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl">Color Management System Demo</CardTitle>
      </CardHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Container Width ({width}px)</Label>
          <Slider 
            min={300} 
            max={1200} 
            step={10}
            value={[width]} 
            onValueChange={(value) => setWidth(value[0])}
          />
        </div>

        <div style={{ width: `${width}px`, margin: '0 auto' }}>
          <ColorManagementSystem 
            initialColorScheme={colorScheme} 
            onChange={handleColorSchemeChange} 
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Individual Components</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="palette" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="palette" className="flex-1">Palette</TabsTrigger>
              <TabsTrigger value="selector" className="flex-1">Selector</TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
              <TabsTrigger value="accessibility" className="flex-1">Accessibility</TabsTrigger>
            </TabsList>
            
            <TabsContent value="palette" className="space-y-4">
              <ColorPaletteGenerator
                baseColor={colorScheme.primary}
                onGenerateScheme={handleColorSchemeChange}
              />
            </TabsContent>
            
            <TabsContent value="selector" className="space-y-4">
              <ColorSchemeSelector
                colorScheme={colorScheme}
                onChange={handleColorSchemeChange}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <ColorThemePreview colorScheme={colorScheme} />
            </TabsContent>
            
            <TabsContent value="accessibility" className="space-y-4">
              <AccessibilityChecker colorScheme={colorScheme} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorManagementDemo;
