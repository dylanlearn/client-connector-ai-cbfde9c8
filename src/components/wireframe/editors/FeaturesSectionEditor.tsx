
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trash2, Plus, Image } from 'lucide-react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { processCopySuggestions } from '../renderers/utilities';

interface FeaturesSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const FeaturesSectionEditor: React.FC<FeaturesSectionEditorProps> = ({
  section,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Process copy suggestions to ensure we're working with an object
  const copySuggestions = processCopySuggestions(section.copySuggestions);
  
  // Extract features from section data
  const features = section.data?.features || [];
  
  // Update heading
  const updateHeading = (heading: string) => {
    onUpdate({
      copySuggestions: {
        ...copySuggestions,
        heading
      }
    });
  };
  
  // Update subheading
  const updateSubheading = (subheading: string) => {
    onUpdate({
      copySuggestions: {
        ...copySuggestions,
        subheading
      }
    });
  };
  
  // Add a new feature
  const addFeature = () => {
    const newFeature = {
      id: `feature-${Date.now()}`,
      title: 'New Feature',
      description: 'Description of the new feature',
      icon: 'sparkles'
    };
    
    onUpdate({
      data: {
        ...section.data,
        features: [...features, newFeature]
      }
    });
  };
  
  // Remove a feature
  const removeFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    
    onUpdate({
      data: {
        ...section.data,
        features: updatedFeatures
      }
    });
  };
  
  // Update a feature
  const updateFeature = (index: number, updates: any) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      ...updates
    };
    
    onUpdate({
      data: {
        ...section.data,
        features: updatedFeatures
      }
    });
  };
  
  // Update layout type
  const updateLayoutType = (layoutType: string) => {
    onUpdate({
      layout: {
        ...(typeof section.layout === 'object' ? section.layout : {}),
        type: layoutType
      }
    });
  };

  return (
    <div className="features-section-editor space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Section Heading</Label>
              <Input 
                id="heading" 
                value={copySuggestions.heading || ''} 
                onChange={(e) => updateHeading(e.target.value)}
                placeholder="Features Heading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subheading">Section Subheading</Label>
              <Textarea 
                id="subheading" 
                value={copySuggestions.subheading || ''} 
                onChange={(e) => updateSubheading(e.target.value)}
                placeholder="Features subheading text"
                rows={2}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Features</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addFeature}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add Feature
              </Button>
            </div>
            
            {features.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground">No features added yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addFeature}
                    className="mt-2"
                  >
                    Add Your First Feature
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <Card key={feature.id || index}>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Feature {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFeature(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`feature-${index}-title`}>Title</Label>
                          <Input 
                            id={`feature-${index}-title`} 
                            value={feature.title || ''} 
                            onChange={(e) => updateFeature(index, { title: e.target.value })}
                            placeholder="Feature Title"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`feature-${index}-description`}>Description</Label>
                          <Textarea 
                            id={`feature-${index}-description`} 
                            value={feature.description || ''} 
                            onChange={(e) => updateFeature(index, { description: e.target.value })}
                            placeholder="Feature Description"
                            rows={2}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`feature-${index}-image`}>Image URL</Label>
                          <div className="flex gap-2">
                            <Input 
                              id={`feature-${index}-image`} 
                              value={feature.imageUrl || ''} 
                              onChange={(e) => updateFeature(index, { imageUrl: e.target.value })}
                              placeholder="https://example.com/image.jpg"
                            />
                            <Button variant="outline" size="icon" className="flex-shrink-0">
                              <Image className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Layout Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={typeof section.layout === 'object' && section.layout.type === 'grid' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => updateLayoutType('grid')}
              >
                Grid
              </Button>
              <Button
                variant={typeof section.layout === 'object' && section.layout.type === 'list' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => updateLayoutType('list')}
              >
                List
              </Button>
              <Button
                variant={typeof section.layout === 'object' && section.layout.type === 'carousel' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => updateLayoutType('carousel')}
              >
                Carousel
              </Button>
            </div>
          </div>
          
          {/* Additional layout options would go here */}
        </TabsContent>
        
        <TabsContent value="style" className="space-y-6 pt-4">
          {/* Style options would go here */}
          <p className="text-muted-foreground">Style options coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeaturesSectionEditor;
