
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from './RichTextEditor';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface TestimonialsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  testimonial: string;
  avatar?: string;
  rating?: number;
}

const TestimonialsSectionEditor: React.FC<TestimonialsSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#f9fafb';
  const heading = section.data?.heading || getSuggestion(section.copySuggestions, 'heading', 'What Our Customers Say');
  const subheading = section.data?.subheading || getSuggestion(section.copySuggestions, 'subheading', 'See what others are saying about our products and services');
  
  // Initialize testimonial items
  const initialTestimonials = section.data?.testimonials || [];
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const layout = section.data?.layout || 'cards';
  const displayType = section.data?.displayType || section.componentVariant || 'grid';
  
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
  
  // Testimonial management
  const addTestimonial = () => {
    const newTestimonial = {
      id: `testimonial-${Date.now()}`,
      name: 'Customer Name',
      role: 'Customer Role',
      company: 'Company Name',
      testimonial: 'This is a sample testimonial.',
      rating: 5
    };
    
    const updatedTestimonials = [...testimonials, newTestimonial];
    setTestimonials(updatedTestimonials);
    handleContentChange('testimonials', updatedTestimonials);
  };
  
  const updateTestimonial = (id: string, field: string, value: any) => {
    const updatedTestimonials = testimonials.map(testimonial => {
      if (testimonial.id === id) {
        return { ...testimonial, [field]: value };
      }
      return testimonial;
    });
    
    setTestimonials(updatedTestimonials);
    handleContentChange('testimonials', updatedTestimonials);
  };
  
  const deleteTestimonial = (id: string) => {
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    setTestimonials(updatedTestimonials);
    handleContentChange('testimonials', updatedTestimonials);
  };
  
  const moveTestimonial = (id: string, direction: 'up' | 'down') => {
    const index = testimonials.findIndex(testimonial => testimonial.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === testimonials.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedTestimonials = [...testimonials];
    const [removed] = updatedTestimonials.splice(index, 1);
    updatedTestimonials.splice(newIndex, 0, removed);
    
    setTestimonials(updatedTestimonials);
    handleContentChange('testimonials', updatedTestimonials);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
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
                placeholder="Testimonials Section Heading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <RichTextEditor
                id="subheading"
                value={subheading}
                onChange={(value) => handleContentChange('subheading', value)}
                minHeight="100px"
                placeholder="Testimonials Section Subheading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayType">Display Type</Label>
              <Select 
                value={displayType} 
                onValueChange={(value) => {
                  handleContentChange('displayType', value);
                  onUpdate({ componentVariant: value });
                }}
              >
                <SelectTrigger id="displayType">
                  <SelectValue placeholder="Grid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="masonry">Masonry</SelectItem>
                  <SelectItem value="featured">Featured Single</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="layout">Testimonial Layout</Label>
              <Select 
                value={layout} 
                onValueChange={(value) => handleContentChange('layout', value)}
              >
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Cards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="bubbles">Speech Bubbles</SelectItem>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="quote">Quotation Marks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="testimonials" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Button onClick={addTestimonial} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Testimonial
            </Button>
            
            <div className="space-y-4 mt-4">
              {testimonials.length === 0 ? (
                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                  No testimonials. Click the button above to add one.
                </div>
              ) : (
                testimonials.map((testimonial, index) => (
                  <Card key={testimonial.id} className="relative">
                    <CardContent className="pt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${testimonial.id}`}>Name</Label>
                          <Input
                            id={`name-${testimonial.id}`}
                            value={testimonial.name}
                            onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                            placeholder="Customer Name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`role-${testimonial.id}`}>Role</Label>
                          <Input
                            id={`role-${testimonial.id}`}
                            value={testimonial.role}
                            onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                            placeholder="Customer Role"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`company-${testimonial.id}`}>Company</Label>
                        <Input
                          id={`company-${testimonial.id}`}
                          value={testimonial.company}
                          onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`testimonial-${testimonial.id}`}>Testimonial</Label>
                        <RichTextEditor
                          id={`testimonial-${testimonial.id}`}
                          value={testimonial.testimonial}
                          onChange={(value) => updateTestimonial(testimonial.id, 'testimonial', value)}
                          minHeight="100px"
                          placeholder="Customer testimonial text"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`avatar-${testimonial.id}`}>Avatar URL</Label>
                          <Input
                            id={`avatar-${testimonial.id}`}
                            value={testimonial.avatar || ''}
                            onChange={(e) => updateTestimonial(testimonial.id, 'avatar', e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`rating-${testimonial.id}`}>Rating (1-5)</Label>
                          <Select 
                            value={String(testimonial.rating || 5)} 
                            onValueChange={(value) => updateTestimonial(testimonial.id, 'rating', parseInt(value))}
                          >
                            <SelectTrigger id={`rating-${testimonial.id}`}>
                              <SelectValue placeholder="5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Poor</SelectItem>
                              <SelectItem value="2">2 - Below Average</SelectItem>
                              <SelectItem value="3">3 - Average</SelectItem>
                              <SelectItem value="4">4 - Good</SelectItem>
                              <SelectItem value="5">5 - Excellent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveTestimonial(testimonial.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveTestimonial(testimonial.id, 'down')}
                            disabled={index === testimonials.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => deleteTestimonial(testimonial.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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

export default TestimonialsSectionEditor;
