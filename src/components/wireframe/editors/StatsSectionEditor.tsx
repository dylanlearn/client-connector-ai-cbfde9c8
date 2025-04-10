
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, ChartPie, Percent, Plus, Trash, BarChart, ChartBar, ChartBarHorizontal } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface StatsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const StatsSectionEditor: React.FC<StatsSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Get stats data from section or use defaults
  const data = section.data || {};
  const style = section.style || {};
  const headline = data.headline || 'Our Impact in Numbers';
  const description = data.description || 'Key metrics that showcase our success and growth.';
  const layoutStyle = data.layoutStyle || 'grid';
  const showIcons = data.showIcons !== false;
  const showLabels = data.showLabels !== false;
  const animateNumbers = data.animateNumbers !== false;
  
  const stats = data.stats || [
    { 
      value: '250+',
      label: 'Clients',
      description: 'Businesses we\'ve helped grow',
      prefix: '',
      suffix: '+',
      icon: 'users'
    },
    { 
      value: '85',
      label: 'Countries',
      description: 'Global presence',
      prefix: '',
      suffix: '',
      icon: 'globe'
    },
    { 
      value: '95',
      label: 'Satisfaction Rate',
      description: 'Client happiness score',
      prefix: '',
      suffix: '%',
      icon: 'thumbs-up'
    },
    { 
      value: '10',
      label: 'Years',
      description: 'Industry experience',
      prefix: '',
      suffix: '+',
      icon: 'calendar'
    }
  ];

  // Get style data
  const backgroundColor = style.backgroundColor || '#ffffff';
  const textColor = style.textColor || '#000000';
  const accentColor = style.accentColor || '#3b82f6';
  
  // Handle content updates
  const handleContentChange = (field: string, value: any) => {
    const updatedData = {
      ...data,
      [field]: value
    };
    onUpdate({ data: updatedData });
  };
  
  // Handle style updates
  const handleStyleChange = (field: string, value: any) => {
    const updatedStyle = {
      ...style,
      [field]: value
    };
    onUpdate({ style: updatedStyle });
  };

  // Handle stat updates
  const handleStatUpdate = (index: number, field: string, value: any) => {
    const updatedStats = [...stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    
    handleContentChange('stats', updatedStats);
  };

  // Add a new stat
  const addStat = () => {
    const newStats = [
      ...stats,
      { 
        value: '100',
        label: 'New Stat',
        description: 'Description goes here',
        prefix: '',
        suffix: '',
        icon: 'star'
      }
    ];
    handleContentChange('stats', newStats);
  };

  // Remove a stat
  const removeStat = (index: number) => {
    const newStats = [...stats];
    newStats.splice(index, 1);
    handleContentChange('stats', newStats);
  };

  // Icon options
  const iconOptions = [
    { value: 'users', label: 'Users' },
    { value: 'globe', label: 'Globe' },
    { value: 'thumbs-up', label: 'Thumbs Up' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'star', label: 'Star' },
    { value: 'award', label: 'Award' },
    { value: 'heart', label: 'Heart' },
    { value: 'smile', label: 'Smile' },
    { value: 'chart', label: 'Chart' },
    { value: 'dollar', label: 'Dollar' },
    { value: 'check', label: 'Check' },
    { value: 'rocket', label: 'Rocket' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium flex items-center gap-2">
        <BarChart3 className="w-5 h-5" /> Stats Section Editor
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headline">Section Headline</Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => handleContentChange('headline', e.target.value)}
                placeholder="Our Impact in Numbers"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Section Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="Key metrics that showcase our success"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="layoutStyle">Layout Style</Label>
                <Select 
                  value={layoutStyle} 
                  onValueChange={(value) => handleContentChange('layoutStyle', value)}
                >
                  <SelectTrigger id="layoutStyle">
                    <SelectValue placeholder="Select Layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                    <SelectItem value="cards">Cards</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-medium">Display Options</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="showIcons">Show Icons</Label>
                </div>
                <Switch 
                  id="showIcons"
                  checked={showIcons}
                  onCheckedChange={(checked) => handleContentChange('showIcons', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="showLabels">Show Labels</Label>
                </div>
                <Switch 
                  id="showLabels"
                  checked={showLabels}
                  onCheckedChange={(checked) => handleContentChange('showLabels', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="animateNumbers">Animate Numbers</Label>
                </div>
                <Switch 
                  id="animateNumbers"
                  checked={animateNumbers}
                  onCheckedChange={(checked) => handleContentChange('animateNumbers', checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Statistics Items</h3>
            <Button 
              size="sm" 
              onClick={addStat} 
              variant="outline"
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Stat
            </Button>
          </div>
          
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-md font-medium">Statistic {index + 1}</h4>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeStat(index)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`stat-${index}-prefix`}>Prefix</Label>
                        <Input
                          id={`stat-${index}-prefix`}
                          value={stat.prefix || ''}
                          onChange={(e) => handleStatUpdate(index, 'prefix', e.target.value)}
                          placeholder="$, €, ¥"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`stat-${index}-value`}>Value</Label>
                        <Input
                          id={`stat-${index}-value`}
                          value={stat.value || ''}
                          onChange={(e) => handleStatUpdate(index, 'value', e.target.value)}
                          placeholder="100"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`stat-${index}-suffix`}>Suffix</Label>
                        <Input
                          id={`stat-${index}-suffix`}
                          value={stat.suffix || ''}
                          onChange={(e) => handleStatUpdate(index, 'suffix', e.target.value)}
                          placeholder="%, +, K"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`stat-${index}-label`}>Label</Label>
                      <Input
                        id={`stat-${index}-label`}
                        value={stat.label || ''}
                        onChange={(e) => handleStatUpdate(index, 'label', e.target.value)}
                        placeholder="Customers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`stat-${index}-description`}>Description</Label>
                      <Textarea
                        id={`stat-${index}-description`}
                        value={stat.description || ''}
                        onChange={(e) => handleStatUpdate(index, 'description', e.target.value)}
                        placeholder="Short description"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`stat-${index}-icon`}>Icon</Label>
                      <Select 
                        value={stat.icon || 'star'} 
                        onValueChange={(value) => handleStatUpdate(index, 'icon', value)}
                      >
                        <SelectTrigger id={`stat-${index}-icon`}>
                          <SelectValue placeholder="Select Icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map(icon => (
                            <SelectItem key={icon.value} value={icon.value}>
                              {icon.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="textColor"
                  color={textColor}
                  onChange={(color) => handleStyleChange('textColor', color)}
                />
                <Input
                  value={textColor}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center space-x-2">
                <ColorPicker
                  id="accentColor"
                  color={accentColor}
                  onChange={(color) => handleStyleChange('accentColor', color)}
                />
                <Input
                  value={accentColor}
                  onChange={(e) => handleStyleChange('accentColor', e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Select 
                value={style.padding || '4'} 
                onValueChange={(value) => handleStyleChange('padding', value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Medium (16px)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0px)</SelectItem>
                  <SelectItem value="2">Small (8px)</SelectItem>
                  <SelectItem value="4">Medium (16px)</SelectItem>
                  <SelectItem value="6">Large (24px)</SelectItem>
                  <SelectItem value="8">Extra Large (32px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valueSize">Value Text Size</Label>
              <Select 
                value={style.valueSize || 'text-4xl'} 
                onValueChange={(value) => handleStyleChange('valueSize', value)}
              >
                <SelectTrigger id="valueSize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-2xl">Small</SelectItem>
                  <SelectItem value="text-3xl">Medium</SelectItem>
                  <SelectItem value="text-4xl">Large</SelectItem>
                  <SelectItem value="text-5xl">Extra Large</SelectItem>
                  <SelectItem value="text-6xl">2X Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="statAlignment">Text Alignment</Label>
              <Select 
                value={style.statAlignment || 'text-center'} 
                onValueChange={(value) => handleStyleChange('statAlignment', value)}
              >
                <SelectTrigger id="statAlignment">
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-left">Left</SelectItem>
                  <SelectItem value="text-center">Center</SelectItem>
                  <SelectItem value="text-right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iconSize">Icon Size</Label>
              <Select 
                value={style.iconSize || 'text-4xl'} 
                onValueChange={(value) => handleStyleChange('iconSize', value)}
              >
                <SelectTrigger id="iconSize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-2xl">Small</SelectItem>
                  <SelectItem value="text-3xl">Medium</SelectItem>
                  <SelectItem value="text-4xl">Large</SelectItem>
                  <SelectItem value="text-5xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsSectionEditor;
