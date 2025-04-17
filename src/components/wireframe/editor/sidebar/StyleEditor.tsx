import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeColorScheme, WireframeTypography } from '@/services/ai/wireframe/wireframe-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorManagementSystem from '../../ColorManagementSystem';
import { Switch } from '@/components/ui/switch';
import ColorSchemeSelector from '../../ColorSchemeSelector';

interface StyleEditorProps {
  colorScheme?: WireframeColorScheme;
  typography?: WireframeTypography;
  onChange: (updates: Partial<{
    colorScheme: WireframeColorScheme;
    typography: WireframeTypography;
  }>) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ 
  colorScheme, 
  typography, 
  onChange 
}) => {
  const [advancedMode, setAdvancedMode] = useState(false);
  
  const handleColorChange = (newColorScheme: WireframeColorScheme) => {
    onChange({ colorScheme: newColorScheme });
  };

  const handleTypographyChange = (key: keyof WireframeTypography, value: string) => {
    onChange({ 
      typography: { 
        ...typography, 
        [key]: value 
      } 
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="space-y-4 px-0">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Style Configuration</Label>
          <div className="flex items-center space-x-2">
            <Label htmlFor="advanced-mode" className="text-sm">Advanced</Label>
            <Switch
              id="advanced-mode"
              checked={advancedMode}
              onCheckedChange={setAdvancedMode}
            />
          </div>
        </div>

        <Tabs defaultValue="colors">
          <TabsList className="w-full">
            <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
            <TabsTrigger value="typography" className="flex-1">Typography</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4 mt-4">
            {advancedMode ? (
              <ColorManagementSystem
                initialColorScheme={colorScheme}
                onChange={handleColorChange}
              />
            ) : (
              <div className="space-y-4">
                <Label>Color Scheme</Label>
                <div className="bg-card p-4 rounded-lg border">
                  <ColorSchemeSelector
                    colorScheme={colorScheme}
                    onChange={handleColorChange}
                    showSaveControls
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Label>Typography</Label>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headings-font">Headings</Label>
                  <Select 
                    value={typography?.headings || 'Inter'}
                    onValueChange={(value) => handleTypographyChange('headings', value)}
                  >
                    <SelectTrigger id="headings-font">
                      <SelectValue placeholder="Headings Font" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Inter', 'Raleway', 'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display', 'Merriweather'].map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="body-font">Body</Label>
                  <Select 
                    value={typography?.body || 'Inter'}
                    onValueChange={(value) => handleTypographyChange('body', value)}
                  >
                    <SelectTrigger id="body-font">
                      <SelectValue placeholder="Body Font" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Inter', 'Raleway', 'Roboto', 'Open Sans', 'Montserrat', 'Source Sans Pro', 'Lato'].map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {advancedMode && (
                  <div className="p-4 border rounded-lg mt-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium" style={{ fontFamily: typography?.headings }}>
                          Heading Preview
                        </h3>
                        <h4 className="text-md" style={{ fontFamily: typography?.headings }}>
                          Secondary Heading
                        </h4>
                      </div>
                      <div>
                        <p style={{ fontFamily: typography?.body }}>
                          This is a preview of your body text. The quick brown fox jumps over the lazy dog.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StyleEditor;
