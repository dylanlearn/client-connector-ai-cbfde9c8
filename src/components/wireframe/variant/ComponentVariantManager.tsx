
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WireframeComponent } from '@/types/wireframe-component';

export type PropertyType = "string" | "number" | "boolean" | "color" | "select";

export interface VariantProperty {
  id: string;
  name: string;
  value: any;
  type: PropertyType;
  isOverride: boolean;
}

export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  properties: VariantProperty[];
  baseComponentId?: string; // Reference to parent component if this is a variant
  isBase?: boolean;
}

export interface ComponentVariantManagerProps {
  components: WireframeComponent[];
  variants: ComponentVariant[];
  activeVariantId?: string;
  onVariantCreate?: (variant: ComponentVariant) => void;
  onVariantUpdate?: (variant: ComponentVariant) => void;
  onVariantDelete?: (variantId: string) => void;
  onVariantSelect?: (variantId: string) => void;
  baseStyles?: Record<string, any>;
}

const ComponentVariantManager: React.FC<ComponentVariantManagerProps> = ({
  components = [],
  variants = [],
  activeVariantId,
  onVariantCreate,
  onVariantUpdate,
  onVariantDelete,
  onVariantSelect,
  baseStyles = {}
}) => {
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantDescription, setNewVariantDescription] = useState('');
  const [activeTabId, setActiveTabId] = useState<string>(variants.length > 0 ? variants[0].id : '');

  // Find the base component - the one that's not a variant
  const baseVariant = variants.find(v => v.isBase) || variants[0];

  const handleCreateVariant = () => {
    if (!newVariantName) return;

    const newVariant: ComponentVariant = {
      id: `variant-${Date.now()}`,
      name: newVariantName,
      description: newVariantDescription,
      properties: [],
      baseComponentId: baseVariant?.id
    };

    onVariantCreate?.(newVariant);
    setNewVariantName('');
    setNewVariantDescription('');
    setActiveTabId(newVariant.id);
  };

  const handleUpdateVariant = (variantId: string, updates: Partial<ComponentVariant>) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;

    onVariantUpdate?.({
      ...variant,
      ...updates
    });
  };

  const handleDeleteVariant = (variantId: string) => {
    onVariantDelete?.(variantId);
    if (activeTabId === variantId) {
      setActiveTabId(variants.filter(v => v.id !== variantId)[0]?.id || '');
    }
  };

  const handlePropertyChange = (
    variantId: string, 
    propertyId: string, 
    updates: Partial<VariantProperty>
  ) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;

    const updatedProperties = variant.properties.map(prop => 
      prop.id === propertyId ? { ...prop, ...updates } : prop
    );

    onVariantUpdate?.({
      ...variant,
      properties: updatedProperties
    });
  };

  const handleAddProperty = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;

    const newProperty: VariantProperty = {
      id: `prop-${Date.now()}`,
      name: "newProperty",
      value: "",
      type: "string",
      isOverride: true
    };

    onVariantUpdate?.({
      ...variant,
      properties: [...variant.properties, newProperty]
    });
  };

  const handleDeleteProperty = (variantId: string, propertyId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;

    onVariantUpdate?.({
      ...variant,
      properties: variant.properties.filter(prop => prop.id !== propertyId)
    });
  };

  const getPropertyValueInput = (property: VariantProperty, variantId: string) => {
    switch (property.type) {
      case "boolean":
        return (
          <Switch
            checked={Boolean(property.value)}
            onCheckedChange={(checked) => 
              handlePropertyChange(variantId, property.id, { value: checked })
            }
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={property.value || ""}
            onChange={(e) => 
              handlePropertyChange(variantId, property.id, { value: parseFloat(e.target.value) || 0 })
            }
          />
        );
      case "color":
        return (
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: property.value }}
            />
            <Input
              type="text"
              value={property.value || ""}
              onChange={(e) => 
                handlePropertyChange(variantId, property.id, { value: e.target.value })
              }
            />
          </div>
        );
      default:
        return (
          <Input
            type="text"
            value={property.value || ""}
            onChange={(e) => 
              handlePropertyChange(variantId, property.id, { value: e.target.value })
            }
          />
        );
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Component Variants</CardTitle>
          <CardDescription>
            Define and manage different variants of components with property inheritance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {variants.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4">No variants defined yet</p>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="new-variant">Create your first variant</Label>
                <Input
                  id="new-variant"
                  placeholder="Variant name"
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                />
                <Input
                  placeholder="Optional description"
                  value={newVariantDescription}
                  onChange={(e) => setNewVariantDescription(e.target.value)}
                  className="mt-2"
                />
                <Button
                  onClick={handleCreateVariant}
                  disabled={!newVariantName}
                  className="mt-3"
                >
                  Create Variant
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Tabs
                value={activeTabId}
                onValueChange={(value) => {
                  setActiveTabId(value);
                  onVariantSelect?.(value);
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    {variants.map(variant => (
                      <TabsTrigger
                        key={variant.id}
                        value={variant.id}
                        className={variant.isBase ? "font-semibold" : ""}
                      >
                        {variant.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="New variant name"
                      value={newVariantName}
                      onChange={(e) => setNewVariantName(e.target.value)}
                      className="w-48 h-8"
                    />
                    <Button
                      onClick={handleCreateVariant}
                      disabled={!newVariantName}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {variants.map(variant => (
                  <TabsContent key={variant.id} value={variant.id} className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={variant.name}
                            onChange={(e) => 
                              handleUpdateVariant(variant.id, { name: e.target.value })
                            }
                            className="w-48 font-medium"
                          />
                          {!variant.isBase && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteVariant(variant.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                        <Input
                          value={variant.description || ''}
                          onChange={(e) => 
                            handleUpdateVariant(variant.id, { description: e.target.value })
                          }
                          placeholder="Variant description"
                          className="w-full text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Properties</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddProperty(variant.id)}
                        >
                          Add Property
                        </Button>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Name</TableHead>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="w-[100px]">Override</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {variant.properties.map(property => (
                            <TableRow key={property.id}>
                              <TableCell>
                                <Input
                                  value={property.name}
                                  onChange={(e) => 
                                    handlePropertyChange(variant.id, property.id, { name: e.target.value })
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell>
                                <select
                                  value={property.type}
                                  onChange={(e) => 
                                    handlePropertyChange(
                                      variant.id, 
                                      property.id, 
                                      { type: e.target.value as PropertyType }
                                    )
                                  }
                                  className="w-full h-8 rounded-md border border-input px-3 py-1"
                                >
                                  <option value="string">String</option>
                                  <option value="number">Number</option>
                                  <option value="boolean">Boolean</option>
                                  <option value="color">Color</option>
                                  <option value="select">Select</option>
                                </select>
                              </TableCell>
                              <TableCell>
                                {getPropertyValueInput(property, variant.id)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center">
                                  <Switch
                                    checked={property.isOverride}
                                    onCheckedChange={(checked) => 
                                      handlePropertyChange(variant.id, property.id, { isOverride: checked })
                                    }
                                    disabled={variant.isBase}
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteProperty(variant.id, property.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  ×
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {variant.properties.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                No properties defined
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentVariantManager;
