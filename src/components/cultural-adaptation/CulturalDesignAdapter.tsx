
import React, { useState, useEffect } from 'react';
import { useCulturalDesignAdaptation, CulturalContext } from '@/hooks/use-cultural-design-adaptation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Globe, PanelLeft, Type, Palette } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';
import { Badge } from '@/components/ui/badge';

interface CulturalDesignAdapterProps {
  initialRegion?: string;
  wireframeId?: string;
  onCultureChange?: (culturalContext: CulturalContext) => void;
  className?: string;
}

const CulturalDesignAdapter: React.FC<CulturalDesignAdapterProps> = ({ 
  initialRegion = 'North America',
  wireframeId,
  onCultureChange,
  className
}) => {
  const { 
    culturalContexts, 
    currentContext, 
    adaptations,
    regionalPreferences,
    isLoading, 
    error, 
    setContext 
  } = useCulturalDesignAdaptation(initialRegion);
  
  const [activeTab, setActiveTab] = useState<string>('colors');
  
  useEffect(() => {
    if (currentContext && onCultureChange) {
      onCultureChange(currentContext);
    }
  }, [currentContext, onCultureChange]);
  
  const handleContextChange = (contextName: string) => {
    setContext(contextName);
  };
  
  const getReadingDirectionIcon = (direction: string = 'ltr') => {
    switch (direction) {
      case 'rtl':
        return <PanelLeft className="h-4 w-4 transform rotate-180" />;
      case 'ttb':
        return <PanelLeft className="h-4 w-4 transform rotate-90" />;
      default:
        return <PanelLeft className="h-4 w-4" />;
    }
  };

  if (error) {
    return <AlertMessage type="error">Failed to load cultural contexts: {error.message}</AlertMessage>;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Cultural Design Adaptation</span>
          {!isLoading && (
            <Select 
              value={currentContext?.name} 
              onValueChange={handleContextChange}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Culture" />
              </SelectTrigger>
              <SelectContent>
                {culturalContexts.map(ctx => (
                  <SelectItem key={ctx.id} value={ctx.name}>{ctx.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : currentContext ? (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm font-medium">{currentContext.region}</span>
              </div>
              
              <div className="flex items-center">
                {getReadingDirectionIcon(currentContext.reading_direction)}
                <span className="text-sm font-medium ml-1">
                  {currentContext.reading_direction === 'rtl' ? 'Right to Left' : 
                   currentContext.reading_direction === 'ttb' ? 'Top to Bottom' : 'Left to Right'}
                </span>
              </div>
              
              {currentContext.language && (
                <Badge variant="outline">{currentContext.language}</Badge>
              )}
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors" className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  <span>Colors</span>
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-1">
                  <PanelLeft className="h-4 w-4" />
                  <span>Layout</span>
                </TabsTrigger>
                <TabsTrigger value="typography" className="flex items-center gap-1">
                  <Type className="h-4 w-4" />
                  <span>Typography</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="colors" className="pt-4">
                <div className="grid gap-3">
                  <h3 className="text-base font-medium">Color Preferences</h3>
                  {currentContext.color_preferences ? (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(currentContext.color_preferences).map(([key, color]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                          <div>
                            <p className="text-sm capitalize">{key}</p>
                            <p className="text-xs text-muted-foreground">{color}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific color preferences</p>
                  )}
                  
                  <h3 className="text-base font-medium mt-4">Component Adaptations</h3>
                  {adaptations.filter(a => a.adaptation_rules.colors).length > 0 ? (
                    <div className="grid gap-2">
                      {adaptations
                        .filter(a => a.adaptation_rules.colors)
                        .map(adaptation => (
                          <div key={adaptation.id} className="border rounded p-3">
                            <h4 className="font-medium">{adaptation.component_type || adaptation.wireframe_element_type}</h4>
                            <div className="mt-1">
                              {Object.entries(adaptation.adaptation_rules.colors).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2 mt-1">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: String(value) }}
                                  />
                                  <span className="text-sm capitalize">{key}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No component-specific color adaptations</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="pt-4">
                <div className="grid gap-3">
                  <h3 className="text-base font-medium">Layout Preferences</h3>
                  {currentContext.layout_preferences ? (
                    <div className="bg-gray-50 p-3 rounded-md">
                      {Object.entries(currentContext.layout_preferences).map(([key, value]) => (
                        <div key={key} className="mb-1 flex items-center">
                          <span className="text-sm font-medium capitalize w-28">{key}:</span>
                          <span className="text-sm">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific layout preferences</p>
                  )}
                  
                  <h3 className="text-base font-medium mt-4">Regional Patterns</h3>
                  {regionalPreferences.filter(p => p.category === 'layout').length > 0 ? (
                    <div className="grid gap-2">
                      {regionalPreferences
                        .filter(p => p.category === 'layout')
                        .map(pref => (
                          <div key={pref.id} className="border rounded p-3">
                            <h4 className="font-medium">{pref.preference_data.title || 'Layout Pattern'}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{pref.preference_data.description}</p>
                            {pref.source && (
                              <p className="text-xs text-muted-foreground mt-2">Source: {pref.source}</p>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No regional layout patterns available</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="typography" className="pt-4">
                <div className="grid gap-3">
                  <h3 className="text-base font-medium">Typography Adjustments</h3>
                  {currentContext.typography_adjustments ? (
                    <div className="bg-gray-50 p-3 rounded-md">
                      {Object.entries(currentContext.typography_adjustments).map(([key, value]) => (
                        <div key={key} className="mb-1 flex items-center">
                          <span className="text-sm font-medium capitalize w-28">{key.replace('_', ' ')}:</span>
                          <span className="text-sm">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific typography adjustments</p>
                  )}
                  
                  <h3 className="text-base font-medium mt-4">Sample Text</h3>
                  <div className="p-4 border rounded">
                    <h4 className="font-bold text-xl"
                      style={currentContext.typography_adjustments ? {
                        fontSize: currentContext.typography_adjustments.font_size_base || '16px',
                        lineHeight: currentContext.typography_adjustments.line_height || 1.5,
                      } : {}}
                    >
                      {currentContext.name} Typography Sample
                    </h4>
                    <p className="mt-2"
                      style={currentContext.typography_adjustments ? {
                        fontSize: currentContext.typography_adjustments.font_size_base || '16px',
                        lineHeight: currentContext.typography_adjustments.line_height || 1.5,
                      } : {}}
                    >
                      This is an example of how text would appear using the typography settings for this cultural context.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <AlertMessage type="info" className="my-4">No cultural context selected</AlertMessage>
        )}
      </CardContent>
    </Card>
  );
};

export default CulturalDesignAdapter;
