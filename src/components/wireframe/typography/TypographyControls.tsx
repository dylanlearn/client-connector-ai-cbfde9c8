
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FontSelector } from './FontSelector';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMMON_FONT_FAMILIES } from './font-constants';

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
  className?: string;
}

/**
 * Typography Controls - UI for adjusting typography settings
 */
export const TypographyControls: React.FC<TypographyControlsProps> = ({
  headingFont,
  bodyFont,
  scaleRatio,
  lineHeights,
  onFontChange,
  onScaleChange,
  onLineHeightChange,
  className
}) => {
  // Font scale options
  const scaleOptions = [
    { label: 'Small (1.125)', value: 1.125 },
    { label: 'Minor Second (1.067)', value: 1.067 },
    { label: 'Major Second (1.125)', value: 1.125 },
    { label: 'Minor Third (1.2)', value: 1.2 },
    { label: 'Major Third (1.25)', value: 1.25 },
    { label: 'Perfect Fourth (1.333)', value: 1.333 },
    { label: 'Augmented Fourth (1.414)', value: 1.414 },
    { label: 'Perfect Fifth (1.5)', value: 1.5 },
    { label: 'Golden Ratio (1.618)', value: 1.618 },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Typography Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="fonts">
          <TabsList className="mb-4">
            <TabsTrigger value="fonts">Fonts</TabsTrigger>
            <TabsTrigger value="scale">Scale</TabsTrigger>
            <TabsTrigger value="line-heights">Line Heights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fonts" className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Heading Font</Label>
              <FontSelector
                value={headingFont}
                onChange={(font) => onFontChange('heading', font)}
                fonts={COMMON_FONT_FAMILIES}
              />
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Body Font</Label>
              <FontSelector
                value={bodyFont}
                onChange={(font) => onFontChange('body', font)}
                fonts={COMMON_FONT_FAMILIES}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="scale" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Type Scale Ratio: {scaleRatio}</Label>
                <Select 
                  value={scaleRatio.toString()} 
                  onValueChange={(value) => onScaleChange(parseFloat(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scale" />
                  </SelectTrigger>
                  <SelectContent>
                    {scaleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-semibold mb-6 block">Type Scale</Label>
                <div className="pl-2 border-l-2 border-primary space-y-2">
                  <p className="text-4xl font-bold" style={{ fontFamily: headingFont }}>Heading 1</p>
                  <p className="text-3xl font-bold" style={{ fontFamily: headingFont }}>Heading 2</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: headingFont }}>Heading 3</p>
                  <p className="text-xl font-bold" style={{ fontFamily: headingFont }}>Heading 4</p>
                  <p className="text-lg" style={{ fontFamily: bodyFont }}>Large text</p>
                  <p className="text-base" style={{ fontFamily: bodyFont }}>Base text</p>
                  <p className="text-sm" style={{ fontFamily: bodyFont }}>Small text</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="line-heights" className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-semibold">Heading Line Height: {lineHeights.heading}x</Label>
              </div>
              <Slider
                value={[lineHeights.heading * 100]}
                min={90}
                max={200}
                step={5}
                onValueChange={(value) => onLineHeightChange('heading', value[0] / 100)}
              />
              <div className="mt-4 p-3 border rounded-md">
                <p className="text-xl font-bold" style={{ fontFamily: headingFont, lineHeight: lineHeights.heading }}>
                  The quick brown fox jumps over the lazy dog. This sample text demonstrates line height for headings.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-semibold">Body Line Height: {lineHeights.body}x</Label>
              </div>
              <Slider
                value={[lineHeights.body * 100]}
                min={100}
                max={200}
                step={5}
                onValueChange={(value) => onLineHeightChange('body', value[0] / 100)}
              />
              <div className="mt-4 p-3 border rounded-md">
                <p style={{ fontFamily: bodyFont, lineHeight: lineHeights.body }}>
                  Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing, and letter-spacing. This sample text demonstrates line height for body text.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
