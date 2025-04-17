
import React, { useState } from 'react';
import { ColorScheme } from '../ColorSchemeSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ColorThemePreviewProps {
  colorScheme: ColorScheme;
}

const ColorThemePreview: React.FC<ColorThemePreviewProps> = ({ colorScheme }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeVariant, setActiveVariant] = useState<'default' | 'high-contrast' | 'muted'>('default');

  // Generate a muted version of the color scheme
  const mutedColorScheme: ColorScheme = {
    primary: adjustColorSaturation(colorScheme.primary, -20),
    secondary: adjustColorSaturation(colorScheme.secondary, -20),
    accent: adjustColorSaturation(colorScheme.accent, -20),
    background: darkMode ? '#18181b' : '#fafafa',
    text: darkMode ? '#f4f4f5' : '#18181b'
  };

  // Generate high contrast version
  const highContrastColorScheme: ColorScheme = {
    primary: adjustColorSaturation(colorScheme.primary, 10),
    secondary: adjustColorSaturation(colorScheme.secondary, 10),
    accent: adjustColorSaturation(colorScheme.accent, 10),
    background: darkMode ? '#000000' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000'
  };

  // Choose the active scheme based on the variant
  const activeColorScheme = 
    activeVariant === 'muted' ? mutedColorScheme :
    activeVariant === 'high-contrast' ? highContrastColorScheme :
    colorScheme;

  // Function to adjust color saturation
  function adjustColorSaturation(hexColor: string, saturationAdjustment: number): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Convert RGB to HSL
    let [h, s, l] = rgbToHsl(r, g, b);
    
    // Adjust saturation
    s = Math.max(0, Math.min(100, s + saturationAdjustment));
    
    // Convert back to hex
    return hslToHex(h, s, l);
  }

  // RGB to HSL conversion
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h = Math.round(h * 60);
    }
    
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return [h, s, l];
  };
  
  // HSL to HEX conversion
  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Theme Preview</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch 
            id="dark-mode" 
            checked={darkMode} 
            onCheckedChange={setDarkMode} 
          />
        </div>
      </div>

      <Tabs value={activeVariant} onValueChange={(v) => setActiveVariant(v as any)} className="mb-4">
        <TabsList className="w-full">
          <TabsTrigger value="default" className="flex-1">Default</TabsTrigger>
          <TabsTrigger value="muted" className="flex-1">Muted</TabsTrigger>
          <TabsTrigger value="high-contrast" className="flex-1">High Contrast</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Theme preview */}
      <div 
        className="rounded-lg p-6 transition-colors"
        style={{ 
          backgroundColor: activeColorScheme.background,
          color: activeColorScheme.text 
        }}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold" style={{ color: activeColorScheme.text }}>
              Theme Preview
            </h2>
            <p style={{ color: activeColorScheme.text }}>
              This is how your color scheme looks with {darkMode ? 'dark' : 'light'} mode and {activeVariant} variant.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button style={{ 
              backgroundColor: activeColorScheme.primary,
              color: '#ffffff'
            }}>
              Primary Button
            </Button>
            <Button variant="outline" style={{ 
              borderColor: activeColorScheme.primary,
              color: activeColorScheme.primary
            }}>
              Outline Button
            </Button>
            <Button style={{ 
              backgroundColor: activeColorScheme.secondary,
              color: '#ffffff'
            }}>
              Secondary Button
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge style={{ backgroundColor: activeColorScheme.primary }}>Primary</Badge>
            <Badge style={{ backgroundColor: activeColorScheme.secondary }}>Secondary</Badge>
            <Badge style={{ backgroundColor: activeColorScheme.accent }}>Accent</Badge>
          </div>

          <Card style={{ backgroundColor: darkMode ? '#2a2a2a' : '#ffffff', borderColor: darkMode ? '#3a3a3a' : '#e5e5e5' }}>
            <CardHeader>
              <CardTitle style={{ color: activeColorScheme.primary }}>Card Example</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: darkMode ? '#e0e0e0' : '#333333' }}>
                This card demonstrates how components appear with your selected color scheme.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" style={{ backgroundColor: activeColorScheme.secondary, color: '#ffffff' }}>Action</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColorThemePreview;
