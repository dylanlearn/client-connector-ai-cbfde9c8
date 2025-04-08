
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CTASectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const CTASectionEditor: React.FC<CTASectionEditorProps> = ({ section, onUpdate }) => {
  // Extract section data
  const data = section.data || {};
  const {
    headline = 'Ready to Get Started?',
    subheadline = 'Join thousands of satisfied customers using our platform',
    ctaLabel = 'Sign Up Now',
    ctaUrl = '#',
    secondaryCtaLabel = 'Learn More',
    secondaryCtaUrl = '#',
    backgroundStyle = 'primary',
    alignment = 'center',
    testimonial
  } = data;
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('content');
  
  // Update section data
  const updateData = (key: string, value: any) => {
    const updatedData = { ...data, [key]: value };
    onUpdate({ data: updatedData });
  };
  
  // Update testimonial data
  const updateTestimonial = (field: string, value: string) => {
    const currentTestimonial = testimonial || { quote: '', author: '' };
    
    updateData('testimonial', {
      ...currentTestimonial,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="ctas">Call to Actions</TabsTrigger>
          <TabsTrigger value="style">Style & Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Headline</Label>
              <Input
                value={headline}
                onChange={(e) => updateData('headline', e.target.value)}
                placeholder="CTA Headline"
              />
            </div>
            
            <div>
              <Label>Subheadline</Label>
              <Textarea
                value={subheadline}
                onChange={(e) => updateData('subheadline', e.target.value)}
                placeholder="Supporting text"
                rows={2}
              />
            </div>
            
            <div className="border p-4 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Testimonial (Optional)</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => updateData('testimonial', testimonial ? undefined : { quote: '', author: '' })}
                >
                  {testimonial ? 'Remove' : 'Add'}
                </Button>
              </div>
              
              {testimonial && (
                <div className="space-y-3">
                  <div>
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial('quote', e.target.value)}
                      placeholder="Customer testimonial"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label>Author</Label>
                    <Input
                      value={testimonial.author}
                      onChange={(e) => updateTestimonial('author', e.target.value)}
                      placeholder="Name, Role"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ctas" className="space-y-4">
          <div className="border p-4 rounded-md">
            <h3 className="text-sm font-medium mb-3">Primary CTA</h3>
            <div className="grid gap-3">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={ctaLabel || ''}
                  onChange={(e) => updateData('ctaLabel', e.target.value)}
                  placeholder="Button text"
                />
              </div>
              
              <div>
                <Label>URL</Label>
                <Input
                  value={ctaUrl || '#'}
                  onChange={(e) => updateData('ctaUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-sm font-medium mb-3">Secondary CTA</h3>
            <div className="grid gap-3">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={secondaryCtaLabel || ''}
                  onChange={(e) => updateData('secondaryCtaLabel', e.target.value)}
                  placeholder="Button text"
                />
              </div>
              
              <div>
                <Label>URL</Label>
                <Input
                  value={secondaryCtaUrl || '#'}
                  onChange={(e) => updateData('secondaryCtaUrl', e.target.value)}
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CTASectionEditor;
