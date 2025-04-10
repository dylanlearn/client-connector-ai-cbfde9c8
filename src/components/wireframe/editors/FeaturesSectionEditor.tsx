
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
import { Switch } from '@/components/ui/switch';
import RichTextEditor from './RichTextEditor';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface FeaturesSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  link?: string;
}

const FeaturesSectionEditor: React.FC<FeaturesSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#ffffff';
  const heading = section.data?.heading || getSuggestion(section.copySuggestions, 'heading', 'Our Features');
  const subheading = section.data?.subheading || getSuggestion(section.copySuggestions, 'subheading', 'What makes our product special');
  
  // Initialize feature items
  const initialFeatures = section.data?.features || [];
  const [features, setFeatures] = useState<FeatureItem[]>(initialFeatures);
  const layout = section.data?.layout || 'grid';
  const columns = section.data?.columns || 3;
  const variant = section.data?.variant || section.componentVariant || 'standard';
  
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
  
  // Feature management
  const addFeature = () => {
    const newFeature = {
      id: `feature-${Date.now()}`,
      title: 'New Feature',
      description: 'Description of this feature',
      icon: 'star'
    };
    
    const updatedFeatures = [...features, newFeature];
    setFeatures(updatedFeatures);
    handleContentChange('features', updatedFeatures);
  };
  
  const updateFeature = (id: string, field: string, value: any) => {
    const updatedFeatures = features.map(feature => {
      if (feature.id === id) {
        return { ...feature, [field]: value };
      }
      return feature;
    });
    
    setFeatures(updatedFeatures);
    handleContentChange('features', updatedFeatures);
  };
  
  const deleteFeature = (id: string) => {
    const updatedFeatures = features.filter(feature => feature.id !== id);
    setFeatures(updatedFeatures);
    handleContentChange('features', updatedFeatures);
  };
  
  const moveFeature = (id: string, direction: 'up' | 'down') => {
    const index = features.findIndex(feature => feature.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === features.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedFeatures = [...features];
    const [removed] = updatedFeatures.splice(index, 1);
    updatedFeatures.splice(newIndex, 0, removed);
    
    setFeatures(updatedFeatures);
    handleContentChange('features', updatedFeatures);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
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
                placeholder="Features Section Heading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <RichTextEditor
                id="subheading"
                value={subheading}
                onChange={(value) => handleContentChange('subheading', value)}
                minHeight="100px"
                placeholder="Features Section Subheading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="layout">Feature Layout</Label>
              <Select 
                value={layout} 
                onValueChange={(value) => handleContentChange('layout', value)}
              >
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Grid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">Vertical List</SelectItem>
                  <SelectItem value="alternating">Alternating</SelectItem>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {layout === 'grid' && (
              <div className="space-y-2">
                <Label htmlFor="columns">Columns</Label>
                <Select 
                  value={String(columns)} 
                  onValueChange={(value) => handleContentChange('columns', parseInt(value))}
                >
                  <SelectTrigger id="columns">
                    <SelectValue placeholder="3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Column</SelectItem>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="variant">Feature Style Variant</Label>
              <Select 
                value={variant} 
                onValueChange={(value) => {
                  handleContentChange('variant', value);
                  onUpdate({ componentVariant: value });
                }}
              >
                <SelectTrigger id="variant">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="icon-top">Icons on Top</SelectItem>
                  <SelectItem value="icon-left">Icons on Left</SelectItem>
                  <SelectItem value="image">With Images</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="boxed">Boxed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Button onClick={addFeature} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Feature
            </Button>
            
            <div className="space-y-4 mt-4">
              {features.length === 0 ? (
                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                  No features. Click the button above to add one.
                </div>
              ) : (
                features.map((feature, index) => (
                  <Card key={feature.id} className="relative">
                    <CardContent className="pt-4 space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${feature.id}`}>Feature Title</Label>
                        <Input
                          id={`title-${feature.id}`}
                          value={feature.title}
                          onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                          placeholder="Feature Title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`description-${feature.id}`}>Description</Label>
                        <RichTextEditor
                          id={`description-${feature.id}`}
                          value={feature.description}
                          onChange={(value) => updateFeature(feature.id, 'description', value)}
                          minHeight="100px"
                          placeholder="Feature description"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`icon-${feature.id}`}>Icon Name</Label>
                          <Input
                            id={`icon-${feature.id}`}
                            value={feature.icon || ''}
                            onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                            placeholder="star"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`imageUrl-${feature.id}`}>Image URL (optional)</Label>
                          <Input
                            id={`imageUrl-${feature.id}`}
                            value={feature.imageUrl || ''}
                            onChange={(e) => updateFeature(feature.id, 'imageUrl', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`link-${feature.id}`}>Link URL (optional)</Label>
                        <Input
                          id={`link-${feature.id}`}
                          value={feature.link || ''}
                          onChange={(e) => updateFeature(feature.id, 'link', e.target.value)}
                          placeholder="#"
                        />
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveFeature(feature.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveFeature(feature.id, 'down')}
                            disabled={index === features.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => deleteFeature(feature.id)}
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
            
            <div className="space-y-2">
              <Label htmlFor="gap">Item Spacing</Label>
              <Select 
                value={section.style?.gap || section.gap || '4'} 
                onValueChange={(value) => handleStyleChange('gap', value)}
              >
                <SelectTrigger id="gap">
                  <SelectValue placeholder="Medium (16px)" />
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeaturesSectionEditor;
