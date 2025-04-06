
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface ColorSchemeSelectorProps {
  colorScheme: ColorScheme;
  onChange: (newScheme: ColorScheme) => void;
  className?: string;
}

const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
  colorScheme,
  onChange,
  className
}) => {
  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    onChange({
      ...colorScheme,
      [key]: value
    });
  };

  const colorOptions = [
    { name: "primary", label: "Primary", color: colorScheme.primary },
    { name: "secondary", label: "Secondary", color: colorScheme.secondary },
    { name: "accent", label: "Accent", color: colorScheme.accent },
    { name: "background", label: "Background", color: colorScheme.background }
  ];

  // Predefined color palettes
  const colorPalettes = [
    { 
      name: "Modern Blue", 
      colors: { 
        primary: "#3B82F6", 
        secondary: "#6366F1", 
        accent: "#F59E0B", 
        background: "#FFFFFF" 
      } 
    },
    { 
      name: "Dark Mode", 
      colors: { 
        primary: "#60A5FA", 
        secondary: "#A78BFA", 
        accent: "#FBBF24", 
        background: "#111827" 
      } 
    },
    { 
      name: "Nature", 
      colors: { 
        primary: "#059669", 
        secondary: "#10B981", 
        accent: "#F59E0B", 
        background: "#F9FAFB" 
      } 
    },
    { 
      name: "Vibrant", 
      colors: { 
        primary: "#8B5CF6", 
        secondary: "#EC4899", 
        accent: "#F97316", 
        background: "#FFFFFF" 
      } 
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {colorPalettes.map((palette) => (
          <button
            key={palette.name}
            onClick={() => onChange(palette.colors)}
            className="inline-flex items-center rounded-md px-2 py-1 text-xs bg-white border shadow-sm hover:bg-gray-50"
            type="button"
          >
            <div className="flex mr-1 space-x-1">
              {Object.values(palette.colors).map((color, i) => (
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
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            <div className="relative">
              <Input
                id={option.name}
                type="text"
                value={option.color}
                onChange={(e) => handleColorChange(option.name as keyof ColorScheme, e.target.value)}
                className="pl-7"
              />
              <div 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: option.color }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-1 pt-2">
        <div className="h-6 w-full p-1 rounded text-xs font-medium flex items-center justify-center" style={{ backgroundColor: colorScheme.primary, color: "#fff" }}>
          Primary
        </div>
        <div className="h-6 flex-1 p-1 rounded text-xs font-medium flex items-center justify-center" style={{ backgroundColor: colorScheme.secondary, color: "#fff" }}>
          Secondary
        </div>
        <div className="h-6 w-1/4 p-1 rounded text-xs font-medium flex items-center justify-center" style={{ backgroundColor: colorScheme.accent, color: "#fff" }}>
          Accent
        </div>
        <div className="h-6 w-full rounded border flex items-center justify-center text-xs" style={{ backgroundColor: colorScheme.background, color: colorScheme.primary }}>
          Background with text
        </div>
      </div>
    </div>
  );
};

export default ColorSchemeSelector;
