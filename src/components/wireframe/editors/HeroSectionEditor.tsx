
import React from 'react';
import { SectionEditorProps } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const HeroSectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  // Extract section data or provide defaults
  const copySuggestions = section.copySuggestions || {};
  const style = section.style || {};
  const layout = section.layout || {};
  
  const handleCopyChange = (key: string, value: string) => {
    onUpdate({
      copySuggestions: {
        ...copySuggestions,
        [key]: value
      }
    });
  };
  
  const handleStyleChange = (key: string, value: any) => {
    onUpdate({
      style: {
        ...style,
        [key]: value
      }
    });
  };
  
  const handleLayoutChange = (key: string, value: any) => {
    onUpdate({
      layout: {
        ...layout,
        [key]: value
      }
    });
  };

  return (
    <Tabs defaultValue="content">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="space-y-4 pt-4">
        <div>
          <Label htmlFor="heading">Heading</Label>
          <Input
            id="heading"
            value={copySuggestions.heading || ''}
            onChange={(e) => handleCopyChange('heading', e.target.value)}
            placeholder="Hero heading"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="subheading">Subheading</Label>
          <Textarea
            id="subheading"
            value={copySuggestions.subheading || ''}
            onChange={(e) => handleCopyChange('subheading', e.target.value)}
            placeholder="Hero subheading or tagline"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="ctaText">CTA Button Text</Label>
          <Input
            id="ctaText"
            value={copySuggestions.ctaText || ''}
            onChange={(e) => handleCopyChange('ctaText', e.target.value)}
            placeholder="Call to action text"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="ctaUrl">CTA Button URL</Label>
          <Input
            id="ctaUrl"
            value={copySuggestions.ctaUrl || ''}
            onChange={(e) => handleCopyChange('ctaUrl', e.target.value)}
            placeholder="#"
            className="mt-1"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="layout" className="space-y-4 pt-4">
        <div>
          <Label htmlFor="layout-type">Layout Type</Label>
          <Select
            value={layout.type || 'flex'}
            onValueChange={(value) => handleLayoutChange('type', value)}
          >
            <SelectTrigger id="layout-type" className="mt-1">
              <SelectValue placeholder="Select layout type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flex">Flex</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="split">Split</SelectItem>
              <SelectItem value="centered">Centered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="direction">Direction</Label>
          <Select
            value={layout.direction || 'column'}
            onValueChange={(value) => handleLayoutChange('direction', value)}
          >
            <SelectTrigger id="direction" className="mt-1">
              <SelectValue placeholder="Select layout direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Row</SelectItem>
              <SelectItem value="column">Column</SelectItem>
              <SelectItem value="row-reverse">Row Reverse</SelectItem>
              <SelectItem value="column-reverse">Column Reverse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="alignment">Text Alignment</Label>
          <Select
            value={layout.textAlign || 'left'}
            onValueChange={(value) => handleLayoutChange('textAlign', value)}
          >
            <SelectTrigger id="alignment" className="mt-1">
              <SelectValue placeholder="Select text alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Height</Label>
          <div className="flex items-center gap-2 mt-1">
            <Slider
              defaultValue={[70]}
              max={100}
              step={10}
              value={[parseInt(layout.heightPercentage?.toString() || "70")]}
              onValueChange={(values) => handleLayoutChange('heightPercentage', values[0])}
              className="flex-grow"
            />
            <span className="text-sm text-muted-foreground w-8">
              {layout.heightPercentage || 70}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-image"
              checked={layout.hasImage === true}
              onCheckedChange={(checked) => handleLayoutChange('hasImage', checked)}
            />
            <Label htmlFor="use-image">Include Image</Label>
          </div>
          
          {layout.hasImage && (
            <div className="flex items-center space-x-2">
              <Switch
                id="image-position"
                checked={layout.imagePosition === 'right'}
                onCheckedChange={(checked) => handleLayoutChange('imagePosition', checked ? 'right' : 'left')}
              />
              <Label htmlFor="image-position">Image on right</Label>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="style" className="space-y-4 pt-4">
        <div>
          <Label htmlFor="bg-color">Background Color</Label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              id="bg-color"
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-10 h-10 rounded border"
            />
            <Input
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="flex-grow"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="padding">Padding</Label>
          <Input
            id="padding"
            value={style.padding || '4rem 2rem'}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            placeholder="4rem 2rem"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Format: top right bottom left (e.g., 4rem 2rem)
          </p>
        </div>
        
        <div>
          <Label htmlFor="spacing">Content Spacing</Label>
          <div className="flex items-center gap-2 mt-1">
            <Slider
              defaultValue={[24]}
              min={8}
              max={64}
              step={4}
              value={[parseInt(style.gap?.toString() || "24")]}
              onValueChange={(values) => handleStyleChange('gap', values[0])}
              className="flex-grow"
            />
            <span className="text-sm text-muted-foreground w-12">
              {style.gap || 24}px
            </span>
          </div>
        </div>
        
        <div>
          <Label htmlFor="overlay">Background Overlay</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Switch
              id="use-overlay"
              checked={style.useOverlay === true}
              onCheckedChange={(checked) => handleStyleChange('useOverlay', checked)}
            />
            <Label htmlFor="use-overlay" className="text-sm">Enable overlay</Label>
          </div>
          
          {style.useOverlay && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                value={style.overlayColor || 'rgba(0,0,0,0.5)'}
                onChange={(e) => handleStyleChange('overlayColor', e.target.value)}
                className="w-8 h-8 rounded border"
              />
              <Slider
                defaultValue={[50]}
                min={0}
                max={100}
                step={5}
                value={[parseInt(style.overlayOpacity?.toString() || "50")]}
                onValueChange={(values) => handleStyleChange('overlayOpacity', values[0])}
                className="flex-grow"
              />
              <span className="text-sm text-muted-foreground w-12">
                {style.overlayOpacity || 50}%
              </span>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default HeroSectionEditor;
