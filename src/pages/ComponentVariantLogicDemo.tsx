
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, ArrowRight, Sliders, Tag } from 'lucide-react';
import { 
  ConditionalRule, 
  LogicGroup 
} from '@/components/wireframe/condition/ConditionalLogicSystem';
import { WireframeComponent } from '@/types/wireframe-component';
import { useComponentVariantLogic } from '@/hooks/wireframe/use-component-variant-logic';

// Extended component type for demo purposes
interface DemoComponent extends Omit<WireframeComponent, 'size'> {
  size: { width: number; height: number } | string; // Allow string sizes for demo
  styling?: Record<string, any>; // Add styling property
  variants?: ComponentVariant[]; // Add variants property
  activeVariant?: string;
}

interface ComponentVariant {
  id: string;
  name: string;
  styling: Record<string, any>;
  properties?: Record<string, any>;
}

const ComponentVariantLogicDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('logic');
  const [component, setComponent] = useState<DemoComponent>({
    id: 'demo-component',
    type: 'box',
    position: { x: 0, y: 0 },
    size: { width: 200, height: 100 },
    zIndex: 1,
    visible: true,
    style: { backgroundColor: '#3498db', color: '#ffffff', padding: '1rem' },
    styling: {
      backgroundColor: '#3498db',
      color: '#ffffff',
      padding: '1rem',
      borderRadius: '4px',
    },
    variants: [
      {
        id: 'default',
        name: 'Default',
        styling: {
          backgroundColor: '#3498db',
          color: '#ffffff',
          padding: '1rem',
          borderRadius: '4px',
        }
      },
      {
        id: 'success',
        name: 'Success',
        styling: {
          backgroundColor: '#2ecc71',
          color: '#ffffff',
          padding: '1rem',
          borderRadius: '4px',
        }
      },
      {
        id: 'warning',
        name: 'Warning',
        styling: {
          backgroundColor: '#f39c12',
          color: '#ffffff',
          padding: '1rem',
          borderRadius: '4px',
        }
      },
      {
        id: 'error',
        name: 'Error',
        styling: {
          backgroundColor: '#e74c3c',
          color: '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
          border: '2px solid #c0392b'
        }
      }
    ],
    activeVariant: 'default',
  });

  const [componentState, setComponentState] = useState({
    visible: true,
    active: false,
    hover: false,
    focused: false,
    selected: false,
    disabled: false,
    loading: false,
    valid: true,
    customProperty: 'default value',
  });

  const {
    rules,
    addRule,
    updateRule,
    deleteRule,
    evaluateRules,
    applyEffects
  } = useComponentVariantLogic([]);

  // Sample rules for demonstration
  useEffect(() => {
    // Add a few sample rules when the component loads
    addRule("Set Success Variant When Active");
    addRule("Increase Border Radius When Hovered");
    addRule("Change Color When Selected");
    
    // Configure the rules
    updateRule(rules[0]?.id || '', {
      active: true,
      logicGroups: [
        {
          id: 'lg1',
          type: 'and',
          conditions: [
            {
              id: 'c1',
              field: 'active',
              operator: 'equals',
              value: true
            }
          ]
        }
      ],
      effect: {
        type: 'property',
        target: 'component',
        property: 'activeVariant',
        value: 'success'
      }
    });

    updateRule(rules[1]?.id || '', {
      active: true,
      logicGroups: [
        {
          id: 'lg2',
          type: 'and',
          conditions: [
            {
              id: 'c2',
              field: 'hover',
              operator: 'equals',
              value: true
            }
          ]
        }
      ],
      effect: {
        type: 'style',
        target: 'component',
        property: 'borderRadius',
        value: '12px'
      }
    });

    updateRule(rules[2]?.id || '', {
      active: true,
      logicGroups: [
        {
          id: 'lg3',
          type: 'and',
          conditions: [
            {
              id: 'c3',
              field: 'selected',
              operator: 'equals',
              value: true
            }
          ]
        }
      ],
      effect: {
        type: 'style',
        target: 'component',
        property: 'backgroundColor',
        value: '#9b59b6'
      }
    });
  }, []);

  // Apply conditional logic on component state changes
  useEffect(() => {
    const effects = evaluateRules(componentState);
    const updatedState = applyEffects(effects, component);
    
    setComponent(prev => ({
      ...prev,
      ...updatedState,
      style: {
        ...prev.style,
        ...updatedState.style
      }
    }));
  }, [componentState, rules]);

  const handleToggleState = (stateName: string) => {
    setComponentState(prev => ({
      ...prev,
      [stateName]: !prev[stateName]
    }));
  };

  const handleVariantChange = (variantId: string) => {
    const selectedVariant = component.variants?.find(v => v.id === variantId);
    
    if (selectedVariant) {
      setComponent(prev => ({
        ...prev,
        activeVariant: variantId,
        style: {
          ...prev.style,
          ...selectedVariant.styling
        }
      }));
    }
  };

  const renderComponent = () => {
    const activeVariantData = component.variants?.find(v => v.id === component.activeVariant) || component.variants?.[0];
    const styling = {
      ...component.style,
      ...(activeVariantData?.styling || {}),
    };

    return (
      <div
        style={{
          width: typeof component.size === 'string' ? 'auto' : component.size.width,
          height: typeof component.size === 'string' ? 'auto' : component.size.height,
          ...styling,
          display: component.visible ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '20px auto',
          transition: 'all 0.3s ease'
        }}
      >
        Demo Component
        {componentState.active && <Check className="ml-2" size={16} />}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Component Variant Logic Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Component Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {renderComponent()}
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Component States</h2>
              <div className="flex flex-wrap gap-3">
                {Object.keys(componentState).map(stateName => (
                  <div key={stateName} className="flex items-center space-x-2">
                    <Switch
                      checked={componentState[stateName as keyof typeof componentState] as boolean}
                      onCheckedChange={() => handleToggleState(stateName)}
                    />
                    <Label className="capitalize">{stateName}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Component Variants</h2>
              <div className="flex gap-2">
                {component.variants?.map(variant => (
                  <Button
                    key={variant.id}
                    variant={component.activeVariant === variant.id ? 'default' : 'outline'}
                    onClick={() => handleVariantChange(variant.id)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Component Logic</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="logic">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Conditions
                </TabsTrigger>
                <TabsTrigger value="variants">
                  <Tag className="mr-2 h-4 w-4" />
                  Variants
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="logic" className="space-y-4 mt-4">
                <h3 className="font-semibold">Active Rules</h3>
                {rules.length === 0 ? (
                  <p className="text-gray-500">No rules defined yet</p>
                ) : (
                  rules.map(rule => (
                    <div key={rule.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4>{rule.name}</h4>
                        <Switch
                          checked={rule.active}
                          onCheckedChange={(checked) => 
                            updateRule(rule.id, { active: checked })
                          }
                        />
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">When: </span>
                        {rule.logicGroups.map((group, i) => (
                          <span key={group.id}>
                            {i > 0 && " OR "}
                            {group.conditions.map((cond, j) => (
                              <span key={cond.id}>
                                {j > 0 && " AND "}
                                <span className="font-medium">{cond.field}</span> {cond.operator} <span className="text-blue-600">{String(cond.value)}</span>
                              </span>
                            ))}
                          </span>
                        ))}
                        <br />
                        <span className="text-gray-500">Then: </span>
                        <span className="font-medium">{rule.effect.property}</span> = <span className="text-green-600">{String(rule.effect.value)}</span>
                      </div>
                    </div>
                  ))
                )}
                
                <Button
                  onClick={() => addRule(`New Rule ${rules.length + 1}`)}
                  className="w-full"
                  variant="outline"
                >
                  Add New Rule
                </Button>
              </TabsContent>
              
              <TabsContent value="variants" className="mt-4">
                <h3 className="font-semibold mb-3">Available Variants</h3>
                <div className="space-y-3">
                  {component.variants?.map(variant => (
                    <div key={variant.id} className="border rounded-md p-3">
                      <h4 className="font-medium">{variant.name}</h4>
                      <div 
                        className="mt-2 h-6 rounded-sm" 
                        style={{ backgroundColor: variant.styling.backgroundColor }}
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        {Object.entries(variant.styling).map(([key, value]) => (
                          <div key={key}>{key}: {String(value)}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentVariantLogicDemo;
