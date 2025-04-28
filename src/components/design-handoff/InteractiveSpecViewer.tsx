
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Box, Layers, MousePointer2, Toggle, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface InteractiveSpecViewerProps {
  wireframeId: string;
  specificationId?: string;
}

export const InteractiveSpecViewer: React.FC<InteractiveSpecViewerProps> = ({ 
  wireframeId, 
  specificationId 
}) => {
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('default');
  const [selectedVariant, setSelectedVariant] = useState<string>('default');

  // Fetch wireframe data with sections
  const { data: wireframe } = useQuery({
    queryKey: ['wireframeData', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wireframes')
        .select('data, title')
        .eq('id', wireframeId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!wireframeId
  });

  // Get component specifications based on selected component
  const { data: componentSpec } = useQuery({
    queryKey: ['componentSpec', wireframeId, selectedSection, selectedComponent],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_specifications')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .eq('section_id', selectedSection)
        .eq('component_id', selectedComponent)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!wireframeId && !!selectedSection && !!selectedComponent
  });
  
  // Get component states
  const { data: componentStates } = useQuery({
    queryKey: ['componentStates', wireframeId, selectedSection, selectedComponent],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_states')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .eq('section_id', selectedSection)
        .eq('component_id', selectedComponent);

      if (error) throw error;
      return data || [];
    },
    enabled: !!wireframeId && !!selectedSection && !!selectedComponent
  });
  
  // Get component variants
  const { data: componentVariants } = useQuery({
    queryKey: ['componentVariants', wireframeId, selectedSection, selectedComponent],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_variants')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .eq('section_id', selectedSection)
        .eq('component_id', selectedComponent);

      if (error) throw error;
      return data || [];
    },
    enabled: !!wireframeId && !!selectedSection && !!selectedComponent
  });

  const sections = wireframe?.data?.sections || [];
  
  // Find the currently selected section
  const currentSection = sections.find((s: any) => s.id === selectedSection);
  
  // Find the currently selected component
  const currentComponent = currentSection?.components?.find((c: any) => c.id === selectedComponent) || null;
  
  // Get the current component state data
  const currentState = componentStates?.find((s: any) => s.state_name === selectedState)?.state_data || currentComponent?.props || {};
  
  // Get the current component variant data
  const currentVariant = componentVariants?.find((v: any) => v.variant_name === selectedVariant)?.variant_data || {};
  
  // Combine state and variant data for display
  const displayData = { ...currentComponent, ...currentState, ...currentVariant };

  // Convert component properties to form controls
  const renderPropertyControl = (key: string, value: any) => {
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center justify-between">
          <Label htmlFor={key}>{key}</Label>
          <Switch id={key} checked={value} />
        </div>
      );
    } else if (typeof value === 'number') {
      if (key.includes('opacity') || (value >= 0 && value <= 1)) {
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={key}>{key}</Label>
              <span className="text-sm">{value}</span>
            </div>
            <Slider
              id={key}
              defaultValue={[value * 100]}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            <Input id={key} type="number" value={value} />
          </div>
        );
      }
    } else if (typeof value === 'string') {
      if (value.startsWith('#') || /^rgba?\(/.test(value)) {
        // Color input
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={key}>{key}</Label>
              <div className="h-5 w-5 rounded border" style={{ backgroundColor: value }}></div>
            </div>
            <Input id={key} type="text" value={value} />
          </div>
        );
      } else if (['small', 'medium', 'large', 'xl'].includes(value) || 
                ['primary', 'secondary', 'success', 'error'].includes(value)) {
        // Enum-like values
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            <Select defaultValue={value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={value}>{value}</SelectItem>
                {/* Mock options, would be dynamic in real implementation */}
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      } else {
        // Regular text input
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            <Input id={key} value={value} />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="h-5 w-5 mr-2" />
          Interactive Specification Viewer
        </CardTitle>
        <CardDescription>
          Explore component properties, states, and variations interactively
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-4 gap-6">
          {/* Left sidebar: Component selection */}
          <div className="space-y-6 border-r pr-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Sections</h3>
              <div className="space-y-1">
                {sections.map((section: any) => (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setSelectedSection(section.id);
                      setSelectedComponent(null);
                    }}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    {section.name || section.sectionType}
                  </Button>
                ))}
              </div>
            </div>
            
            {selectedSection && currentSection?.components && (
              <div>
                <Separator className="my-4" />
                <h3 className="text-sm font-medium mb-2">Components</h3>
                <div className="space-y-1">
                  {currentSection.components.map((component: any) => (
                    <Button
                      key={component.id}
                      variant={selectedComponent === component.id ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedComponent(component.id)}
                    >
                      <Box className="h-4 w-4 mr-2" />
                      {component.name || component.type}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Main content */}
          <div className="col-span-3">
            {!selectedComponent ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 border border-dashed rounded-md">
                <MousePointer2 className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600">Select a Component</h3>
                <p className="text-gray-500">Choose a component to view its specifications</p>
              </div>
            ) : (
              <Tabs defaultValue="properties">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="states">States</TabsTrigger>
                    <TabsTrigger value="variants">Variants</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center space-x-4">
                    {componentStates && componentStates.length > 0 && (
                      <Select 
                        value={selectedState} 
                        onValueChange={setSelectedState}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          {componentStates.map((state: any) => (
                            <SelectItem key={state.id} value={state.state_name}>
                              {state.state_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {componentVariants && componentVariants.length > 0 && (
                      <Select 
                        value={selectedVariant} 
                        onValueChange={setSelectedVariant}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Variant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          {componentVariants.map((variant: any) => (
                            <SelectItem key={variant.id} value={variant.variant_name}>
                              {variant.variant_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                
                <TabsContent value="properties" className="space-y-4">
                  <div className="p-4 border rounded-md bg-slate-50">
                    <h3 className="text-lg font-medium mb-3">
                      {currentComponent?.name || currentComponent?.type}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {componentSpec?.description || "No description available"}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {currentComponent && Object.entries(currentComponent.props || {})
                        .filter(([key]) => !['children', 'className', 'style'].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            {renderPropertyControl(key, value)}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  {/* Preview area */}
                  <div className="h-64 border rounded-md p-4 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Component Preview</p>
                      <p className="text-xs text-gray-400">
                        (In a complete implementation, this would render the actual component)
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="states" className="space-y-4">
                  {componentStates && componentStates.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {componentStates.map((state: any) => (
                        <Button
                          key={state.id}
                          variant="outline"
                          className={`h-32 justify-start items-start p-4 text-left ${
                            selectedState === state.state_name ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedState(state.state_name)}
                        >
                          <div>
                            <h3 className="font-medium">{state.state_name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{state.description || 'No description'}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border border-dashed rounded-md">
                      <Toggle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-600">No States Available</h3>
                      <p className="text-gray-500">This component has no defined states</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="variants" className="space-y-4">
                  {componentVariants && componentVariants.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {componentVariants.map((variant: any) => (
                        <Button
                          key={variant.id}
                          variant="outline"
                          className={`h-32 justify-start items-start p-4 text-left ${
                            selectedVariant === variant.variant_name ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedVariant(variant.variant_name)}
                        >
                          <div>
                            <h3 className="font-medium">{variant.variant_name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {variant.description || 'No description'}
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 border border-dashed rounded-md">
                      <Layers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-600">No Variants Available</h3>
                      <p className="text-gray-500">This component has no defined variants</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <Tabs defaultValue="react">
                    <TabsList className="w-full">
                      <TabsTrigger value="react">React</TabsTrigger>
                      <TabsTrigger value="vue">Vue</TabsTrigger>
                      <TabsTrigger value="angular">Angular</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="react" className="mt-4">
                      <div className="relative">
                        <pre className="p-4 bg-slate-900 text-slate-50 rounded-md overflow-x-auto text-sm">
                          {`import React from 'react';
import { ${currentComponent?.type} } from '@/components/ui/${currentComponent?.type.toLowerCase()}';

export const ${currentComponent?.type}Example = () => {
  return (
    <${currentComponent?.type}
      ${Object.entries(displayData?.props || {})
        .filter(([key]) => !['children'].includes(key))
        .map(([key, value]) => `${key}={${JSON.stringify(value)}}`).join('\n      ')}
    >
      ${displayData?.props?.children || ''}
    </${currentComponent?.type}>
  );
};`}
                        </pre>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="absolute top-2 right-2"
                          onClick={() => {
                            // Copy code to clipboard
                            toast({
                              title: "Copied to clipboard",
                              description: "Code has been copied to clipboard"
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="vue" className="mt-4">
                      <div className="relative">
                        <pre className="p-4 bg-slate-900 text-slate-50 rounded-md overflow-x-auto text-sm">
                          {`<template>
  <${currentComponent?.type.toLowerCase()}
    ${Object.entries(displayData?.props || {})
      .filter(([key]) => !['children'].includes(key))
      .map(([key, value]) => `:${key}="${JSON.stringify(value)}"`).join('\n    ')}
  >
    ${displayData?.props?.children || ''}
  </${currentComponent?.type.toLowerCase()}>
</template>

<script>
import { ${currentComponent?.type} } from '@/components/${currentComponent?.type.toLowerCase()}';

export default {
  components: {
    ${currentComponent?.type}
  }
}
</script>`}
                        </pre>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="absolute top-2 right-2"
                          onClick={() => {
                            // Copy code to clipboard
                            toast({
                              title: "Copied to clipboard",
                              description: "Code has been copied to clipboard"
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="angular" className="mt-4">
                      <div className="relative">
                        <pre className="p-4 bg-slate-900 text-slate-50 rounded-md overflow-x-auto text-sm">
                          {`<app-${currentComponent?.type.toLowerCase()}
  ${Object.entries(displayData?.props || {})
    .filter(([key]) => !['children'].includes(key))
    .map(([key, value]) => `[${key}]="${JSON.stringify(value)}"`).join('\n  ')}
>
  ${displayData?.props?.children || ''}
</app-${currentComponent?.type.toLowerCase()}>`}
                        </pre>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="absolute top-2 right-2"
                          onClick={() => {
                            // Copy code to clipboard
                            toast({
                              title: "Copied to clipboard",
                              description: "Code has been copied to clipboard"
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
