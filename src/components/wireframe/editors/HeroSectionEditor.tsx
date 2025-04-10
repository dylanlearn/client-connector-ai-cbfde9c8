
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

interface HeroSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#ffffff';
  const heading = section.data?.heading || getSuggestion(section.copySuggestions, 'heading', 'Hero Title');
  const subheading = section.data?.subheading || getSuggestion(section.copySuggestions, 'subheading', 'A compelling subheading for your hero section');
  const ctaText = section.data?.ctaText || getSuggestion(section.copySuggestions, 'ctaText', 'Get Started');
  const ctaUrl = section.data?.ctaUrl || getSuggestion(section.copySuggestions, 'ctaUrl', '#');
  const hasImage = section.data?.hasImage !== undefined ? section.data.hasImage : true;
  const imageUrl = section.data?.imageUrl || section.data?.image?.url || '';
  const imagePosition = section.data?.imagePosition || 'right';
  const verticalAlignment = section.data?.verticalAlignment || 'center';
  const contentWidth = section.data?.contentWidth || 'medium';
  
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
                placeholder="Hero Section Heading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <RichTextEditor
                id="subheading"
                value={subheading}
                onChange={(value) => handleContentChange('subheading', value)}
                minHeight="100px"
                placeholder="Hero Section Subheading"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input
                  id="ctaText"
                  value={ctaText}
                  onChange={(e) => handleContentChange('ctaText', e.target.value)}
                  placeholder="Call to Action Text"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ctaUrl">CTA Button URL</Label>
                <Input
                  id="ctaUrl"
                  value={ctaUrl}
                  onChange={(e) => handleContentChange('ctaUrl', e.target.value)}
                  placeholder="#"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hasImage">Include Hero Image</Label>
                <Switch 
                  id="hasImage"
                  checked={hasImage}
                  onCheckedChange={(checked) => handleContentChange('hasImage', checked)}
                />
              </div>
              
              {hasImage && (
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => handleContentChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4 pt-4">
          <div className="space-y-4">
            {hasImage && (
              <div className="space-y-2">
                <Label htmlFor="imagePosition">Image Position</Label>
                <Select 
                  value={imagePosition} 
                  onValueChange={(value) => handleContentChange('imagePosition', value)}
                >
                  <SelectTrigger id="imagePosition">
                    <SelectValue placeholder="Right" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="background">Background</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="verticalAlignment">Vertical Alignment</Label>
              <Select 
                value={verticalAlignment} 
                onValueChange={(value) => handleContentChange('verticalAlignment', value)}
              >
                <SelectTrigger id="verticalAlignment">
                  <SelectValue placeholder="Center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contentWidth">Content Width</Label>
              <Select 
                value={contentWidth} 
                onValueChange={(value) => handleContentChange('contentWidth', value)}
              >
                <SelectTrigger id="contentWidth">
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">Narrow</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
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
                value={section.style?.padding || section.padding || '4'} 
                onValueChange={(value) => handleStyleChange('padding', value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Medium (16px)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0px)</SelectItem>
                  <SelectItem value="1">Extra Small (4px)</SelectItem>
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

export default HeroSectionEditor;
