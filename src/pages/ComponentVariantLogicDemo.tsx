
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComponentVariantManager from '@/components/wireframe/variant/ComponentVariantManager';
import ConditionalLogicSystem, { ConditionalRule } from '@/components/wireframe/condition/ConditionalLogicSystem';
import { Plus, Settings, Check, AlertCircle, ArrowUpDown } from 'lucide-react';
import { WireframeComponent } from '@/types/wireframe-component';
import { useComponentVariantLogic } from '@/hooks/wireframe/use-component-variant-logic';

// Create an extended version of WireframeComponent for our demo
interface DemoComponent extends Omit<WireframeComponent, 'size'> {
  size: { width: number; height: number } | { width: string; height: string };
  styling?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    padding?: string;
    rounded?: boolean;
    shadow?: string;
  };
}

const ComponentVariantLogicDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('variants');
  const [activeComponent, setActiveComponent] = useState<DemoComponent>({
    id: 'demo-component',
    type: 'box',
    position: { x: 0, y: 0 },
    size: { width: 300, height: 200 },
    zIndex: 1,
    props: {
      text: 'Demo Component',
      showIcon: true,
      emphasis: 'medium'
    },
    visible: true,
    styling: {
      backgroundColor: '#f9fafb',
      borderColor: '#e5e7eb',
      textColor: '#1f2937',
      padding: '1rem',
      rounded: true,
      shadow: 'sm'
    }
  });

  const [variants, setVariants] = useState<Record<string, any>>({
    'default': {
      props: {
        text: 'Default Variant',
        showIcon: true,
        emphasis: 'medium'
      },
      styling: {
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
        textColor: '#1f2937'
      }
    },
    'primary': {
      props: {
        text: 'Primary Variant',
        showIcon: true,
        emphasis: 'high'
      },
      styling: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
        textColor: '#1e40af'
      }
    },
    'danger': {
      props: {
        text: 'Danger Variant',
        showIcon: true,
        emphasis: 'high'
      },
      styling: {
        backgroundColor: '#fef2f2',
        borderColor: '#ef4444',
        textColor: '#b91c1c'
      }
    }
  });

  const [rules, setRules] = useState<ConditionalRule[]>([
    {
      id: 'rule-1',
      name: 'Show Primary on Important',
      active: true,
      logicGroups: [
        {
          id: 'group-1',
          type: 'and',
          conditions: [
            {
              id: 'condition-1',
              field: 'props.emphasis',
              operator: 'equals',
              value: 'high'
            }
          ]
        }
      ],
      effect: {
        type: 'property',
        target: 'component',
        value: 'primary',
        property: 'componentVariant'
      }
    }
  ]);

  // Setup the condition logic hook
  const logic = useComponentVariantLogic(rules);

  // Update our local rules state when the hook's rules change
  useEffect(() => {
    setRules(logic.rules);
  }, [logic.rules]);

  // Handle variant selection change
  const handleVariantChange = (variantName: string) => {
    const newComponent = { ...activeComponent };
    const selectedVariant = variants[variantName];
    
    // Apply variant properties
    newComponent.componentVariant = variantName;
    
    if (selectedVariant.props) {
      newComponent.props = {
        ...newComponent.props,
        ...selectedVariant.props
      };
    }
    
    if (selectedVariant.styling) {
      newComponent.styling = {
        ...newComponent.styling,
        ...selectedVariant.styling
      };
    }
    
    setActiveComponent(newComponent);
  };

  // Handle property changes in the component
  const handlePropertyChange = (property: string, value: any) => {
    const path = property.split('.');
    const newComponent = { ...activeComponent };
    
    let current: any = newComponent;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!current[key]) current[key] = {};
      current = current[key];
    }
    
    current[path[path.length - 1]] = value;
    
    // Apply conditional logic effects
    const effects = logic.evaluateRules({
      ...newComponent,
      props: newComponent.props || {}
    });
    const updatedComponent = logic.applyEffects(effects, newComponent);
    
    setActiveComponent(updatedComponent as DemoComponent);
  };

  // Update conditional rules
  const handleRulesUpdate = (updatedRules: ConditionalRule[]) => {
    setRules(updatedRules);
    
    // Re-evaluate with the new rules
    const effects = logic.evaluateRules({
      ...activeComponent,
      props: activeComponent.props || {}
    });
    const updatedComponent = logic.applyEffects(effects, activeComponent);
    
    setActiveComponent(updatedComponent as DemoComponent);
  };

  // Demo component render based on current state
  const renderDemoComponent = () => {
    const { styling = {}, props = {} } = activeComponent;
    
    return (
      <div 
        className={`
          border p-4 mb-4
          ${styling.rounded ? 'rounded-lg' : ''}
          ${styling.shadow === 'sm' ? 'shadow-sm' : 
            styling.shadow === 'md' ? 'shadow-md' : 
            styling.shadow === 'lg' ? 'shadow-lg' : ''}
        `}
        style={{
          backgroundColor: styling.backgroundColor || '#fff',
          borderColor: styling.borderColor || '#e5e7eb',
          color: styling.textColor || '#000',
          padding: styling.padding || '1rem',
          width: typeof activeComponent.size.width === 'number' 
            ? `${activeComponent.size.width}px` 
            : activeComponent.size.width,
          height: typeof activeComponent.size.height === 'number'
            ? `${activeComponent.size.height}px`
            : activeComponent.size.height,
          display: activeComponent.visible ? 'block' : 'none'
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{props.text || 'Component'}</h3>
          {props.showIcon && (
            props.emphasis === 'high' ? (
              <AlertCircle className="h-5 w-5" />
            ) : props.emphasis === 'medium' ? (
              <ArrowUpDown className="h-5 w-5" />
            ) : (
              <Check className="h-5 w-5" />
            )
          )}
        </div>
        <div className="text-sm">
          <p>Current variant: <strong>{activeComponent.componentVariant || 'none'}</strong></p>
          <p>Emphasis level: <strong>{props.emphasis || 'low'}</strong></p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Component Variant & Logic System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="variants">
                Component Variants
              </TabsTrigger>
              <TabsTrigger value="conditions">
                Conditional Logic
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="variants">
              <ComponentVariantManager 
                variants={variants}
                onVariantsChange={setVariants}
              />
            </TabsContent>
            
            <TabsContent value="conditions">
              <ConditionalLogicSystem 
                rules={rules}
                onRulesChange={handleRulesUpdate}
                availableFields={[
                  'props.text',
                  'props.showIcon',
                  'props.emphasis',
                  'visible',
                  'componentVariant'
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Component Preview</span>
                <Select
                  value={activeComponent.componentVariant || 'default'}
                  onValueChange={handleVariantChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(variants).map(variant => (
                      <SelectItem key={variant} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderDemoComponent()}
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Properties</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="component-text">Text</Label>
                    <Input
                      id="component-text"
                      value={activeComponent.props?.text || ''}
                      onChange={(e) => handlePropertyChange('props.text', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-icon"
                      checked={!!activeComponent.props?.showIcon}
                      onCheckedChange={(checked) => handlePropertyChange('props.showIcon', checked)}
                    />
                    <Label htmlFor="show-icon">Show Icon</Label>
                  </div>
                  
                  <div>
                    <Label htmlFor="emphasis-level">Emphasis Level</Label>
                    <Select
                      value={activeComponent.props?.emphasis || 'low'}
                      onValueChange={(value) => handlePropertyChange('props.emphasis', value)}
                    >
                      <SelectTrigger id="emphasis-level">
                        <SelectValue placeholder="Select emphasis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="component-visible"
                      checked={activeComponent.visible}
                      onCheckedChange={(checked) => handlePropertyChange('visible', checked)}
                    />
                    <Label htmlFor="component-visible">Visible</Label>
                  </div>
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
