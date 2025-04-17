
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Heart, Star, StarOff, Save, Info, Copy, AlertCircle } from 'lucide-react';
import ColorPaletteGenerator from './color/ColorPaletteGenerator';
import ColorThemePreview from './color/ColorThemePreview';
import AccessibilityChecker from './color/AccessibilityChecker';
import ColorSchemeSelector, { ColorScheme } from './ColorSchemeSelector';
import { useDesignMemory } from '@/hooks/wireframe/use-design-memory';
import AdaptiveContainer from './adaptation/AdaptiveContainer';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ColorManagementSystemProps {
  initialColorScheme?: ColorScheme;
  onChange?: (colorScheme: ColorScheme) => void;
  className?: string;
  onExport?: (format: 'json' | 'css' | 'tailwind') => void;
  readOnly?: boolean;
}

/**
 * Advanced Color Management System
 * 
 * A comprehensive color system with palettes, themes, accessibility checking,
 * and context-aware color application across the wireframe.
 */
export const ColorManagementSystem: React.FC<ColorManagementSystemProps> = ({
  initialColorScheme = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#111827'
  },
  onChange,
  className,
  onExport,
  readOnly = false
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

  // Performance optimization - memoize derived values
  const isFavorite = useMemo(() => 
    isFavoriteColorScheme(colorScheme), 
    [colorScheme, isFavoriteColorScheme]
  );

  // Use useEffect with dependency array to optimize updates
  useEffect(() => {
    if (initialColorScheme) {
      setColorScheme(initialColorScheme);
    }
  }, [initialColorScheme]);

  // Extract to useCallback for performance
  const handleColorSchemeChange = useCallback((newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme);
    if (onChange) {
      onChange(newColorScheme);
    }
    addRecentColorScheme(newColorScheme);
  }, [onChange, addRecentColorScheme]);

  const handleSaveToFavorites = useCallback(() => {
    try {
      toggleFavoriteColorScheme(colorScheme);
      
      toast({
        title: isFavorite 
          ? "Removed from favorites" 
          : "Saved to favorites",
        description: isFavorite 
          ? "Color scheme removed from your favorites" 
          : "Color scheme added to your favorites",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error saving favorites",
        description: "Could not update favorites. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Failed to toggle favorite:", error);
    }
  }, [colorScheme, isFavorite, toggleFavoriteColorScheme, toast]);

  const handleExport = useCallback((format: 'json' | 'css' | 'tailwind') => {
    try {
      if (onExport) {
        onExport(format);
      } else {
        // Default export behavior
        let exportContent = '';
        
        switch(format) {
          case 'json':
            exportContent = JSON.stringify(colorScheme, null, 2);
            navigator.clipboard.writeText(exportContent);
            break;
          case 'css':
            exportContent = `:root {\n  --color-primary: ${colorScheme.primary};\n  --color-secondary: ${colorScheme.secondary};\n  --color-accent: ${colorScheme.accent};\n  --color-background: ${colorScheme.background};\n  --color-text: ${colorScheme.text};\n}`;
            navigator.clipboard.writeText(exportContent);
            break;
          case 'tailwind':
            exportContent = `// Add to tailwind.config.js\ncolors: {\n  primary: '${colorScheme.primary}',\n  secondary: '${colorScheme.secondary}',\n  accent: '${colorScheme.accent}',\n  background: '${colorScheme.background}',\n  text: '${colorScheme.text}',\n}`;
            navigator.clipboard.writeText(exportContent);
            break;
        }
        
        toast({
          title: `Copied as ${format.toUpperCase()}`,
          description: "Color scheme copied to clipboard",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export the color scheme",
        variant: "destructive",
        duration: 5000,
      });
      console.error("Failed to export:", error);
    }
  }, [colorScheme, onExport, toast]);

  // Render helpers for better code organization
  const renderFavoriteButton = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSaveToFavorites}
      className="flex items-center gap-1"
      title={isFavorite ? "Remove from favorites" : "Save to favorites"}
      disabled={readOnly}
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
  );

  const renderExportOptions = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={() => handleExport('json')} className="flex items-center gap-1">
        <Copy className="h-3 w-3" />
        <span>JSON</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleExport('css')} className="flex items-center gap-1">
        <Copy className="h-3 w-3" />
        <span>CSS</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleExport('tailwind')} className="flex items-center gap-1">
        <Copy className="h-3 w-3" />
        <span>Tailwind</span>
      </Button>
    </div>
  );

  const renderFavoriteSchemes = () => {
    if (favoriteColorSchemes.length === 0) return null;
    
    return (
      <div className="mt-6 pt-4 border-t">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
          <Heart className="h-4 w-4 text-rose-500" />
          Favorite Color Schemes
        </h3>
        <div className="flex flex-wrap gap-2">
          {favoriteColorSchemes.map((scheme, index) => (
            <TooltipProvider key={`favorite-${index}`}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleColorSchemeChange(scheme)}
                    className="h-6 w-6 rounded border shadow-sm transition-transform hover:scale-110"
                    style={{ 
                      background: `linear-gradient(to right, ${scheme.primary} 0%, ${scheme.secondary} 50%, ${scheme.accent} 100%)` 
                    }}
                    disabled={readOnly}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Primary: {scheme.primary}</p>
                  <p>Secondary: {scheme.secondary}</p>
                  <p>Accent: {scheme.accent}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AdaptiveContainer className={className} minWidth={300} maxWidth={1200}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              Color Management System
              {!readOnly && (
                <Badge variant="outline" className="ml-2 text-xs font-normal">
                  {activeTab === 'palette' ? 'Palette' : activeTab === 'themes' ? 'Themes' : 'Accessibility'}
                </Badge>
              )}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            {!readOnly && renderFavoriteButton()}
            {!readOnly && onExport && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleExport('json')} 
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:inline-block">Export</span>
              </Button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Color System Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>The color management system provides tools for creating and testing color schemes.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          {readOnly ? (
            <div className="space-y-4">
              <ColorThemePreview colorScheme={colorScheme} />
            </div>
          ) : (
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
                
                {onExport && renderExportOptions()}
              </TabsContent>
              
              <TabsContent value="themes" className="space-y-4">
                <ColorThemePreview colorScheme={colorScheme} />
              </TabsContent>
              
              <TabsContent value="accessibility" className="space-y-4">
                <AccessibilityChecker colorScheme={colorScheme} />
              </TabsContent>
            </Tabs>
          )}
          
          {renderFavoriteSchemes()}
        </CardContent>
      </Card>
    </AdaptiveContainer>
  );
};

export default ColorManagementSystem;
