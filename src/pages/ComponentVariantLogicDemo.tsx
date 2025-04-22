
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Layers, Condition, Settings } from 'lucide-react';
import ComponentVariantManager from '@/components/wireframe/variant/ComponentVariantManager';
import ConditionalLogicSystem from '@/components/wireframe/condition/ConditionalLogicSystem';
import { useComponentVariantLogic } from '@/hooks/wireframe/use-component-variant-logic';
import { ComponentVariant } from '@/components/wireframe/registry/component-types';
import { ConditionalRule } from '@/components/wireframe/condition/ConditionalLogicSystem';
import { StatefulComponent } from '@/components/visual-states/StatefulComponent';

interface DemoComponent {
  id: string;
  type: string;
  label: string;
  description?: string;
  enabled: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: string;
  styling: {
    backgroundColor: string;
    textColor: string;
    borderRadius: string;
  };
}

const ComponentVariantLogicDemo = () => {
  // Sample demo component
  const [demoComponent, setDemoComponent] = useState<DemoComponent>({
    id: 'demo-button-1',
    type: 'button',
    label: 'Demo Button',
    description: 'A button used for demonstration purposes',
    enabled: true,
    size: 'md',
    variant: 'default',
    styling: {
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: '0.375rem'
    }
  });

  // Available properties for our demo component
  const availableProperties = [
    { id: 'enabled', name: 'Enabled', type: 'boolean' },
    { id: 'size', name: 'Size', type: 'string' },
    { id: 'label', name: 'Label', type: 'string' },
    { id: 'variant', name: 'Variant', type: 'string' },
    { id: 'styling.backgroundColor', name: 'Background Color', type: 'string' },
    { id: 'styling.textColor', name: 'Text Color', type: 'string' },
    { id: 'styling.borderRadius', name: 'Border Radius', type: 'string' }
  ];

  // Sample base properties
  const baseProperties = {
    label: 'Default Button',
    size: 'md',
    styling: {
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: '0.375rem'
    }
  };

  // Sample variants we'll start with
  const initialVariants: ComponentVariant[] = [
    {
      id: 'primary',
      name: 'Primary',
      description: 'Main call to action button',
      defaultData: {
        styling: {
          backgroundColor: '#3b82f6',
          textColor: '#ffffff'
        }
      }
    },
    {
      id: 'secondary',
      name: 'Secondary',
      description: 'Secondary action button',
      defaultData: {
        styling: {
          backgroundColor: '#475569',
          textColor: '#ffffff'
        }
      }
    },
    {
      id: 'danger',
      name: 'Danger',
      description: 'Destructive action button',
      defaultData: {
        styling: {
          backgroundColor: '#ef4444',
          textColor: '#ffffff'
        }
      }
    }
  ];

  // Sample rules we'll start with
  const initialRules: ConditionalRule[] = [
    {
      id: 'rule-1',
      name: 'Disable when variant is danger',
      enabled: true,
      conditions: [
        {
          id: 'condition-1',
          property: 'variant',
          operator: 'equals',
          value: 'danger'
        }
      ],
      logic: 'and',
      effect: {
        type: 'behavior',
        action: 'disable'
      }
    },
    {
      id: 'rule-2',
      name: 'Make larger when primary',
      enabled: true,
      conditions: [
        {
          id: 'condition-2',
          property: 'styling.backgroundColor',
          operator: 'equals',
          value: '#3b82f6'
        }
      ],
      logic: 'and',
      effect: {
        type: 'style',
        action: 'setStyle',
        value: 'transform: scale(1.1)'
      }
    }
  ];

  // Use our custom hook
  const {
    variants,
    rules,
    selectedVariantId,
    createVariant,
    updateVariant,
    deleteVariant,
    setSelectedVariantId,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    applyConditionalRules,
  } = useComponentVariantLogic({
    componentType: 'button',
    initialVariants,
    initialRules,
    baseProperties,
    onChange: (updates) => {
      console.log('Component variant or rules updated:', updates);
    }
  });

  // Apply selected variant to the demo component
  const applySelectedVariant = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;

    // Update component with variant data
    setDemoComponent(prev => ({
      ...prev,
      variant: variantId,
      ...(variant.defaultData || {})
    }));
  };

  // Helper function to get nested properties
  const getNestedProperty = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined;
    }, obj);
  };

  // Apply all rules to the component for preview
  const previewComponent = () => {
    const modifiedComponent = { ...demoComponent };

    for (const rule of rules) {
      if (!rule.enabled) continue;

      const ruleMatches = rule.conditions.every(condition => {
        const propValue = getNestedProperty(demoComponent, condition.property);
        
        switch (condition.operator) {
          case 'equals':
            return propValue === condition.value;
          case 'notEquals':
            return propValue !== condition.value;
          case 'contains':
            return String(propValue).includes(String(condition.value));
          default:
            return false;
        }
      });

      if (ruleMatches) {
        switch (rule.effect.type) {
          case 'visibility':
            // Not applying visibility in this demo
            break;
          case 'style':
            if (rule.effect.action === 'setStyle') {
              // Apply special styling
              console.log('Applying style:', rule.effect.value);
            }
            break;
          case 'behavior':
            if (rule.effect.action === 'disable') {
              modifiedComponent.enabled = false;
            } else if (rule.effect.action === 'enable') {
              modifiedComponent.enabled = true;
            }
            break;
        }
      }
    }

    return modifiedComponent;
  };

  // Preview with applied rules
  const previewedComponent = previewComponent();

  const getButtonClass = () => {
    let className = "px-4 py-2 rounded transition-all";
    
    // Apply size
    switch (previewedComponent.size) {
      case 'sm':
        className += " text-sm";
        break;
      case 'lg':
        className += " text-lg px-6 py-3";
        break;
    }
    
    // Apply disabled state
    if (!previewedComponent.enabled) {
      className += " opacity-50 cursor-not-allowed";
    }
    
    return className;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Component Variant & Logic Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="variants">
            <TabsList className="mb-4">
              <TabsTrigger value="variants">
                <Layers className="h-4 w-4 mr-2" />
                Variant Management
              </TabsTrigger>
              <TabsTrigger value="conditions">
                <Condition className="h-4 w-4 mr-2" />
                Conditional Logic
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Component Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="variants">
              <Card>
                <CardHeader>
                  <CardTitle>Component Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComponentVariantManager
                    componentType="button"
                    variants={variants}
                    baseProperties={baseProperties}
                    onVariantCreate={createVariant}
                    onVariantUpdate={updateVariant}
                    onVariantDelete={deleteVariant}
                    onVariantSelect={(id) => {
                      setSelectedVariantId(id);
                      applySelectedVariant(id);
                    }}
                    selectedVariantId={selectedVariantId}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="conditions">
              <Card>
                <CardHeader>
                  <CardTitle>Conditional Logic</CardTitle>
                </CardHeader>
                <CardContent>
                  <ConditionalLogicSystem
                    componentId={demoComponent.id}
                    rules={rules}
                    availableProperties={availableProperties}
                    onRuleCreate={createRule}
                    onRuleUpdate={updateRule}
                    onRuleDelete={deleteRule}
                    onRuleToggle={toggleRule}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Component Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        value={demoComponent.label}
                        onChange={(e) => setDemoComponent({
                          ...demoComponent,
                          label: e.target.value
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="enabled">Enabled</Label>
                      <div className="pt-2">
                        <input
                          type="checkbox"
                          id="enabled"
                          checked={demoComponent.enabled}
                          onChange={(e) => setDemoComponent({
                            ...demoComponent,
                            enabled: e.target.checked
                          })}
                          className="mr-2"
                        />
                        <Label htmlFor="enabled">
                          {demoComponent.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <select
                        id="size"
                        value={demoComponent.size}
                        onChange={(e) => setDemoComponent({
                          ...demoComponent,
                          size: e.target.value as 'sm' | 'md' | 'lg'
                        })}
                        className="w-full border rounded py-2 px-3"
                      >
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="bg-color">Background Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="bg-color"
                          type="color"
                          value={demoComponent.styling.backgroundColor}
                          onChange={(e) => setDemoComponent({
                            ...demoComponent,
                            styling: {
                              ...demoComponent.styling,
                              backgroundColor: e.target.value
                            }
                          })}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          value={demoComponent.styling.backgroundColor}
                          onChange={(e) => setDemoComponent({
                            ...demoComponent,
                            styling: {
                              ...demoComponent.styling,
                              backgroundColor: e.target.value
                            }
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={demoComponent.styling.textColor}
                          onChange={(e) => setDemoComponent({
                            ...demoComponent,
                            styling: {
                              ...demoComponent.styling,
                              textColor: e.target.value
                            }
                          })}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          value={demoComponent.styling.textColor}
                          onChange={(e) => setDemoComponent({
                            ...demoComponent,
                            styling: {
                              ...demoComponent.styling,
                              textColor: e.target.value
                            }
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="border-radius">Border Radius</Label>
                      <Input
                        id="border-radius"
                        value={demoComponent.styling.borderRadius}
                        onChange={(e) => setDemoComponent({
                          ...demoComponent,
                          styling: {
                            ...demoComponent.styling,
                            borderRadius: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="mb-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected Variant: <strong>{variants.find(v => v.id === selectedVariantId)?.name || 'None'}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Active Rules: <strong>{rules.filter(r => r.enabled).length}</strong>
                  </p>
                </div>
                
                <Button
                  className={getButtonClass()}
                  style={{
                    backgroundColor: previewedComponent.styling.backgroundColor,
                    color: previewedComponent.styling.textColor,
                    borderRadius: previewedComponent.styling.borderRadius,
                    transform: previewedComponent.variant === 'primary' ? 'scale(1.1)' : 'none'
                  }}
                  disabled={!previewedComponent.enabled}
                >
                  {previewedComponent.label}
                </Button>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-sm">Component States</h4>
                <div className="grid grid-cols-2 gap-4">
                  <StatefulComponent 
                    state="default"
                    variant="button" 
                    defaultStyles="bg-blue-500 text-white px-4 py-2 rounded"
                    hoverStyles="bg-blue-600"
                    activeStyles="bg-blue-700"
                    focusStyles="ring-2 ring-blue-300 ring-offset-2"
                    disabledStyles="opacity-50 cursor-not-allowed"
                  >
                    Default
                  </StatefulComponent>
                  
                  <StatefulComponent 
                    state="hover"
                    variant="button" 
                    defaultStyles="bg-blue-500 text-white px-4 py-2 rounded"
                    hoverStyles="bg-blue-600"
                    activeStyles="bg-blue-700"
                    focusStyles="ring-2 ring-blue-300 ring-offset-2"
                    disabledStyles="opacity-50 cursor-not-allowed"
                  >
                    Hover
                  </StatefulComponent>
                  
                  <StatefulComponent 
                    state="active"
                    variant="button" 
                    defaultStyles="bg-blue-500 text-white px-4 py-2 rounded"
                    hoverStyles="bg-blue-600"
                    activeStyles="bg-blue-700"
                    focusStyles="ring-2 ring-blue-300 ring-offset-2"
                    disabledStyles="opacity-50 cursor-not-allowed"
                  >
                    Active
                  </StatefulComponent>
                  
                  <StatefulComponent 
                    state="disabled"
                    variant="button" 
                    defaultStyles="bg-blue-500 text-white px-4 py-2 rounded"
                    hoverStyles="bg-blue-600"
                    activeStyles="bg-blue-700"
                    focusStyles="ring-2 ring-blue-300 ring-offset-2"
                    disabledStyles="opacity-50 cursor-not-allowed"
                  >
                    Disabled
                  </StatefulComponent>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComponentVariantLogicDemo;
