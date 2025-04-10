
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/ui/color-picker';
import { BarChartHorizontal, BarChart4, TrendingUp, Percent } from 'lucide-react';

interface StatsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const StatsSectionEditor: React.FC<StatsSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');

  const handleStyleChange = (property: string, value: any) => {
    onUpdate({
      style: {
        ...section.style,
        [property]: value
      }
    });
  };

  const handleContentChange = (field: string, value: any) => {
    const updatedContent = {
      ...section.copySuggestions,
      [field]: value
    };
    onUpdate({ copySuggestions: updatedContent });
  };

  const handleStatChange = (index: number, field: string, value: any) => {
    const stats = [...(section.copySuggestions?.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    
    handleContentChange('stats', stats);
  };

  const addNewStat = () => {
    const stats = [...(section.copySuggestions?.stats || [])];
    stats.push({
      value: '100+',
      label: 'New Feature',
      description: 'Brief description of this statistic',
      icon: 'BarChart4'
    });
    
    handleContentChange('stats', stats);
  };

  const removeStat = (index: number) => {
    const stats = [...(section.copySuggestions?.stats || [])];
    stats.splice(index, 1);
    
    handleContentChange('stats', stats);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BarChartHorizontal': return <BarChartHorizontal className="h-5 w-5" />;
      case 'BarChart4': return <BarChart4 className="h-5 w-5" />;
      case 'TrendingUp': return <TrendingUp className="h-5 w-5" />;
      case 'Percent': return <Percent className="h-5 w-5" />;
      default: return <BarChart4 className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stats Section Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Section Title</Label>
              <Input 
                id="title" 
                value={section.copySuggestions?.title || 'Key Metrics'} 
                onChange={(e) => handleContentChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Section Subtitle</Label>
              <Textarea 
                id="subtitle" 
                value={section.copySuggestions?.subtitle || 'Our achievements in numbers'} 
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
              />
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Statistics</h3>
                <Button size="sm" onClick={addNewStat}>Add Stat</Button>
              </div>
              
              {(section.copySuggestions?.stats || []).map((stat, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Stat #{index + 1}</h4>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeStat(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`stat-value-${index}`}>Value</Label>
                      <Input 
                        id={`stat-value-${index}`} 
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`stat-label-${index}`}>Label</Label>
                      <Input 
                        id={`stat-label-${index}`} 
                        value={stat.label}
                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor={`stat-desc-${index}`}>Description</Label>
                      <Textarea 
                        id={`stat-desc-${index}`} 
                        value={stat.description}
                        onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label>Icon</Label>
                      <div className="flex space-x-2">
                        <button 
                          type="button"
                          className={`p-2 border rounded-md ${stat.icon === 'BarChartHorizontal' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                          onClick={() => handleStatChange(index, 'icon', 'BarChartHorizontal')}
                        >
                          <BarChartHorizontal className="h-5 w-5" />
                        </button>
                        <button 
                          type="button"
                          className={`p-2 border rounded-md ${stat.icon === 'BarChart4' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                          onClick={() => handleStatChange(index, 'icon', 'BarChart4')}
                        >
                          <BarChart4 className="h-5 w-5" />
                        </button>
                        <button 
                          type="button"
                          className={`p-2 border rounded-md ${stat.icon === 'TrendingUp' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                          onClick={() => handleStatChange(index, 'icon', 'TrendingUp')}
                        >
                          <TrendingUp className="h-5 w-5" />
                        </button>
                        <button 
                          type="button"
                          className={`p-2 border rounded-md ${stat.icon === 'Percent' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                          onClick={() => handleStatChange(index, 'icon', 'Percent')}
                        >
                          <Percent className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {(section.copySuggestions?.stats || []).length === 0 && (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No statistics added yet. Click "Add Stat" to create one.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="style" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="backgroundColor"
                  color={section.style?.backgroundColor || '#ffffff'}
                  onChange={(color) => handleStyleChange('backgroundColor', color)}
                />
                <Input
                  value={section.style?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-28"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="textColor"
                  color={section.style?.textColor || '#000000'}
                  onChange={(color) => handleStyleChange('textColor', color)}
                />
                <Input
                  value={section.style?.textColor || '#000000'}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="w-28"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="accentColor"
                  color={section.style?.accentColor || '#3b82f6'}
                  onChange={(color) => handleStyleChange('accentColor', color)}
                />
                <Input
                  value={section.style?.accentColor || '#3b82f6'}
                  onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                  className="w-28"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="showIcons" className="flex-grow">Show Icons</Label>
              <Switch
                id="showIcons"
                checked={section.style?.showIcons !== false}
                onCheckedChange={(checked) => handleStyleChange('showIcons', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Animation Style</Label>
              <Select
                value={section.style?.animationStyle || 'none'}
                onValueChange={(value) => handleStyleChange('animationStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select animation style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade">Fade In</SelectItem>
                  <SelectItem value="slide">Slide Up</SelectItem>
                  <SelectItem value="count">Count Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Layout Type</Label>
              <Select
                value={section.style?.layout || 'grid'}
                onValueChange={(value) => handleStyleChange('layout', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="row">Single Row</SelectItem>
                  <SelectItem value="featured">Featured (1 large + smaller)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Items Per Row (Desktop)</Label>
              <Select
                value={section.style?.itemsPerRow?.toString() || '4'}
                onValueChange={(value) => handleStyleChange('itemsPerRow', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number of items per row" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Items</SelectItem>
                  <SelectItem value="3">3 Items</SelectItem>
                  <SelectItem value="4">4 Items</SelectItem>
                  <SelectItem value="5">5 Items</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="padding">Section Padding</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="padding"
                  min={0}
                  max={100}
                  step={4}
                  value={[section.style?.padding ? parseInt(section.style.padding) : 32]}
                  onValueChange={(values) => handleStyleChange('padding', `${values[0]}px`)}
                />
                <span className="w-12 text-center">{section.style?.padding || '32px'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gap">Item Gap</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="gap"
                  min={0}
                  max={64}
                  step={4}
                  value={[section.style?.gap ? parseInt(section.style.gap) : 16]}
                  onValueChange={(values) => handleStyleChange('gap', `${values[0]}px`)}
                />
                <span className="w-12 text-center">{section.style?.gap || '16px'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="alignCenter" className="flex-grow">Center Content</Label>
              <Switch
                id="alignCenter"
                checked={section.style?.alignCenter !== false}
                onCheckedChange={(checked) => handleStyleChange('alignCenter', checked)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatsSectionEditor;
