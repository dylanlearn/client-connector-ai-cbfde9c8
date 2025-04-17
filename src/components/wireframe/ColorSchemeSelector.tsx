
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/colorpicker";
import { cn } from "@/lib/utils";
import { Heart, Save } from "lucide-react";
import { useDesignMemory } from "@/hooks/wireframe/use-design-memory";

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface ColorSchemeSelectorProps {
  colorScheme: ColorScheme;
  onChange: (newScheme: ColorScheme) => void;
  className?: string;
  showSaveControls?: boolean;
}

const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
  colorScheme,
  onChange,
  className,
  showSaveControls = false
}) => {
  const { 
    favoriteColorSchemes, 
    toggleFavoriteColorScheme, 
    isFavoriteColorScheme,
    addRecentColorScheme
  } = useDesignMemory();
  
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    setIsFavorite(isFavoriteColorScheme(colorScheme));
  }, [colorScheme, isFavoriteColorScheme]);

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    onChange({
      ...colorScheme,
      [key]: value
    });
  };

  const handleToggleFavorite = () => {
    toggleFavoriteColorScheme(colorScheme);
    setIsFavorite(!isFavorite);
  };

  const handleSaveToRecent = () => {
    addRecentColorScheme(colorScheme);
  };

  const colorOptions = [
    { name: "primary", label: "Primary", color: colorScheme.primary },
    { name: "secondary", label: "Secondary", color: colorScheme.secondary },
    { name: "accent", label: "Accent", color: colorScheme.accent },
    { name: "background", label: "Background", color: colorScheme.background },
    { name: "text", label: "Text", color: colorScheme.text }
  ];

  // Predefined color palettes
  const colorPalettes = [
    { 
      name: "Modern Blue", 
      colors: { 
        primary: "#3B82F6", 
        secondary: "#6366F1", 
        accent: "#F59E0B", 
        background: "#FFFFFF",
        text: "#1F2937" 
      } 
    },
    { 
      name: "Dark Mode", 
      colors: { 
        primary: "#60A5FA", 
        secondary: "#A78BFA", 
        accent: "#FBBF24", 
        background: "#111827",
        text: "#F9FAFB" 
      } 
    },
    { 
      name: "Nature", 
      colors: { 
        primary: "#059669", 
        secondary: "#10B981", 
        accent: "#F59E0B", 
        background: "#F9FAFB",
        text: "#1F2937" 
      } 
    },
    { 
      name: "Vibrant", 
      colors: { 
        primary: "#8B5CF6", 
        secondary: "#EC4899", 
        accent: "#F97316", 
        background: "#FFFFFF",
        text: "#111827" 
      } 
    },
    { 
      name: "Professional", 
      colors: { 
        primary: "#1E40AF", 
        secondary: "#3B82F6", 
        accent: "#D1D5DB", 
        background: "#F3F4F6",
        text: "#111827" 
      } 
    },
    { 
      name: "Earthy", 
      colors: { 
        primary: "#92400E", 
        secondary: "#D97706", 
        accent: "#65A30D", 
        background: "#FFFBEB",
        text: "#422006" 
      } 
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-base">Color Palette</Label>
        
        {showSaveControls && (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSaveToRecent}
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button
              variant={isFavorite ? "default" : "ghost"}
              size="sm"
              onClick={handleToggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {colorPalettes.map((palette) => (
          <button
            key={palette.name}
            onClick={() => onChange(palette.colors)}
            className="inline-flex items-center rounded-md px-2 py-1 text-xs bg-white border shadow-sm hover:bg-gray-50"
            type="button"
          >
            <div className="flex mr-1 space-x-1">
              {Object.values(palette.colors).slice(0, 3).map((color, i) => (
                <div 
                  key={i}
                  className="w-3 h-3 rounded-full border border-gray-200" 
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {palette.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {colorOptions.map((option) => (
          <div key={option.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={option.name} className="text-xs">
                {option.label}
              </Label>
              <div 
                className="w-4 h-4 rounded-full border border-gray-200" 
                style={{ backgroundColor: option.color }}
              />
            </div>
            <div className="flex items-center gap-2">
              <ColorPicker
                value={option.color}
                onChange={(color) => handleColorChange(option.name as keyof ColorScheme, color)}
              />
              <Input
                id={option.name}
                type="text"
                value={option.color}
                onChange={(e) => handleColorChange(option.name as keyof ColorScheme, e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-1 pt-2">
        <div className="h-6 w-full p-1 rounded text-xs font-medium flex items-center justify-center" 
          style={{ backgroundColor: colorScheme.primary, color: "#fff" }}>
          Primary
        </div>
        <div className="h-6 flex-1 p-1 rounded text-xs font-medium flex items-center justify-center" 
          style={{ backgroundColor: colorScheme.secondary, color: "#fff" }}>
          Secondary
        </div>
        <div className="h-6 w-1/4 p-1 rounded text-xs font-medium flex items-center justify-center" 
          style={{ backgroundColor: colorScheme.accent, color: "#fff" }}>
          Accent
        </div>
        <div className="h-6 w-full rounded border flex items-center justify-center text-xs" 
          style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
          Background with text
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeSelector;
