
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionEditorProps } from '../types';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

const HeroSectionEditor: React.FC<SectionEditorProps> = ({ section, onUpdate }) => {
  // Get initial values from section
  const [heading, setHeading] = useState<string>(getSuggestion(section.copySuggestions, 'heading', ''));
  const [subheading, setSubheading] = useState<string>(getSuggestion(section.copySuggestions, 'subheading', ''));
  const [ctaText, setCtaText] = useState<string>(getSuggestion(section.copySuggestions, 'ctaText', ''));
  const [ctaUrl, setCtaUrl] = useState<string>(getSuggestion(section.copySuggestions, 'ctaUrl', '#'));
  const [backgroundColor, setBackgroundColor] = useState<string>(section.style?.backgroundColor || '');
  const [textColor, setTextColor] = useState<string>(section.style?.color || '');
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clone the existing copySuggestions
    const updatedCopySuggestions = { 
      ...(typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions) 
        ? section.copySuggestions 
        : {}
      ) 
    };
    
    // Update copySuggestions
    updatedCopySuggestions['heading'] = heading;
    updatedCopySuggestions['subheading'] = subheading;
    updatedCopySuggestions['ctaText'] = ctaText;
    updatedCopySuggestions['ctaUrl'] = ctaUrl;
    
    // Create updated style
    const updatedStyle = {
      ...(section.style || {}),
      backgroundColor,
      color: textColor
    };
    
    // Update the section with new values
    onUpdate({
      copySuggestions: updatedCopySuggestions,
      style: updatedStyle
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heading">Heading</Label>
            <Input 
              id="heading" 
              value={heading} 
              onChange={(e) => setHeading(e.target.value)} 
              placeholder="Enter section heading" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subheading">Subheading</Label>
            <Textarea 
              id="subheading" 
              value={subheading} 
              onChange={(e) => setSubheading(e.target.value)} 
              placeholder="Enter section subheading" 
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ctaText">CTA Button Text</Label>
            <Input 
              id="ctaText" 
              value={ctaText} 
              onChange={(e) => setCtaText(e.target.value)} 
              placeholder="Enter call-to-action text" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ctaUrl">CTA Button URL</Label>
            <Input 
              id="ctaUrl" 
              value={ctaUrl} 
              onChange={(e) => setCtaUrl(e.target.value)} 
              placeholder="Enter call-to-action URL" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="bgColor" 
                  type="color" 
                  value={backgroundColor || '#ffffff'} 
                  onChange={(e) => setBackgroundColor(e.target.value)} 
                  className="w-10 h-10 p-1" 
                />
                <Input 
                  type="text" 
                  value={backgroundColor} 
                  onChange={(e) => setBackgroundColor(e.target.value)} 
                  placeholder="#ffffff" 
                  className="flex-1" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="textColor" 
                  type="color" 
                  value={textColor || '#000000'} 
                  onChange={(e) => setTextColor(e.target.value)} 
                  className="w-10 h-10 p-1" 
                />
                <Input 
                  type="text" 
                  value={textColor} 
                  onChange={(e) => setTextColor(e.target.value)} 
                  placeholder="#000000" 
                  className="flex-1" 
                />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full">Update Hero Section</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HeroSectionEditor;
