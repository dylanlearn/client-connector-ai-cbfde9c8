
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Plus, Trash2, MoveUp, MoveDown, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import RichTextEditor from './RichTextEditor';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface PricingSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  highlighted?: boolean;
  currency?: string;
}

interface PricingFeature {
  id: string;
  text: string;
}

const PricingSectionEditor: React.FC<PricingSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get data from section or use defaults
  const backgroundColor = section.backgroundColor || section.style?.backgroundColor || '#ffffff';
  const heading = section.data?.heading || getSuggestion(section.copySuggestions, 'heading', 'Pricing Plans');
  const subheading = section.data?.subheading || getSuggestion(section.copySuggestions, 'subheading', 'Choose the plan that works for you');
  
  // Initialize pricing tiers
  const initialTiers = section.data?.tiers || [];
  const [tiers, setTiers] = useState<PricingTier[]>(initialTiers);
  const layout = section.data?.layout || 'cards';
  const displayType = section.data?.displayType || section.componentVariant || 'horizontal';
  
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
  
  // Pricing tier management
  const addTier = () => {
    const newTier = {
      id: `tier-${Date.now()}`,
      name: 'New Tier',
      price: '99',
      period: 'month',
      description: 'Description for this pricing tier',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      buttonText: 'Get Started',
      buttonUrl: '#',
      highlighted: false,
      currency: '$'
    };
    
    const updatedTiers = [...tiers, newTier];
    setTiers(updatedTiers);
    handleContentChange('tiers', updatedTiers);
  };
  
  const updateTier = (id: string, field: string, value: any) => {
    const updatedTiers = tiers.map(tier => {
      if (tier.id === id) {
        return { ...tier, [field]: value };
      }
      return tier;
    });
    
    setTiers(updatedTiers);
    handleContentChange('tiers', updatedTiers);
  };
  
  const deleteTier = (id: string) => {
    const updatedTiers = tiers.filter(tier => tier.id !== id);
    setTiers(updatedTiers);
    handleContentChange('tiers', updatedTiers);
  };
  
  const moveTier = (id: string, direction: 'up' | 'down') => {
    const index = tiers.findIndex(tier => tier.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === tiers.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedTiers = [...tiers];
    const [removed] = updatedTiers.splice(index, 1);
    updatedTiers.splice(newIndex, 0, removed);
    
    setTiers(updatedTiers);
    handleContentChange('tiers', updatedTiers);
  };
  
  // Features management
  const addFeature = (tierId: string) => {
    const tier = tiers.find(t => t.id === tierId);
    if (!tier) return;
    
    const features = [...(tier.features || []), `New Feature`];
    updateTier(tierId, 'features', features);
  };
  
  const updateFeature = (tierId: string, index: number, value: string) => {
    const tier = tiers.find(t => t.id === tierId);
    if (!tier) return;
    
    const features = [...(tier.features || [])];
    features[index] = value;
    updateTier(tierId, 'features', features);
  };
  
  const deleteFeature = (tierId: string, index: number) => {
    const tier = tiers.find(t => t.id === tierId);
    if (!tier) return;
    
    const features = [...(tier.features || [])];
    features.splice(index, 1);
    updateTier(tierId, 'features', features);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="tiers">Pricing Tiers</TabsTrigger>
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
                placeholder="Pricing Section Heading"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <RichTextEditor
                id="subheading"
                value={subheading}
                onChange={(value) => handleContentChange('subheading', value)}
                minHeight="100px"
                placeholder="Pricing Section Subheading"
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
                  <SelectValue placeholder="Horizontal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="tabbed">Tabbed</SelectItem>
                  <SelectItem value="toggle">Toggle Monthly/Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="layout">Pricing Layout</Label>
              <Select 
                value={layout} 
                onValueChange={(value) => handleContentChange('layout', value)}
              >
                <SelectTrigger id="layout">
                  <SelectValue placeholder="Cards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="simple">Simple List</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tiers" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Button onClick={addTier} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Pricing Tier
            </Button>
            
            <div className="space-y-4 mt-4">
              {tiers.length === 0 ? (
                <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                  No pricing tiers. Click the button above to add one.
                </div>
              ) : (
                tiers.map((tier, index) => (
                  <Card key={tier.id} className={`relative ${tier.highlighted ? 'border-2 border-primary' : ''}`}>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${tier.id}`}>Tier Name</Label>
                          <Input
                            id={`name-${tier.id}`}
                            value={tier.name}
                            onChange={(e) => updateTier(tier.id, 'name', e.target.value)}
                            placeholder="Basic"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`highlighted-${tier.id}`}>Highlight this tier</Label>
                          <div className="flex items-center pt-2">
                            <Switch 
                              id={`highlighted-${tier.id}`}
                              checked={tier.highlighted || false}
                              onCheckedChange={(checked) => updateTier(tier.id, 'highlighted', checked)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`currency-${tier.id}`}>Currency</Label>
                          <Input
                            id={`currency-${tier.id}`}
                            value={tier.currency || '$'}
                            onChange={(e) => updateTier(tier.id, 'currency', e.target.value)}
                            placeholder="$"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`price-${tier.id}`}>Price</Label>
                          <Input
                            id={`price-${tier.id}`}
                            value={tier.price}
                            onChange={(e) => updateTier(tier.id, 'price', e.target.value)}
                            placeholder="99"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`period-${tier.id}`}>Period</Label>
                          <Select 
                            value={tier.period} 
                            onValueChange={(value) => updateTier(tier.id, 'period', value)}
                          >
                            <SelectTrigger id={`period-${tier.id}`}>
                              <SelectValue placeholder="month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">month</SelectItem>
                              <SelectItem value="year">year</SelectItem>
                              <SelectItem value="week">week</SelectItem>
                              <SelectItem value="one-time">one-time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`description-${tier.id}`}>Description</Label>
                        <Input
                          id={`description-${tier.id}`}
                          value={tier.description}
                          onChange={(e) => updateTier(tier.id, 'description', e.target.value)}
                          placeholder="Perfect for small businesses"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex justify-between items-center">
                          <span>Features</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addFeature(tier.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add
                          </Button>
                        </Label>
                        
                        <div className="space-y-2 border rounded-md p-2">
                          {(tier.features || []).length === 0 ? (
                            <div className="text-center p-2 text-sm text-muted-foreground">
                              No features. Click Add to add one.
                            </div>
                          ) : (
                            (tier.features || []).map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <Input
                                  value={feature}
                                  onChange={(e) => updateFeature(tier.id, featureIndex, e.target.value)}
                                  placeholder="Feature description"
                                  className="flex-grow"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteFeature(tier.id, featureIndex)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`buttonText-${tier.id}`}>Button Text</Label>
                          <Input
                            id={`buttonText-${tier.id}`}
                            value={tier.buttonText}
                            onChange={(e) => updateTier(tier.id, 'buttonText', e.target.value)}
                            placeholder="Get Started"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`buttonUrl-${tier.id}`}>Button URL</Label>
                          <Input
                            id={`buttonUrl-${tier.id}`}
                            value={tier.buttonUrl}
                            onChange={(e) => updateTier(tier.id, 'buttonUrl', e.target.value)}
                            placeholder="#"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveTier(tier.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => moveTier(tier.id, 'down')}
                            disabled={index === tiers.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => deleteTier(tier.id)}
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

export default PricingSectionEditor;
