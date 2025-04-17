
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/colorpicker';
import { AIColorService } from '@/services/ai/design/color-service';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2 } from 'lucide-react';
import { ColorScheme } from '../ColorSchemeSelector';

interface ColorPaletteGeneratorProps {
  baseColor: string;
  onGenerateScheme: (colorScheme: ColorScheme) => void;
}

const ColorPaletteGenerator: React.FC<ColorPaletteGeneratorProps> = ({
  baseColor,
  onGenerateScheme
}) => {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState(baseColor);
  const [industry, setIndustry] = useState("technology");
  const [mood, setMood] = useState("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [harmonyType, setHarmonyType] = useState("analogous");

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const generateHarmoniousColors = () => {
    // Simple algorithm for generating harmonious colors without AI
    const hex = selectedColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    let colors = {
      primary: selectedColor,
      secondary: '#000000',
      accent: '#000000',
      background: '#ffffff',
      text: '#000000'
    };
    
    // Generate different harmonious colors based on selected harmony type
    switch (harmonyType) {
      case 'analogous':
        // Analogous colors - adjacent on the color wheel
        colors.secondary = hslToHex((rgbToHsl(r, g, b)[0] + 30) % 360, 70, 60);
        colors.accent = hslToHex((rgbToHsl(r, g, b)[0] + 60) % 360, 80, 60);
        break;
      case 'complementary':
        // Complementary - opposite on the color wheel
        colors.secondary = hslToHex((rgbToHsl(r, g, b)[0] + 180) % 360, 70, 60);
        colors.accent = hslToHex((rgbToHsl(r, g, b)[0] + 90) % 360, 80, 65);
        break;
      case 'triadic':
        // Triadic - evenly spaced around the color wheel
        colors.secondary = hslToHex((rgbToHsl(r, g, b)[0] + 120) % 360, 70, 60);
        colors.accent = hslToHex((rgbToHsl(r, g, b)[0] + 240) % 360, 80, 65);
        break;
      case 'monochromatic':
        // Monochromatic - variations of the same hue
        const hsl = rgbToHsl(r, g, b);
        colors.secondary = hslToHex(hsl[0], Math.max(hsl[1] - 20, 0), Math.min(hsl[2] + 10, 100));
        colors.accent = hslToHex(hsl[0], Math.min(hsl[1] + 20, 100), Math.max(hsl[2] - 15, 0));
        break;
    }
    
    // Set text color based on background brightness
    colors.text = getBrightness(r, g, b) > 128 ? '#000000' : '#ffffff';
    
    return colors;
  };
  
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
  
  // Get brightness value
  const getBrightness = (r: number, g: number, b: number): number => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const generateAIColorPalette = async () => {
    setIsGenerating(true);
    try {
      const colorPalette = await AIColorService.suggestColorPalette({
        industry,
        mood,
        existingColors: [selectedColor],
        preferences: [harmonyType]
      });
      
      // Map the AI service response to our color scheme format
      const colorScheme: ColorScheme = {
        primary: findColorByUsage(colorPalette, 'primary') || selectedColor,
        secondary: findColorByUsage(colorPalette, 'secondary') || '#000000',
        accent: findColorByUsage(colorPalette, 'accent') || '#000000',
        background: findColorByUsage(colorPalette, 'background') || '#ffffff',
        text: findColorByUsage(colorPalette, 'text') || '#000000',
      };
      
      onGenerateScheme(colorScheme);
      toast({
        title: "AI Color Palette Generated",
        description: "Your color palette has been generated using AI recommendations."
      });
    } catch (error) {
      console.error("Error generating AI color palette:", error);
      // Fall back to algorithm-based palette
      const algorithmicColors = generateHarmoniousColors();
      onGenerateScheme(algorithmicColors);
      
      toast({
        title: "Using Algorithmic Palette",
        description: "AI generation failed. Generated a palette using color theory algorithms.",
        variant: "default"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const findColorByUsage = (colors: Array<{name: string, hex: string, usage: string}>, usage: string): string | undefined => {
    return colors.find(color => color.usage.toLowerCase() === usage.toLowerCase())?.hex;
  };

  const handleQuickGenerate = () => {
    const colors = generateHarmoniousColors();
    onGenerateScheme(colors);
    toast({
      title: "Color Palette Generated",
      description: `Generated a ${harmonyType} color palette.`
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Color Palette Generator</h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Base Color</Label>
          <div className="flex items-center gap-2">
            <ColorPicker value={selectedColor} onChange={handleColorChange} />
            <Input 
              value={selectedColor} 
              onChange={(e) => setSelectedColor(e.target.value)} 
              className="font-mono"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Harmony Type</Label>
          <Select value={harmonyType} onValueChange={setHarmonyType}>
            <SelectTrigger>
              <SelectValue placeholder="Select harmony type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analogous">Analogous</SelectItem>
              <SelectItem value="complementary">Complementary</SelectItem>
              <SelectItem value="triadic">Triadic</SelectItem>
              <SelectItem value="monochromatic">Monochromatic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="food">Food & Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Mood/Style</Label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger>
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="elegant">Elegant</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="retro">Retro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleQuickGenerate}
          variant="secondary"
          className="flex-1"
        >
          Quick Generate
        </Button>
        <Button
          onClick={generateAIColorPalette}
          disabled={isGenerating}
          className="flex-1"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;
