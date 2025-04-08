
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import RichTextEditor from './RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeroSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ section, onUpdate }) => {
  const data = section.data || {};
  const {
    headline = '',
    subheadline = '',
    cta = { label: 'Get Started', url: '#' },
    ctaSecondary = { label: 'Learn More', url: '#' },
    backgroundStyle = 'light',
    alignment = 'center',
    image = '',
    mediaType = 'image'
  } = data;

  const handleDataChange = (key: string, value: any) => {
    const updatedData = { ...(section.data || {}), [key]: value };
    onUpdate({ data: updatedData });
  };

  const handleCtaChange = (key: string, value: string) => {
    const updatedCta = { ...cta, [key]: value };
    handleDataChange('cta', updatedCta);
  };

  const handleCtaSecondaryChange = (key: string, value: string) => {
    const updatedCtaSecondary = { ...ctaSecondary, [key]: value };
    handleDataChange('ctaSecondary', updatedCtaSecondary);
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style & Layout</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input 
            id="headline" 
            value={headline} 
            onChange={(e) => handleDataChange('headline', e.target.value)} 
            placeholder="Enter headline text"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subheadline">Subheadline</Label>
          <RichTextEditor
            value={subheadline}
            onChange={(value) => handleDataChange('subheadline', value)}
            placeholder="Enter subheadline text"
            minHeight="120px"
          />
        </div>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium mb-2">Call to Action Buttons</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaLabel">Primary Button Text</Label>
                <Input
                  id="ctaLabel"
                  value={cta.label}
                  onChange={(e) => handleCtaChange('label', e.target.value)}
                  placeholder="Get Started"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaUrl">Primary Button URL</Label>
                <Input
                  id="ctaUrl"
                  value={cta.url}
                  onChange={(e) => handleCtaChange('url', e.target.value)}
                  placeholder="#"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaSecondaryLabel">Secondary Button Text</Label>
                <Input
                  id="ctaSecondaryLabel"
                  value={ctaSecondary.label}
                  onChange={(e) => handleCtaSecondaryChange('label', e.target.value)}
                  placeholder="Learn More"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaSecondaryUrl">Secondary Button URL</Label>
                <Input
                  id="ctaSecondaryUrl"
                  value={ctaSecondary.url}
                  onChange={(e) => handleCtaSecondaryChange('url', e.target.value)}
                  placeholder="#"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="style" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundStyle">Background Style</Label>
            <Select 
              value={backgroundStyle} 
              onValueChange={(value) => handleDataChange('backgroundStyle', value)}
            >
              <SelectTrigger id="backgroundStyle">
                <SelectValue placeholder="Select background style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="primary">Primary Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image Background</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alignment">Content Alignment</Label>
            <Select 
              value={alignment} 
              onValueChange={(value) => handleDataChange('alignment', value)}
            >
              <SelectTrigger id="alignment">
                <SelectValue placeholder="Select alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="media" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mediaType">Media Type</Label>
          <Select 
            value={mediaType} 
            onValueChange={(value) => handleDataChange('mediaType', value)}
          >
            <SelectTrigger id="mediaType">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {mediaType !== 'none' && (
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Media URL</Label>
            <Input
              id="imageUrl"
              value={image}
              onChange={(e) => handleDataChange('image', e.target.value)}
              placeholder="Enter media URL"
            />
            {image && (
              <div className="mt-2 border rounded-md p-2 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                <img src={image} alt="Preview" className="max-h-[150px] object-contain mx-auto" />
              </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default HeroSectionEditor;
