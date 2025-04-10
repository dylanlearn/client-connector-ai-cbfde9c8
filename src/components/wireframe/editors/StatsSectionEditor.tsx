
import React, { useState } from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChartHorizontal, Plus, Trash } from 'lucide-react';
import { getSuggestion } from '@/utils/copy-suggestions-helper';
import { ColorPicker } from '@/components/ui/color-picker';

interface StatsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

const StatsSectionEditor: React.FC<StatsSectionEditorProps> = ({ section, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('content');

  // Helper function to get stats array safely
  const getStats = (): StatItem[] => {
    // Try to get stats as a string first (it might be JSON)
    const statsStr = getSuggestion(section.copySuggestions, 'stats', '[]');
    
    try {
      // If it's a JSON string, parse it
      if (typeof statsStr === 'string' && statsStr.trim().startsWith('[')) {
        return JSON.parse(statsStr);
      }
    } catch (e) {
      console.error('Error parsing stats JSON:', e);
    }
    
    // If we have an object already
    if (section.copySuggestions && typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions)) {
      if ('stats' in section.copySuggestions && Array.isArray(section.copySuggestions.stats)) {
        return section.copySuggestions.stats;
      }
    }
    
    // Default empty array if no stats found
    return [];
  };

  // Get initial stats
  const [stats, setStats] = useState<StatItem[]>(getStats());

  // Update stats in the section
  const updateStats = (newStats: StatItem[]) => {
    setStats(newStats);
    
    const updatedCopySuggestions = { 
      ...(typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions) 
        ? section.copySuggestions 
        : {}),
      stats: newStats
    };
    
    onUpdate({ copySuggestions: updatedCopySuggestions });
  };

  const addNewStat = () => {
    const newStat: StatItem = { value: '100', label: 'New Stat', prefix: '', suffix: '%' };
    updateStats([...stats, newStat]);
  };

  const updateStatField = (index: number, field: keyof StatItem, value: string) => {
    const updatedStats = [...stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    updateStats(updatedStats);
  };

  const removeStat = (index: number) => {
    const updatedStats = [...stats];
    updatedStats.splice(index, 1);
    updateStats(updatedStats);
  };

  const updateSectionStyle = (style: Partial<Record<string, string>>) => {
    const updatedStyle = { ...(section.style || {}), ...style };
    onUpdate({ style: updatedStyle });
  };

  const title = getSuggestion(section.copySuggestions, 'title', 'Key Statistics');
  const subtitle = getSuggestion(section.copySuggestions, 'subtitle', 'Insights into our performance and achievements');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChartHorizontal className="h-5 w-5" />
            <span>Stats Section Editor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Section Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => {
                      const updatedCopySuggestions = { 
                        ...(typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions) 
                          ? section.copySuggestions 
                          : {}),
                        title: e.target.value 
                      };
                      onUpdate({ copySuggestions: updatedCopySuggestions });
                    }}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subtitle">Section Subtitle</Label>
                  <Input 
                    id="subtitle" 
                    value={subtitle} 
                    onChange={(e) => {
                      const updatedCopySuggestions = { 
                        ...(typeof section.copySuggestions === 'object' && !Array.isArray(section.copySuggestions) 
                          ? section.copySuggestions 
                          : {}),
                        subtitle: e.target.value 
                      };
                      onUpdate({ copySuggestions: updatedCopySuggestions });
                    }}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Statistics</h3>
                  <Button size="sm" variant="outline" onClick={addNewStat}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Stat
                  </Button>
                </div>

                <Accordion type="multiple" className="w-full">
                  {stats.map((stat, index) => (
                    <AccordionItem key={index} value={`stat-${index}`}>
                      <AccordionTrigger>
                        {stat.label || `Stat ${index + 1}`}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 px-1">
                        <div>
                          <Label htmlFor={`stat-label-${index}`}>Label</Label>
                          <Input 
                            id={`stat-label-${index}`}
                            value={stat.label || ''}
                            onChange={(e) => updateStatField(index, 'label', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`stat-value-${index}`}>Value</Label>
                          <Input 
                            id={`stat-value-${index}`}
                            value={stat.value || ''}
                            onChange={(e) => updateStatField(index, 'value', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`stat-prefix-${index}`}>Prefix</Label>
                            <Input 
                              id={`stat-prefix-${index}`}
                              value={stat.prefix || ''}
                              onChange={(e) => updateStatField(index, 'prefix', e.target.value)}
                              className="mt-1"
                              placeholder="$"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`stat-suffix-${index}`}>Suffix</Label>
                            <Input 
                              id={`stat-suffix-${index}`}
                              value={stat.suffix || ''}
                              onChange={(e) => updateStatField(index, 'suffix', e.target.value)}
                              className="mt-1"
                              placeholder="%"
                            />
                          </div>
                        </div>
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeStat(index)}
                          className="mt-2"
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {stats.length === 0 && (
                  <div className="text-center p-4 border border-dashed rounded-md">
                    <p className="text-muted-foreground">No statistics added yet. Click "Add Stat" to get started.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <ColorPicker
                      id="backgroundColor"
                      color={section.style?.backgroundColor || '#ffffff'}
                      onChange={(color) => updateSectionStyle({ backgroundColor: color })}
                    />
                    <span className="text-xs text-muted-foreground">
                      {section.style?.backgroundColor || '#ffffff'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <ColorPicker
                      id="textColor"
                      color={section.style?.color || '#000000'}
                      onChange={(color) => updateSectionStyle({ color: color })}
                    />
                    <span className="text-xs text-muted-foreground">
                      {section.style?.color || '#000000'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="padding">Padding</Label>
                <Input 
                  id="padding"
                  value={section.style?.padding || '2rem'}
                  onChange={(e) => updateSectionStyle({ padding: e.target.value })}
                  className="mt-1"
                  placeholder="2rem"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSectionEditor;
