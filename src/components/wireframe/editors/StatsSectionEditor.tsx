
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { BarChartHorizontal, Palette, Type, Layout } from 'lucide-react';
import { ColorPicker } from '@/components/ui/color-picker';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface StatsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const StatsSectionEditor: React.FC<StatsSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');

  const handleColorChange = (color: string, property: string) => {
    onUpdate({
      style: {
        ...section.style,
        [property]: color
      }
    });
  };

  const handleCopySuggestionChange = (key: string, value: string) => {
    const updatedSuggestions = { ...(section.copySuggestions || {}) };
    
    // Handle stats array specially
    if (key.startsWith('stats')) {
      // Parse the key to get the index and property
      const match = key.match(/stats\[(\d+)\]\.(.+)/);
      if (match) {
        const index = parseInt(match[1]);
        const prop = match[2];
        
        // Initialize stats array if it doesn't exist
        if (!updatedSuggestions.stats) {
          updatedSuggestions.stats = [];
        }
        
        // Initialize the stats object at the given index if it doesn't exist
        if (!Array.isArray(updatedSuggestions.stats)) {
          updatedSuggestions.stats = [];
        }
        
        while (updatedSuggestions.stats.length <= index) {
          updatedSuggestions.stats.push({ value: '', label: '' });
        }
        
        updatedSuggestions.stats[index] = {
          ...updatedSuggestions.stats[index],
          [prop]: value
        };
      } else if (key === 'stats') {
        // Handle the case where we're setting the entire stats array
        try {
          updatedSuggestions.stats = JSON.parse(value);
        } catch (e) {
          console.error('Failed to parse stats JSON', e);
        }
      }
    } else {
      // For non-stats properties, just set them directly
      updatedSuggestions[key] = value;
    }
    
    onUpdate({ copySuggestions: updatedSuggestions });
  };

  // Get the current stats safely using getSuggestion helper
  const getStats = () => {
    const statsValue = getSuggestion(section.copySuggestions, 'stats', '[]');
    try {
      return typeof statsValue === 'string' ? JSON.parse(statsValue) : statsValue;
    } catch (e) {
      console.error('Failed to parse stats', e);
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Styling
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <BarChartHorizontal className="h-4 w-4" />
            Stats Data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Stats Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Section Title</Label>
                <Input 
                  id="title" 
                  value={getSuggestion(section.copySuggestions, 'title', '')} 
                  onChange={(e) => handleCopySuggestionChange('title', e.target.value)}
                  placeholder="Enter section title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="subtitle">Section Subtitle</Label>
                <Textarea 
                  id="subtitle" 
                  value={getSuggestion(section.copySuggestions, 'subtitle', '')}
                  onChange={(e) => handleCopySuggestionChange('subtitle', e.target.value)}
                  placeholder="Enter section subtitle or description"
                  rows={3}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <Label>Stats Items</Label>
                {Array.isArray(getStats()) ? (
                  getStats().map((stat: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-2 p-3 border rounded-md">
                      <div className="grid gap-2">
                        <Label htmlFor={`stat-value-${index}`}>Value</Label>
                        <Input 
                          id={`stat-value-${index}`} 
                          value={stat.value || ''}
                          onChange={(e) => handleCopySuggestionChange(`stats[${index}].value`, e.target.value)}
                          placeholder="e.g., 99%"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor={`stat-label-${index}`}>Label</Label>
                        <Input 
                          id={`stat-label-${index}`} 
                          value={stat.label || ''}
                          onChange={(e) => handleCopySuggestionChange(`stats[${index}].label`, e.target.value)}
                          placeholder="e.g., Customer Satisfaction"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 border rounded-md text-muted-foreground">
                    No stats data available
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const currentStats = getStats();
                      const newStats = Array.isArray(currentStats) ? 
                        [...currentStats, { value: '', label: '' }] : 
                        [{ value: '', label: '' }];
                      
                      handleCopySuggestionChange('stats', JSON.stringify(newStats));
                    }}
                  >
                    Add Stat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="style">
          <Card>
            <CardHeader>
              <CardTitle>Visual Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <ColorPicker
                      id="bg-color"
                      color={section.style?.backgroundColor || '#ffffff'}
                      onChange={(color) => handleColorChange(color, 'backgroundColor')}
                    />
                    <span className="text-sm text-muted-foreground">
                      {section.style?.backgroundColor || '#ffffff'}
                    </span>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <ColorPicker
                      id="text-color"
                      color={section.style?.color || '#000000'}
                      onChange={(color) => handleColorChange(color, 'color')}
                    />
                    <span className="text-sm text-muted-foreground">
                      {section.style?.color || '#000000'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="padding">Padding</Label>
                  <Input 
                    id="padding"
                    value={section.style?.padding || '2rem'}
                    onChange={(e) => handleColorChange(e.target.value, 'padding')}
                    placeholder="e.g., 2rem"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gap">Gap Between Stats</Label>
                  <Input 
                    id="gap"
                    value={section.style?.gap || '1.5rem'}
                    onChange={(e) => handleColorChange(e.target.value, 'gap')}
                    placeholder="e.g., 1.5rem"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Stats Data JSON</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="stats-json">Edit Raw Stats Data (JSON)</Label>
                <Textarea 
                  id="stats-json" 
                  value={JSON.stringify(getStats(), null, 2)}
                  onChange={(e) => {
                    try {
                      // Parse to verify valid JSON
                      JSON.parse(e.target.value);
                      handleCopySuggestionChange('stats', e.target.value);
                    } catch (err) {
                      // If not valid JSON, don't update
                      console.error('Invalid JSON for stats data', err);
                    }
                  }}
                  placeholder='[{"value": "95%", "label": "Customer Satisfaction"}, ...]'
                  rows={10}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Edit stats data as raw JSON. Each stat should have "value" and "label" properties.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsSectionEditor;
