
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoCircle } from "@/components/ui/icons";
import { VisualPicker, DesignOption } from "@/components/design/AnimatedVisualPicker";

// Sample design style options
const DESIGN_STYLES = [
  { id: 'minimal', title: 'Minimal', description: 'Clean, simple, and uncluttered', imageUrl: '/design-styles/minimal.jpg', category: 'style' },
  { id: 'modern', title: 'Modern', description: 'Contemporary and cutting-edge', imageUrl: '/design-styles/modern.jpg', category: 'style' },
  { id: 'bold', title: 'Bold', description: 'Strong, vibrant, and impactful', imageUrl: '/design-styles/bold.jpg', category: 'style' },
  { id: 'playful', title: 'Playful', description: 'Fun, energetic, and approachable', imageUrl: '/design-styles/playful.jpg', category: 'style' },
  { id: 'classic', title: 'Classic', description: 'Timeless, traditional, and elegant', imageUrl: '/design-styles/classic.jpg', category: 'style' },
  { id: 'corporate', title: 'Corporate', description: 'Professional, trustworthy, and established', imageUrl: '/design-styles/corporate.jpg', category: 'style' },
];

// Sample color scheme options
const COLOR_SCHEMES = [
  { id: 'blue', title: 'Blue Professional', description: 'Trustworthy and calm', imageUrl: '/color-schemes/blue.jpg', category: 'color' },
  { id: 'green', title: 'Green Natural', description: 'Fresh and growth-oriented', imageUrl: '/color-schemes/green.jpg', category: 'color' },
  { id: 'purple', title: 'Purple Creative', description: 'Imaginative and luxurious', imageUrl: '/color-schemes/purple.jpg', category: 'color' },
  { id: 'red', title: 'Red Energetic', description: 'Bold and passionate', imageUrl: '/color-schemes/red.jpg', category: 'color' },
  { id: 'neutral', title: 'Neutral Versatile', description: 'Balanced and timeless', imageUrl: '/color-schemes/neutral.jpg', category: 'color' },
];

interface DesignPreferencesFieldsProps {
  form: UseFormReturn<any>;
  showTooltips?: boolean;
  aiPowered?: boolean;
}

const DesignPreferencesFields = ({ 
  form, 
  showTooltips = false, 
  aiPowered = false 
}: DesignPreferencesFieldsProps) => {
  const [activeTab, setActiveTab] = useState("styles");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedColorScheme, setSelectedColorScheme] = useState<string | null>(null);

  const handleStyleSelection = (styleId: string) => {
    setSelectedStyle(styleId);
    form.setValue("designStyle", styleId);
  };

  const handleColorSchemeSelection = (schemeId: string) => {
    setSelectedColorScheme(schemeId);
    form.setValue("colorPreferences", schemeId);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="styles">Design Style</TabsTrigger>
          <TabsTrigger value="colors">Color Schemes</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="styles" className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Select a Design Style</h3>
            <p className="text-sm text-muted-foreground">
              The overall design style will influence how your website looks and feels.
            </p>
          </div>
          
          <VisualPicker
            options={DESIGN_STYLES}
            selectedId={selectedStyle || form.watch("designStyle")}
            onSelect={handleStyleSelection}
            fullWidth
          />
          
          <FormField
            control={form.control}
            name="designNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Design Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any specific requirements or preferences for your design?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Select a Color Scheme</h3>
            <p className="text-sm text-muted-foreground">
              Your color scheme will set the mood and tone of your website.
            </p>
          </div>
          
          <VisualPicker
            options={COLOR_SCHEMES}
            selectedId={selectedColorScheme || form.watch("colorPreferences")}
            onSelect={handleColorSchemeSelection}
            fullWidth
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color (optional)</FormLabel>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 h-9 p-1" {...field} />
                    <Input 
                      type="text" 
                      placeholder="#HEX" 
                      value={field.value || ''} 
                      onChange={field.onChange}
                      className="flex-1"
                    />
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color (optional)</FormLabel>
                  <div className="flex gap-2">
                    <Input type="color" className="w-12 h-9 p-1" {...field} />
                    <Input 
                      type="text" 
                      placeholder="#HEX" 
                      value={field.value || ''} 
                      onChange={field.onChange}
                      className="flex-1"
                    />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Typography Preferences</h3>
            <p className="text-sm text-muted-foreground">
              Select font styles that match your brand personality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fontStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Style</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="modern">Modern Sans-serif</SelectItem>
                      <SelectItem value="classic">Classic Serif</SelectItem>
                      <SelectItem value="playful">Playful Display</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="technical">Technical Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="typographyScale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typography Scale</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scale preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="generous">Generous</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="border-t pt-4">
        <FormField
          control={form.control}
          name="conversionPriority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conversion Priority</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What's most important to you?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="aesthetics">Visual appeal and brand consistency</SelectItem>
                  <SelectItem value="conversions">Maximizing conversion rates</SelectItem>
                  <SelectItem value="usability">User experience and usability</SelectItem>
                  <SelectItem value="accessibility">Accessibility and inclusivity</SelectItem>
                  <SelectItem value="balance">Balanced approach</SelectItem>
                </SelectContent>
              </Select>
              {showTooltips && (
                <FormDescription>
                  This helps us prioritize design decisions based on your business goals.
                </FormDescription>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DesignPreferencesFields;
