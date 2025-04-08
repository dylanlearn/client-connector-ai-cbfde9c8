
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, Link } from 'lucide-react';

interface HeroSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const HeroSectionEditor: React.FC<HeroSectionEditorProps> = ({ section, onUpdate }) => {
  // Extract section data
  const data = section.data || {};
  const {
    headline = 'Your Headline Here',
    subheadline = 'A brief supporting message to explain your value proposition',
    cta = { label: 'Get Started', url: '#' },
    ctaSecondary = { label: 'Learn More', url: '#' },
    backgroundStyle = 'light',
    alignment = 'center',
    image = '',
    mediaType = 'image'
  } = data;
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('content');
  
  // Update section data
  const updateData = (key: string, value: any) => {
    const updatedData = { ...data, [key]: value };
    onUpdate({ data: updatedData });
  };
  
  // Update CTA data
  const updateCTA = (ctaType: 'primary' | 'secondary', field: string, value: string) => {
    const ctaKey = ctaType === 'primary' ? 'cta' : 'ctaSecondary';
    const currentCTA = ctaType === 'primary' ? cta : ctaSecondary;
    
    updateData(ctaKey, {
      ...currentCTA,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="ctas">Call to Actions</TabsTrigger>
          <TabsTrigger value="style">Style & Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Headline</Label>
              <Input
                value={headline}
                onChange={(e) => updateData('headline', e.target.value)}
                placeholder="Main headline"
              />
            </div>
            
            <div>
              <Label>Subheadline</Label>
              <Textarea
                value={subheadline}
                onChange={(e) => updateData('subheadline', e.target.value)}
                placeholder="Supporting text"
                rows={3}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ctas" className="space-y-4">
          <div className="border p-3 rounded-md">
            <h3 className="text-sm font-medium mb-3">Primary CTA</h3>
            <div className="grid gap-3">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={cta?.label || ''}
                  onChange={(e) => updateCTA('primary', 'label', e.target.value)}
                  placeholder="Button text"
                />
              </div>
              
              <div>
                <Label>URL</Label>
                <Input
                  value={cta?.url || '#'}
                  onChange={(e) => updateCTA('primary', 'url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
          
          <div className="border p-3 rounded-md">
            <h3 className="text-sm font-medium mb-3">Secondary CTA</h3>
            <div className="grid gap-3">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={ctaSecondary?.label || ''}
                  onChange={(e) => updateCTA('secondary', 'label', e.target.value)}
                  placeholder="Button text"
                />
              </div>
              
              <div>
                <Label>URL</Label>
                <Input
                  value={ctaSecondary?.url || '#'}
                  onChange={(e) => updateCTA('secondary', 'url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Background Style</Label>
              <Select 
                value={backgroundStyle}
                onValueChange={(value) => updateData('backgroundStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image Background</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Alignment</Label>
              <Select 
                value={alignment}
                onValueChange={(value) => updateData('alignment', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Media Type</Label>
              <Select 
                value={mediaType}
                onValueChange={(value) => updateData('mediaType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Media</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {mediaType !== 'none' && (
              <div>
                <Label>{mediaType === 'image' ? 'Image URL' : 'Video URL'}</Label>
                <div className="flex">
                  <Input
                    value={image}
                    onChange={(e) => updateData('image', e.target.value)}
                    placeholder={mediaType === 'image' ? "https://example.com/image.jpg" : "https://youtube.com/embed/xyz"}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="ml-2">
                    {mediaType === 'image' ? <ImageIcon className="h-4 w-4" /> : <Link className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HeroSectionEditor;
