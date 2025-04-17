
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Heart, Star, StarOff } from 'lucide-react';
import ColorPaletteGenerator from './color/ColorPaletteGenerator';
import ColorThemePreview from './color/ColorThemePreview';
import AccessibilityChecker from './color/AccessibilityChecker';
import ColorSchemeSelector from './ColorSchemeSelector';
import { ColorScheme } from './ColorSchemeSelector';
import { useDesignMemory } from '@/hooks/wireframe/use-design-memory';
import AdaptiveContainer from '@/components/wireframe/adaptation/AdaptiveContainer'; // Changed import
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
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
    
    toast({
      title: isFavoriteColorScheme(colorScheme) 
        ? "Removed from favorites" 
        : "Saved to favorites",
      description: isFavoriteColorScheme(colorScheme) 
        ? "Color scheme removed from your favorites" 
        : "Color scheme added to your favorites",
      duration: 3000,
    });
  };

  // Determine if the current color scheme is a favorite
  const isFavorite = isFavoriteColorScheme(colorScheme);

  return (
    <AdaptiveContainer className={className} minWidth={300} maxWidth={1200}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Color Management System</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveToFavorites}
              className="flex items-center gap-1"
              title={isFavorite ? "Remove from favorites" : "Save to favorites"}
            >
              {isFavorite ? (
                <>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="sr-only md:not-sr-only md:inline-block">Remove from Favorites</span>
                </>
              ) : (
                <>
                  <StarOff className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only md:inline-block">Add to Favorites</span>
                </>
              )}
            </Button>
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
          
          {favoriteColorSchemes.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Heart className="h-4 w-4 text-rose-500" />
                Favorite Color Schemes
              </h3>
              <div className="flex flex-wrap gap-2">
                {favoriteColorSchemes.map((scheme, index) => (
                  <button
                    key={`favorite-${index}`}
                    onClick={() => handleColorSchemeChange(scheme)}
                    className="h-6 w-6 rounded border shadow-sm transition-transform hover:scale-110"
                    style={{ 
                      background: `linear-gradient(to right, ${scheme.primary} 0%, ${scheme.secondary} 50%, ${scheme.accent} 100%)` 
                    }}
                    title="Click to apply this color scheme"
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AdaptiveContainer>
  );
};

export default ColorManagementSystem;
