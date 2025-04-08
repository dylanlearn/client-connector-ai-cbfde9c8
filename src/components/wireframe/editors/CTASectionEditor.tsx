
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import RichTextEditor from './RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CTASectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const CTASectionEditor: React.FC<CTASectionEditorProps> = ({ section, onUpdate }) => {
  const data = section.data || {};
  const {
    headline = '',
    subheadline = '',
    ctaLabel = 'Get Started',
    ctaUrl = '#',
    secondaryCtaLabel = '',
    secondaryCtaUrl = '#',
    backgroundStyle = 'primary',
    alignment = 'center',
    testimonial = null
  } = data;

  const handleDataChange = (key: string, value: any) => {
    const updatedData = { ...(section.data || {}), [key]: value };
    onUpdate({ data: updatedData });
  };

  const handleTestimonialChange = (key: string, value: string) => {
    const currentTestimonial = testimonial || { quote: '', author: '' };
    const updatedTestimonial = { ...currentTestimonial, [key]: value };
    handleDataChange('testimonial', updatedTestimonial);
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style & Layout</TabsTrigger>
        <TabsTrigger value="testimonial">Testimonial</TabsTrigger>
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
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaLabel">Primary Button Text</Label>
                  <Input
                    id="ctaLabel"
                    value={ctaLabel}
                    onChange={(e) => handleDataChange('ctaLabel', e.target.value)}
                    placeholder="Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">Primary Button URL</Label>
                  <Input
                    id="ctaUrl"
                    value={ctaUrl}
                    onChange={(e) => handleDataChange('ctaUrl', e.target.value)}
                    placeholder="#"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryCtaLabel">Secondary Button Text (Optional)</Label>
                  <Input
                    id="secondaryCtaLabel"
                    value={secondaryCtaLabel}
                    onChange={(e) => handleDataChange('secondaryCtaLabel', e.target.value)}
                    placeholder="Learn More"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryCtaUrl">Secondary Button URL</Label>
                  <Input
                    id="secondaryCtaUrl"
                    value={secondaryCtaUrl}
                    onChange={(e) => handleDataChange('secondaryCtaUrl', e.target.value)}
                    placeholder="#"
                  />
                </div>
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
      
      <TabsContent value="testimonial" className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium mb-2">Featured Testimonial (Optional)</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testimonialQuote">Quote</Label>
                <RichTextEditor
                  value={testimonial?.quote || ''}
                  onChange={(value) => handleTestimonialChange('quote', value)}
                  placeholder="Enter testimonial quote"
                  minHeight="100px"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testimonialAuthor">Author</Label>
                <Input
                  id="testimonialAuthor"
                  value={testimonial?.author || ''}
                  onChange={(e) => handleTestimonialChange('author', e.target.value)}
                  placeholder="John Doe, CEO of Company"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CTASectionEditor;
