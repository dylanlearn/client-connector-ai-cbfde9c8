
import React, { useState } from 'react';
import { WireframeTypography } from '@/services/ai/wireframe/wireframe-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface TypographyControlsProps {
  typography: WireframeTypography;
  onChange: (updates: Partial<WireframeTypography>) => void;
  fontFamilies: string[];
  lineHeights: { label: string; value: string }[];
  fontWeights: { label: string; value: string }[];
}

/**
 * Typography Controls - UI for managing typography settings
 */
export const TypographyControls: React.FC<TypographyControlsProps> = ({
  typography,
  onChange,
  fontFamilies,
  lineHeights,
  fontWeights,
}) => {
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [customFontUrl, setCustomFontUrl] = useState<string>('');

  const handleFontFamilyChange = (
    key: keyof WireframeTypography,
    value: string
  ) => {
    onChange({
      ...typography,
      [key]: value,
    });
  };

  const handleAddCustomFont = () => {
    if (!customFontUrl) return;
    
    // In a real implementation, we would validate and process the font URL
    // For now, we'll just show an alert
    alert(`Custom font URL ${customFontUrl} would be added to the system`);
    setCustomFontUrl('');
  };

  return (
    <div className="typography-controls space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Typography Settings</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="advanced-mode" className="text-sm">
            Advanced Mode
          </Label>
          <Switch
            id="advanced-mode"
            checked={advancedMode}
            onCheckedChange={setAdvancedMode}
          />
        </div>
      </div>

      <Tabs defaultValue="fonts" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="fonts">Fonts</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="fonts" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headings-font">Headings Font</Label>
              <Select
                value={typography.headings || 'Inter'}
                onValueChange={(value) => handleFontFamilyChange('headings', value)}
              >
                <SelectTrigger id="headings-font">
                  <SelectValue placeholder="Select heading font" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div
                className="mt-2 p-3 border rounded bg-muted/20"
                style={{ fontFamily: typography.headings }}
              >
                <span className="text-xl font-bold">
                  This is a heading preview
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body-font">Body Font</Label>
              <Select
                value={typography.body || 'Inter'}
                onValueChange={(value) => handleFontFamilyChange('body', value)}
              >
                <SelectTrigger id="body-font">
                  <SelectValue placeholder="Select body font" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div
                className="mt-2 p-3 border rounded bg-muted/20"
                style={{ fontFamily: typography.body }}
              >
                <span>
                  This is a paragraph text preview. It shows how body text will
                  appear.
                </span>
              </div>
            </div>
          </div>

          {advancedMode && (
            <Accordion type="single" collapsible className="mt-6 w-full">
              <AccordionItem value="custom-font">
                <AccordionTrigger>Add Custom Font</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="custom-font-url">
                        Font URL (Google Fonts or CSS)
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="custom-font-url"
                          value={customFontUrl}
                          onChange={(e) => setCustomFontUrl(e.target.value)}
                          placeholder="https://fonts.googleapis.com/css2?family=..."
                          className="flex-1"
                        />
                        <Button
                          onClick={handleAddCustomFont}
                          disabled={!customFontUrl}
                        >
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter a Google Fonts URL or a CSS @import URL
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {advancedMode && (
            <>
              <div className="space-y-2">
                <Label htmlFor="base-font-size">Base Font Size (px)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="base-font-size"
                    min={12}
                    max={20}
                    step={1}
                    defaultValue={[16]}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8 text-right">16</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scale-ratio">Scale Ratio</Label>
                <Select defaultValue="1.250">
                  <SelectTrigger id="scale-ratio">
                    <SelectValue placeholder="Select scale ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.200">
                      Minor Third (1.200)
                    </SelectItem>
                    <SelectItem value="1.250">
                      Major Third (1.250)
                    </SelectItem>
                    <SelectItem value="1.333">
                      Perfect Fourth (1.333)
                    </SelectItem>
                    <SelectItem value="1.414">
                      Augmented Fourth (1.414)
                    </SelectItem>
                    <SelectItem value="1.500">
                      Perfect Fifth (1.500)
                    </SelectItem>
                    <SelectItem value="1.618">
                      Golden Ratio (1.618)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading-line-height">Heading Line Height</Label>
                <Select defaultValue="1.2">
                  <SelectTrigger id="heading-line-height">
                    <SelectValue placeholder="Select heading line height" />
                  </SelectTrigger>
                  <SelectContent>
                    {lineHeights.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body-line-height">Body Line Height</Label>
                <Select defaultValue="1.5">
                  <SelectTrigger id="body-line-height">
                    <SelectValue placeholder="Select body line height" />
                  </SelectTrigger>
                  <SelectContent>
                    {lineHeights.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="pt-4 border-t mt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Font Pairing Recommendation
            </h3>
            <div className="p-3 border rounded bg-primary/5">
              <p className="text-sm">
                The current combination of <strong style={{ fontFamily: typography.headings }}>{typography.headings}</strong> for headings and <strong style={{ fontFamily: typography.body }}>{typography.body}</strong> for body text creates a {typography.headings === typography.body ? "consistent" : "complementary"} typographic system.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
