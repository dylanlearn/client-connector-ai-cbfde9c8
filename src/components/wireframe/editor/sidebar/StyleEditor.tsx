
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { WireframeColorScheme, WireframeTypography } from '@/services/ai/wireframe/wireframe-types';

interface StyleEditorProps {
  colorScheme: WireframeColorScheme;
  typography: WireframeTypography;
  onChange: (styles: { colorScheme?: WireframeColorScheme; typography?: WireframeTypography }) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({
  colorScheme,
  typography,
  onChange
}) => {
  // Handle color change
  const handleColorChange = (key: keyof WireframeColorScheme, color: string) => {
    onChange({
      colorScheme: {
        ...colorScheme,
        [key]: color
      }
    });
  };
  
  // Handle font change
  const handleFontChange = (key: keyof WireframeTypography, font: string) => {
    onChange({
      typography: {
        ...typography,
        [key]: font
      }
    });
  };
  
  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Raleway',
    'Oswald',
    'Merriweather'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary</Label>
              <div className="flex items-center gap-2">
                <ColorPicker 
                  value={colorScheme.primary} 
                  onChange={(color) => handleColorChange('primary', color)} 
                />
                <Input 
                  id="primary-color" 
                  value={colorScheme.primary} 
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary</Label>
              <div className="flex items-center gap-2">
                <ColorPicker 
                  value={colorScheme.secondary} 
                  onChange={(color) => handleColorChange('secondary', color)} 
                />
                <Input 
                  id="secondary-color" 
                  value={colorScheme.secondary} 
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent</Label>
              <div className="flex items-center gap-2">
                <ColorPicker 
                  value={colorScheme.accent} 
                  onChange={(color) => handleColorChange('accent', color)} 
                />
                <Input 
                  id="accent-color" 
                  value={colorScheme.accent} 
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="background-color">Background</Label>
              <div className="flex items-center gap-2">
                <ColorPicker 
                  value={colorScheme.background} 
                  onChange={(color) => handleColorChange('background', color)} 
                />
                <Input 
                  id="background-color" 
                  value={colorScheme.background} 
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text-color">Text</Label>
              <div className="flex items-center gap-2">
                <ColorPicker 
                  value={colorScheme.text} 
                  onChange={(color) => handleColorChange('text', color)} 
                />
                <Input 
                  id="text-color" 
                  value={colorScheme.text} 
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="flex-1" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headings-font">Headings Font</Label>
              <Select 
                value={typography.headings} 
                onValueChange={(value) => handleFontChange('headings', value)}
              >
                <SelectTrigger id="headings-font">
                  <SelectValue placeholder="Select font..." />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map(font => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body-font">Body Font</Label>
              <Select 
                value={typography.body} 
                onValueChange={(value) => handleFontChange('body', value)}
              >
                <SelectTrigger id="body-font">
                  <SelectValue placeholder="Select font..." />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map(font => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleEditor;
