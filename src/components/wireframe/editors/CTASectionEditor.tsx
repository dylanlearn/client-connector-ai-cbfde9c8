
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ColorPicker } from '@/components/ui/color-picker';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from './RichTextEditor';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface CTASectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const CTASectionEditor: React.FC<CTASectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#f3f4f6';
  const heading = section.data?.heading || getSuggestion(section.copySuggestions, 'heading', 'Ready to get started?');
  const content = section.data?.content || getSuggestion(section.copySuggestions, 'content', 'Join thousands of satisfied customers using our product.');
  const primaryCta = section.data?.primaryCta || getSuggestion(section.copySuggestions, 'primaryCta', 'Get Started');
  const secondaryCta = section.data?.secondaryCta || getSuggestion(section.copySuggestions, 'secondaryCta', 'Learn More');
  const hasSecondaryButton = section.data?.hasSecondaryButton !== undefined ? section.data.hasSecondaryButton : true;
  const primaryCtaUrl = section.data?.primaryCtaUrl || '#';
  const secondaryCtaUrl = section.data?.secondaryCtaUrl || '#';
  const alignment = section.data?.alignment || 'center';
  const variant = section.data?.variant || section.componentVariant || 'standard';
  
  // Handle content updates
  const handleContentChange = (field: string, value: any) => {
    const updatedData = {
      ...(section.data || {}),
      [field]: value
    };
    onUpdate({ data: updatedData });
  };
  
  // Handle style updates
  const handleStyleChange = (field: string, value: any) => {
    const updatedStyle = {
      ...(section.style || {}),
      [field]: value
    };
    onUpdate({ style: updatedStyle, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={heading}
                onChange={(e) => handleContentChange('heading', e.target.value)}
                placeholder="CTA Heading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                id="content"
                value={content}
                onChange={(value) => handleContentChange('content', value)}
                minHeight="100px"
                placeholder="CTA content text"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primaryCta">Primary Button Text</Label>
              <Input
                id="primaryCta"
                value={primaryCta}
                onChange={(e) => handleContentChange('primaryCta', e.target.value)}
                placeholder="Get Started"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primaryCtaUrl">Primary Button URL</Label>
              <Input
                id="primaryCtaUrl"
                value={primaryCtaUrl}
                onChange={(e) => handleContentChange('primaryCtaUrl', e.target.value)}
                placeholder="#"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hasSecondaryButton">Include Secondary Button</Label>
                <Switch 
                  id="hasSecondaryButton"
                  checked={hasSecondaryButton}
                  onCheckedChange={(checked) => handleContentChange('hasSecondaryButton', checked)}
                />
              </div>
              
              {hasSecondaryButton && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryCta">Secondary Button Text</Label>
                    <Input
                      id="secondaryCta"
                      value={secondaryCta}
                      onChange={(e) => handleContentChange('secondaryCta', e.target.value)}
                      placeholder="Learn More"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryCtaUrl">Secondary Button URL</Label>
                    <Input
                      id="secondaryCtaUrl"
                      value={secondaryCtaUrl}
                      onChange={(e) => handleContentChange('secondaryCtaUrl', e.target.value)}
                      placeholder="#"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alignment">Alignment</Label>
              <Select 
                value={alignment} 
                onValueChange={(value) => handleContentChange('alignment', value)}
              >
                <SelectTrigger id="alignment">
                  <SelectValue placeholder="Center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="variant">CTA Variant</Label>
              <Select 
                value={variant} 
                onValueChange={(value) => {
                  handleContentChange('variant', value);
                  onUpdate({ componentVariant: value });
                }}
              >
                <SelectTrigger id="variant">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="fullWidth">Full Width</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="backgroundColor"
                  color={backgroundColor}
                  onChange={(color) => handleStyleChange('backgroundColor', color)}
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Select 
                value={section.style?.padding || section.padding || '6'} 
                onValueChange={(value) => handleStyleChange('padding', value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Large (24px)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0px)</SelectItem>
                  <SelectItem value="2">Small (8px)</SelectItem>
                  <SelectItem value="4">Medium (16px)</SelectItem>
                  <SelectItem value="6">Large (24px)</SelectItem>
                  <SelectItem value="8">Extra Large (32px)</SelectItem>
                  <SelectItem value="12">XXL (48px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Additional style options could be added here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CTASectionEditor;
