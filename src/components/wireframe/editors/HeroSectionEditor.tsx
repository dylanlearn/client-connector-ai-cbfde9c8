
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ChromePicker } from 'react-color';

interface HeroSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ section, onUpdate }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  
  // Extract data from section or initialize with default values
  const data = section.data || {};
  const style = section.style || {};
  const layout = section.layout || {};

  // Get hero-specific fields or initialize them
  const heading = data.heading || '';
  const subheading = data.subheading || '';
  const backgroundImage = data.backgroundImage || '';
  const ctaText = data.ctaText || 'Get Started';
  const ctaUrl = data.ctaUrl || '#';
  const secondaryCtaText = data.secondaryCtaText || '';
  const secondaryCtaUrl = data.secondaryCtaUrl || '#';
  const showSecondaryButton = !!data.secondaryCtaText;
  const alignment = data.alignment || 'center';
  const backgroundColor = style.backgroundColor || '#ffffff';
  const textColor = style.color || '#000000';
  const ctaColor = style.ctaColor || '#3B82F6';
  const ctaTextColor = style.ctaTextColor || '#ffffff';
  const paddingY = style.paddingY || 80;
  const height = style.height || 'auto';
  
  // Hero variant options
  const heroVariants = [
    { value: 'centered', label: 'Centered' },
    { value: 'split', label: 'Split' },
    { value: 'background-image', label: 'Background Image' },
    { value: 'video-background', label: 'Video Background' },
    { value: 'animated', label: 'Animated' },
    { value: 'minimal', label: 'Minimal' }
  ];
  
  // Content alignment options
  const alignmentOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ];

  // Update section data
  const updateData = (key: string, value: any) => {
    const updatedData = { ...data, [key]: value };
    onUpdate({ data: updatedData });
  };

  // Update section style
  const updateStyle = (key: string, value: any) => {
    const updatedStyle = { ...style, [key]: value };
    onUpdate({ style: updatedStyle });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="variant">Hero Variant</Label>
              <Select
                value={section.componentVariant || 'centered'} 
                onValueChange={(value) => onUpdate({ componentVariant: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {heroVariants.map(variant => (
                    <SelectItem key={variant.value} value={variant.value}>{variant.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={heading}
                onChange={(e) => updateData('heading', e.target.value)}
                placeholder="Main heading text"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <Textarea
                id="subheading"
                value={subheading}
                onChange={(e) => updateData('subheading', e.target.value)}
                placeholder="Supporting subheading text"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">Primary CTA Text</Label>
                <Input
                  id="ctaText"
                  value={ctaText}
                  onChange={(e) => updateData('ctaText', e.target.value)}
                  placeholder="Call to action button text"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ctaUrl">Primary CTA URL</Label>
                <Input
                  id="ctaUrl"
                  value={ctaUrl}
                  onChange={(e) => updateData('ctaUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="showSecondaryButton"
                checked={showSecondaryButton}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateData('secondaryCtaText', 'Learn More');
                  } else {
                    // Remove secondary CTA fields
                    const { secondaryCtaText, secondaryCtaUrl, ...restData } = data;
                    onUpdate({ data: restData });
                  }
                }}
              />
              <Label htmlFor="showSecondaryButton">Add Secondary Button</Label>
            </div>
            
            {showSecondaryButton && (
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryCtaText">Secondary CTA Text</Label>
                  <Input
                    id="secondaryCtaText"
                    value={secondaryCtaText}
                    onChange={(e) => updateData('secondaryCtaText', e.target.value)}
                    placeholder="Secondary call to action text"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryCtaUrl">Secondary CTA URL</Label>
                  <Input
                    id="secondaryCtaUrl"
                    value={secondaryCtaUrl}
                    onChange={(e) => updateData('secondaryCtaUrl', e.target.value)}
                    placeholder="https://example.com/learn-more"
                  />
                </div>
              </div>
            )}
            
            {(section.componentVariant === 'background-image' || section.componentVariant === 'split') && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="backgroundImage">Background Image URL</Label>
                <Input
                  id="backgroundImage"
                  value={backgroundImage}
                  onChange={(e) => updateData('backgroundImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alignment">Content Alignment</Label>
              <Select 
                value={alignment} 
                onValueChange={(value) => updateData('alignment', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  {alignmentOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded border cursor-pointer" 
                  style={{ backgroundColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  placeholder="#FFFFFF"
                />
              </div>
              
              {showColorPicker && (
                <Card className="mt-2">
                  <CardContent className="p-4">
                    <ChromePicker
                      color={backgroundColor}
                      onChange={(color) => updateStyle('backgroundColor', color.hex)}
                      disableAlpha
                    />
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded border cursor-pointer" 
                  style={{ backgroundColor: textColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <Input
                  id="textColor"
                  value={textColor}
                  onChange={(e) => updateStyle('color', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ctaColor">CTA Button Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded border cursor-pointer" 
                  style={{ backgroundColor: ctaColor }}
                />
                <Input
                  id="ctaColor"
                  value={ctaColor}
                  onChange={(e) => updateStyle('ctaColor', e.target.value)}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Vertical Padding</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[paddingY]}
                  min={20}
                  max={200}
                  step={10}
                  onValueChange={(vals) => updateStyle('paddingY', vals[0])}
                />
                <span className="text-sm font-medium w-10 text-center">{paddingY}px</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">Section Height</Label>
              <Select 
                value={height === 'auto' ? 'auto' : (height === '100vh' ? 'fullscreen' : 'custom')}
                onValueChange={(value) => {
                  if (value === 'auto') {
                    updateStyle('height', 'auto');
                  } else if (value === 'fullscreen') {
                    updateStyle('height', '100vh');
                  } else {
                    updateStyle('height', '500px');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="fullscreen">Fullscreen</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              
              {style.height && style.height !== 'auto' && style.height !== '100vh' && (
                <div className="mt-2">
                  <Input
                    type="text"
                    value={style.height}
                    onChange={(e) => updateStyle('height', e.target.value)}
                    placeholder="e.g. 500px"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="containerWidth">Container Width</Label>
              <Select 
                value={style.maxWidth || 'default'}
                onValueChange={(value) => {
                  if (value === 'default') {
                    // Remove maxWidth from style to use default
                    const { maxWidth, ...restStyle } = style;
                    onUpdate({ style: restStyle });
                  } else {
                    updateStyle('maxWidth', value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select container width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="1200px">Wide (1200px)</SelectItem>
                  <SelectItem value="900px">Medium (900px)</SelectItem>
                  <SelectItem value="680px">Narrow (680px)</SelectItem>
                  <SelectItem value="100%">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Reset to defaults
            onUpdate({
              data: {
                heading: 'Welcome to our product',
                subheading: 'The best solution for your needs',
                ctaText: 'Get Started',
                ctaUrl: '#',
                alignment: 'center'
              },
              style: {
                backgroundColor: '#ffffff',
                color: '#000000',
                ctaColor: '#3B82F6',
                paddingY: 80
              },
              componentVariant: 'centered'
            });
          }}
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default HeroSectionEditor;
