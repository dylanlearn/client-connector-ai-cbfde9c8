
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import RichTextEditor from './RichTextEditor';
import { Trash2, Plus, Quote, Layout, Star, User, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TestimonialsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const TestimonialsSectionEditor: React.FC<TestimonialsSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<string>('content');
  
  // Initialize or access testimonials data
  const testimonials = section.data?.testimonials || [];
  
  // Handle section title update
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      data: {
        ...(section.data || {}),
        title: e.target.value
      }
    });
  };
  
  // Handle section description update
  const handleDescriptionChange = (value: string) => {
    onUpdate({
      data: {
        ...(section.data || {}),
        description: value
      }
    });
  };
  
  // Handle layout style update
  const handleLayoutChange = (value: string) => {
    onUpdate({
      data: {
        ...(section.data || {}),
        layout: value
      }
    });
  };
  
  // Add new testimonial
  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: uuidv4(),
      quote: "This product has completely transformed our business processes.",
      author: "Jane Smith",
      role: "CEO, Company Inc.",
      rating: 5,
      imageUrl: ""
    };
    
    onUpdate({
      data: {
        ...(section.data || {}),
        testimonials: [...testimonials, newTestimonial]
      }
    });
  };
  
  // Update testimonial
  const handleUpdateTestimonial = (id: string, field: string, value: any) => {
    const updatedTestimonials = testimonials.map(testimonial => 
      testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
    );
    
    onUpdate({
      data: {
        ...(section.data || {}),
        testimonials: updatedTestimonials
      }
    });
  };
  
  // Remove testimonial
  const handleRemoveTestimonial = (id: string) => {
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    
    onUpdate({
      data: {
        ...(section.data || {}),
        testimonials: updatedTestimonials
      }
    });
  };
  
  // Update display settings
  const handleDisplaySettingChange = (setting: string, value: any) => {
    onUpdate({
      data: {
        ...(section.data || {}),
        display: {
          ...(section.data?.display || {}),
          [setting]: value
        }
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Quote className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Content Tab */}
        <TabsContent value="content">
          <div className="space-y-4">
            <div>
              <Label htmlFor="section-title">Section Title</Label>
              <Input
                id="section-title"
                value={section.data?.title || ""}
                onChange={handleTitleChange}
                placeholder="What Our Clients Say"
              />
            </div>
            
            <div>
              <Label htmlFor="section-description">Section Description</Label>
              <RichTextEditor
                value={section.data?.description || ""}
                onChange={handleDescriptionChange}
                placeholder="Enter a brief description about your testimonials section"
                minHeight="100px"
              />
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Testimonials</h3>
                <Button 
                  onClick={handleAddTestimonial}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Testimonial
                </Button>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                {testimonials.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No testimonials added. Click the button above to add your first testimonial.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                      <Card key={testimonial.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <Input 
                                  value={testimonial.author || ""}
                                  onChange={(e) => handleUpdateTestimonial(testimonial.id, "author", e.target.value)}
                                  placeholder="Author Name"
                                  className="h-8"
                                />
                              </div>
                              <Input 
                                value={testimonial.role || ""}
                                onChange={(e) => handleUpdateTestimonial(testimonial.id, "role", e.target.value)}
                                placeholder="Author Role & Company"
                                className="h-8"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400" />
                                Rating
                              </Label>
                              <Select 
                                value={String(testimonial.rating || 5)}
                                onValueChange={(value) => handleUpdateTestimonial(testimonial.id, "rating", parseInt(value))}
                              >
                                <SelectTrigger className="w-16 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map(rating => (
                                    <SelectItem key={rating} value={String(rating)}>
                                      {rating}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            variant="ghost" 
                            size="icon"
                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveTestimonial(testimonial.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <Label className="text-xs mb-1 block">Testimonial Quote</Label>
                          <RichTextEditor
                            value={testimonial.quote || ""}
                            onChange={(value) => handleUpdateTestimonial(testimonial.id, "quote", value)}
                            placeholder="Enter the testimonial text"
                            minHeight="80px"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
        
        {/* Layout Tab */}
        <TabsContent value="layout">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Layout Style</Label>
              <Select 
                value={section.data?.layout || "grid"}
                onValueChange={handleLayoutChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a layout style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="masonry">Masonry</SelectItem>
                  <SelectItem value="stacked">Stacked</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Items Per Row</Label>
              <Select 
                value={String(section.data?.display?.itemsPerRow || 3)}
                onValueChange={(value) => handleDisplaySettingChange("itemsPerRow", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Card Size</Label>
                <span className="text-sm text-muted-foreground">
                  {section.data?.display?.cardSize || "medium"}
                </span>
              </div>
              <Slider
                defaultValue={[2]}
                max={3}
                step={1}
                onValueChange={(value) => {
                  const sizeMap = ["small", "medium", "large"];
                  handleDisplaySettingChange("cardSize", sizeMap[value[0]]);
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Animation Style</Label>
              <Select 
                value={section.data?.animation || "none"}
                onValueChange={(value) => handleDisplaySettingChange("animation", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Style Variant</Label>
              <Select 
                value={section.data?.variant || "standard"}
                onValueChange={(value) => handleDisplaySettingChange("variant", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="bordered">Bordered</SelectItem>
                  <SelectItem value="highlighted">Highlighted</SelectItem>
                  <SelectItem value="shadowed">Shadowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Show Author Image</Label>
              <Select 
                value={section.data?.display?.showAuthorImage ? "true" : "false"}
                onValueChange={(value) => handleDisplaySettingChange("showAuthorImage", value === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Show Rating Stars</Label>
              <Select 
                value={section.data?.display?.showRating ? "true" : "false"}
                onValueChange={(value) => handleDisplaySettingChange("showRating", value === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(TestimonialsSectionEditor);
