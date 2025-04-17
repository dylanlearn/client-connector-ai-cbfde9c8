
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ColorPaletteGenerator from './color/ColorPaletteGenerator';
import ColorThemePreview from './color/ColorThemePreview';
import AccessibilityChecker from './color/AccessibilityChecker';
import ColorSchemeSelector from './ColorSchemeSelector';
import { ColorScheme } from './ColorSchemeSelector';
import { useDesignMemory } from '@/hooks/wireframe/use-design-memory';

export interface ColorManagementSystemProps {
  initialColorScheme?: ColorScheme;
  onChange?: (colorScheme: ColorScheme) => void;
  className?: string;
}

export const ColorManagementSystem: React.FC<ColorManagementSystemProps> = ({
  initialColorScheme = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#111827'
  },
  onChange,
  className
}) => {
  const [activeTab, setActiveTab] = useState('palette');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(initialColorScheme);
  const { 
    addRecentColorScheme, 
    favoriteColorSchemes, 
    toggleFavoriteColorScheme, 
    isFavoriteColorScheme 
  } = useDesignMemory();

  useEffect(() => {
    if (initialColorScheme) {
      setColorScheme(initialColorScheme);
    }
  }, [initialColorScheme]);

  const handleColorSchemeChange = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme);
    if (onChange) {
      onChange(newColorScheme);
    }
    addRecentColorScheme(newColorScheme);
  };

  const handleSaveToFavorites = () => {
    toggleFavoriteColorScheme(colorScheme);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Color Management System</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="palette" className="flex-1">Palette</TabsTrigger>
            <TabsTrigger value="themes" className="flex-1">Themes</TabsTrigger>
            <TabsTrigger value="accessibility" className="flex-1">Accessibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="palette" className="space-y-4">
            <ColorSchemeSelector
              colorScheme={colorScheme}
              onChange={handleColorSchemeChange}
            />
            <div className="mt-4">
              <ColorPaletteGenerator
                baseColor={colorScheme.primary}
                onGenerateScheme={handleColorSchemeChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="themes" className="space-y-4">
            <ColorThemePreview colorScheme={colorScheme} />
          </TabsContent>
          
          <TabsContent value="accessibility" className="space-y-4">
            <AccessibilityChecker colorScheme={colorScheme} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ColorManagementSystem;
