
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export interface TypographyControlsProps {
  headingFont: string;
  bodyFont: string;
  scaleRatio: number;
  lineHeights: {
    heading: number;
    body: number;
  };
  onFontChange: (type: 'heading' | 'body', font: string) => void;
  onScaleChange: (value: number) => void;
  onLineHeightChange: (type: 'heading' | 'body', value: number) => void;
  darkMode?: boolean;
}

export const TypographyControls: React.FC<TypographyControlsProps> = ({
  headingFont,
  bodyFont,
  scaleRatio,
  lineHeights,
  onFontChange,
  onScaleChange,
  onLineHeightChange,
  darkMode = false
}) => {
  // Common fonts
  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'Poppins', 'Raleway', 'Source Sans Pro', 'Merriweather', 'Playfair Display'
  ];

  return (
    <Card className={darkMode ? 'bg-gray-900 text-gray-100' : ''}>
      <CardContent className="p-6 space-y-6">
        {/* Heading Font */}
        <div className="space-y-2">
          <Label>Heading Font</Label>
          <Select
            value={headingFont}
            onValueChange={(value) => onFontChange('heading', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Body Font */}
        <div className="space-y-2">
          <Label>Body Font</Label>
          <Select
            value={bodyFont}
            onValueChange={(value) => onFontChange('body', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Scale Ratio */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Scale Ratio</Label>
            <span className="text-sm text-muted-foreground">{scaleRatio.toFixed(2)}</span>
          </div>
          <Slider 
            min={1.05} 
            max={1.5} 
            step={0.01} 
            defaultValue={[scaleRatio]}
            onValueChange={(values) => onScaleChange(values[0])}
            aria-label="Scale Ratio"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Smaller (1.05)</span>
            <span>Larger (1.5)</span>
          </div>
        </div>
        
        {/* Heading Line Height */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Heading Line Height</Label>
            <span className="text-sm text-muted-foreground">{lineHeights.heading.toFixed(1)}x</span>
          </div>
          <Slider 
            min={0.9} 
            max={1.6} 
            step={0.1} 
            defaultValue={[lineHeights.heading]}
            onValueChange={(values) => onLineHeightChange('heading', values[0])}
            aria-label="Heading Line Height"
          />
        </div>
        
        {/* Body Line Height */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Body Line Height</Label>
            <span className="text-sm text-muted-foreground">{lineHeights.body.toFixed(1)}x</span>
          </div>
          <Slider 
            min={1.2} 
            max={2.0} 
            step={0.1} 
            defaultValue={[lineHeights.body]}
            onValueChange={(values) => onLineHeightChange('body', values[0])}
            aria-label="Body Line Height"
          />
        </div>
      </CardContent>
    </Card>
  );
};
