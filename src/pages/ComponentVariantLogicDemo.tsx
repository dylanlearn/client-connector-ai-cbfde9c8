
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Layout, Layers, Settings } from 'lucide-react';
import ComponentVariantManager, { ComponentVariant } from '@/components/wireframe/variant/ComponentVariantManager';
import ConditionalLogicSystem, { ConditionalRule } from '@/components/wireframe/condition/ConditionalLogicSystem';
import { WireframeComponent } from '@/types/wireframe-component';

type ComponentSize = 'sm' | 'md' | 'lg';

// Extended WireframeComponent for demo purposes
interface DemoComponent extends WireframeComponent {
  size: ComponentSize;
  style?: Record<string, any>;
}

const ComponentVariantLogicDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState("variants");
  const [variants, setVariants] = useState<ComponentVariant[]>([
    {
      id: 'base-variant',
      name: 'Default',
      description: 'Default component styling',
      properties: [
        { id: 'prop-1', name: 'backgroundColor', value: '#f3f4f6', type: 'color', isOverride: true },
        { id: 'prop-2', name: 'textColor', value: '#111827', type: 'color', isOverride: true },
        { id: 'prop-3', name: 'borderRadius', value: '8', type: 'number', isOverride: true },
        { id: 'prop-4', name: 'showIcon', value: true, type: 'boolean', isOverride: true },
      ],
      isBase: true
    },
    {
      id: 'variant-2',
      name: 'Primary',
      description: 'Primary action styling',
      properties: [
        { id: 'prop-5', name: 'backgroundColor', value: '#2563eb', type: 'color', isOverride: true },
        { id: 'prop-6', name: 'textColor', value: '#ffffff', type: 'color', isOverride: true },
      ],
      baseComponentId: 'base-variant'
    },
    {
      id: 'variant-3',
      name: 'Danger',
      description: 'Destructive action styling',
      properties: [
        { id: 'prop-7', name: 'backgroundColor', value: '#ef4444', type: 'color', isOverride: true },
        { id: 'prop-8', name: 'textColor', value: '#ffffff', type: 'color', isOverride: true },
      ],
      baseComponentId: 'base-variant'
    }
  ]);
  
  const [rules, setRules] = useState<ConditionalRule[]>([
    {
      id: 'rule-1',
      name: 'Show icon based on size',
      logicGroups: [
        {
          id: 'group-1',
          type: 'or',
          conditions: [
            { id: 'condition-1', field: 'size', operator: 'equals', value: 'md' },
            { id: 'condition-2', field: 'size', operator: 'equals', value: 'lg' }
          ]
        }
      ],
      action: {
        type: 'property',
        target: 'button',
        property: 'showIcon',
        value: true
      },
      enabled: true
    },
    {
      id: 'rule-2',
      name: 'Use Primary variant for large buttons',
      logicGroups: [
        {
          id: 'group-2',
          type: 'and',
          conditions: [
            { id: 'condition-3', field: 'size', operator: 'equals', value: 'lg' }
          ]
        }
      ],
      action: {
        type: 'property',
        target: 'button',
        property: 'variant',
        value: 'Primary'
      },
      enabled: true
    }
  ]);
  
  const [demoComponent, setDemoComponent] = useState<DemoComponent>({
    id: 'demo-button',
    type: 'button',
    position: { x: 0, y: 0 },
    size: 'md',
    zIndex: 1,
    style: {
      backgroundColor: '#f3f4f6',
      color: '#111827',
      borderRadius: '8px',
      padding: '12px 24px',
      font: 'inherit',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    }
  });
  
  const [activeVariant, setActiveVariant] = useState<string>('base-variant');
  const [showIcon, setShowIcon] = useState<boolean>(false);
  
  // Apply conditional rules to the component
  useEffect(() => {
    if (!demoComponent) return;
    
    const enabledRules = rules.filter(rule => rule.enabled);
    
    // Start with default properties from the base variant
    const baseVariant = variants.find(v => v.isBase);
    let appliedVariant = baseVariant;
    let updatedShowIcon = baseVariant?.properties.find(p => p.name === 'showIcon')?.value || false;
    
    // Apply all matching rules
    for (const rule of enabledRules) {
      const matches = evaluateRule(rule, demoComponent);
      
      if (matches) {
        if (rule.action.type === 'property') {
          if (rule.action.property === 'variant') {
            // Apply a different variant
            const variantToApply = variants.find(v => v.name === rule.action.value);
            if (variantToApply) {
              appliedVariant = variantToApply;
            }
          } else if (rule.action.property === 'showIcon') {
            updatedShowIcon = Boolean(rule.action.value);
          }
        }
      }
    }
    
    setActiveVariant(appliedVariant?.id || 'base-variant');
    setShowIcon(updatedShowIcon);
    
    // Update component style based on variant properties
    if (appliedVariant) {
      setDemoComponent(prev => {
        const updatedStyle = { ...prev.style };
        
        appliedVariant?.properties.forEach(prop => {
          if (prop.name === 'backgroundColor') {
            updatedStyle.backgroundColor = prop.value;
          } else if (prop.name === 'textColor') {
            updatedStyle.color = prop.value;
          } else if (prop.name === 'borderRadius') {
            updatedStyle.borderRadius = `${prop.value}px`;
          }
        });
        
        return {
          ...prev,
          style: updatedStyle
        };
      });
    }
  }, [demoComponent.size, rules, variants]);
  
  const evaluateRule = (rule: ConditionalRule, component: DemoComponent): boolean => {
    // If any logic group matches, the rule matches
    return rule.logicGroups.some(group => {
      if (group.type === 'and') {
        // All conditions must match
        return group.conditions.every(condition => evaluateCondition(condition, component));
      } else {
        // At least one condition must match
        return group.conditions.some(condition => evaluateCondition(condition, component));
      }
    });
  };
  
  const evaluateCondition = (
    condition: { field: string; operator: string; value: any; },
    component: DemoComponent
  ): boolean => {
    const componentValue = component[condition.field as keyof DemoComponent];
    
    switch (condition.operator) {
      case 'equals':
        return componentValue === condition.value;
      case 'notEquals':
        return componentValue !== condition.value;
      case 'contains':
        return String(componentValue).includes(String(condition.value));
      case 'greaterThan':
        return Number(componentValue) > Number(condition.value);
      case 'lessThan':
        return Number(componentValue) < Number(condition.value);
      case 'isEmpty':
        return !componentValue || (Array.isArray(componentValue) && componentValue.length === 0);
      case 'isNotEmpty':
        return !!componentValue && (!Array.isArray(componentValue) || componentValue.length > 0);
      default:
        return false;
    }
  };
  
  const handleSizeChange = (size: ComponentSize) => {
    setDemoComponent(prev => ({
      ...prev,
      size
    }));
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Component Variant & Logic System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="variants" className="flex-1">
                <Layers className="w-4 h-4 mr-2" /> Component Variants
              </TabsTrigger>
              <TabsTrigger value="logic" className="flex-1">
                <Layout className="w-4 h-4 mr-2" /> Conditional Logic
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="w-4 h-4 mr-2" /> Component Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="variants" className="pt-6">
              <ComponentVariantManager
                components={[]}
                variants={variants}
                activeVariantId={activeVariant}
                onVariantCreate={(variant) => setVariants([...variants, variant])}
                onVariantUpdate={(updatedVariant) => {
                  setVariants(variants.map(v => v.id === updatedVariant.id ? updatedVariant : v));
                }}
                onVariantDelete={(variantId) => {
                  setVariants(variants.filter(v => v.id !== variantId));
                }}
                onVariantSelect={setActiveVariant}
              />
            </TabsContent>
            
            <TabsContent value="logic" className="pt-6">
              <ConditionalLogicSystem
                rules={rules}
                onRuleChange={setRules}
                availableFields={['size', 'type', 'position', 'zIndex']}
                availableTargets={['button', 'container', 'text', 'image']}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Component Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Size</h3>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleSizeChange('sm')}
                          variant={demoComponent.size === 'sm' ? "default" : "outline"}
                          size="sm"
                        >
                          Small
                        </Button>
                        <Button
                          onClick={() => handleSizeChange('md')}
                          variant={demoComponent.size === 'md' ? "default" : "outline"}
                          size="sm"
                        >
                          Medium
                        </Button>
                        <Button
                          onClick={() => handleSizeChange('lg')}
                          variant={demoComponent.size === 'lg' ? "default" : "outline"}
                          size="sm"
                        >
                          Large
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="p-8 border rounded-lg flex items-center justify-center">
                  <button
                    style={{
                      ...demoComponent.style,
                      padding: demoComponent.size === 'sm' ? '8px 16px' : 
                              demoComponent.size === 'md' ? '12px 24px' : '16px 32px',
                      fontSize: demoComponent.size === 'sm' ? '0.875rem' : 
                               demoComponent.size === 'md' ? '1rem' : '1.125rem',
                    }}
                  >
                    {showIcon && <Check className="mr-2 h-4 w-4" />}
                    Demo Button
                  </button>
                </div>
                
                <Card className="w-full">
                  <CardContent className="pt-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Size:</span>
                        <span className="font-medium capitalize">{demoComponent.size}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Variant:</span>
                        <span className="font-medium">{variants.find(v => v.id === activeVariant)?.name}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Show Icon:</span>
                        <span className="font-medium">{showIcon ? 'Yes' : 'No'}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Background:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: demoComponent.style?.backgroundColor }}
                          />
                          <span>{demoComponent.style?.backgroundColor}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-sm text-muted-foreground text-center">
                  <p>Try changing the size to see how conditional logic affects the component.</p>
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
