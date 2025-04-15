
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { WireframeColorScheme, WireframeTypography } from '@/services/ai/wireframe/wireframe-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StyleEditorProps {
  colorScheme?: WireframeColorScheme;
  typography?: WireframeTypography;
  onUpdate: (updates: Partial<any>) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ 
  colorScheme, 
  typography, 
  onUpdate 
}) => {
  const handleColorChange = (key: keyof WireframeColorScheme, color: string) => {
    onUpdate({ 
      colorScheme: { 
        ...colorScheme, 
        [key]: color 
      } 
    });
  };

  const handleTypographyChange = (key: keyof WireframeTypography, value: string) => {
    onUpdate({ 
      typography: { 
        ...typography, 
        [key]: value 
      } 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Style Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['primary', 'secondary', 'accent'] as const).map(color => (
              <div key={color} className="space-y-1">
                <Label>{color.charAt(0).toUpperCase() + color.slice(1)}</Label>
                <ColorPicker
                  value={colorScheme?.[color] || '#000000'}
                  onChange={(newColor) => handleColorChange(color, newColor)}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Typography</Label>
          <div className="grid gap-2">
            <Select 
              value={typography?.headings || 'Inter'}
              onValueChange={(value) => handleTypographyChange('headings', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Headings Font" />
              </SelectTrigger>
              <SelectContent>
                {['Inter', 'Roboto', 'Open Sans', 'Montserrat'].map(font => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={typography?.body || 'Inter'}
              onValueChange={(value) => handleTypographyChange('body', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Body Font" />
              </SelectTrigger>
              <SelectContent>
                {['Inter', 'Roboto', 'Open Sans', 'Montserrat'].map(font => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleEditor;
