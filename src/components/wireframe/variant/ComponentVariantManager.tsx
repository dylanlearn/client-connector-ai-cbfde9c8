
import React, { useState } from 'react';
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ComponentVariant } from '@/components/wireframe/registry/component-types';
import { cn } from '@/lib/utils';

export interface VariantProperty {
  id: string;
  name: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select';
  isOverride: boolean; // Indicates if this property overrides a base property
}

export interface VariantManagementProps {
  componentType: string;
  variants: ComponentVariant[];
  baseProperties: Record<string, any>;
  onVariantCreate?: (variant: Partial<ComponentVariant>) => void;
  onVariantUpdate?: (id: string, updates: Partial<ComponentVariant>) => void;
  onVariantDelete?: (id: string) => void;
  onVariantSelect?: (id: string) => void;
  selectedVariantId?: string;
}

export const ComponentVariantManager: React.FC<VariantManagementProps> = ({
  componentType,
  variants = [],
  baseProperties = {},
  onVariantCreate,
  onVariantUpdate,
  onVariantDelete,
  onVariantSelect,
  selectedVariantId
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVariant, setNewVariant] = useState<Partial<ComponentVariant>>({
    id: '',
    name: '',
    description: ''
  });
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  const handleCreateVariant = () => {
    if (!newVariant.name) return;
    
    const variantToCreate = {
      ...newVariant,
      id: newVariant.id || `${componentType}-variant-${Date.now()}`,
      // Clone base properties as starting point
      defaultData: { ...baseProperties }
    };
    
    onVariantCreate?.(variantToCreate);
    setNewVariant({ id: '', name: '', description: '' });
    setShowAddDialog(false);
  };

  const renderPropertyValue = (value: any, type: string) => {
    if (type === 'boolean') {
      return value ? 'True' : 'False';
    } else if (type === 'color') {
      return (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-gray-300" 
            style={{ backgroundColor: value }}
          />
          <span>{value}</span>
        </div>
      );
    } else {
      return String(value);
    }
  };

  // Gets all properties from a variant, including inherited ones
  const getVariantProperties = (variant: ComponentVariant): VariantProperty[] => {
    if (!variant) return [];
    
    // Start with base properties
    const properties: VariantProperty[] = Object.entries(baseProperties).map(([key, value]) => ({
      id: key,
      name: key,
      value: value,
      type: typeof value === 'boolean' 
        ? 'boolean' 
        : typeof value === 'number' 
          ? 'number' 
          : key.toLowerCase().includes('color') 
            ? 'color' 
            : 'string',
      isOverride: false
    }));
    
    // Add/override with variant-specific properties
    if (variant.defaultData) {
      Object.entries(variant.defaultData).forEach(([key, value]) => {
        const existingIndex = properties.findIndex(p => p.id === key);
        const propertyData = {
          id: key,
          name: key,
          value: value,
          type: typeof value === 'boolean' 
            ? 'boolean' 
            : typeof value === 'number' 
              ? 'number' 
              : key.toLowerCase().includes('color') 
                ? 'color' 
                : 'string',
          isOverride: existingIndex >= 0 // It's an override if it already exists in base properties
        };
        
        if (existingIndex >= 0) {
          properties[existingIndex] = propertyData;
        } else {
          properties.push(propertyData);
        }
      });
    }
    
    return properties;
  };
  
  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const variantProperties = selectedVariant ? getVariantProperties(selectedVariant) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Component Variants</h3>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Variant</DialogTitle>
              <DialogDescription>
                Add a new variant for this component type with custom properties.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variant-name" className="text-right">Name</Label>
                <Input 
                  id="variant-name" 
                  className="col-span-3" 
                  value={newVariant.name}
                  onChange={e => setNewVariant({...newVariant, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variant-desc" className="text-right">Description</Label>
                <Input 
                  id="variant-desc" 
                  className="col-span-3" 
                  value={newVariant.description || ''}
                  onChange={e => setNewVariant({...newVariant, description: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateVariant}>Create Variant</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {variants.map((variant) => (
          <Badge 
            key={variant.id}
            variant={selectedVariantId === variant.id ? "default" : "outline"} 
            className={cn(
              "cursor-pointer hover:bg-primary/10 group flex items-center gap-1",
              selectedVariantId === variant.id && "hover:bg-primary/90"
            )}
            onClick={() => onVariantSelect?.(variant.id)}
          >
            {variant.name}
            {selectedVariantId === variant.id && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1 opacity-70 hover:opacity-100 hover:bg-red-500/20 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVariantDelete?.(variant.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete variant</TooltipContent>
              </Tooltip>
            )}
          </Badge>
        ))}
      </div>

      {selectedVariant ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">{selectedVariant.name} Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Override</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variantProperties.map((prop) => (
                  <TableRow key={prop.id} className={prop.isOverride ? "bg-primary/5" : ""}>
                    <TableCell>{prop.name}</TableCell>
                    <TableCell>{renderPropertyValue(prop.value, prop.type)}</TableCell>
                    <TableCell>{prop.type}</TableCell>
                    <TableCell className="text-right">
                      <Switch 
                        checked={prop.isOverride} 
                        onCheckedChange={(checked) => {
                          if (selectedVariant && onVariantUpdate) {
                            const updatedData = { ...selectedVariant.defaultData };
                            if (checked) {
                              // Add override
                              updatedData[prop.name] = baseProperties[prop.name];
                            } else {
                              // Remove override
                              delete updatedData[prop.name];
                            }
                            
                            onVariantUpdate(selectedVariant.id, { 
                              defaultData: updatedData 
                            });
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-8 text-muted-foreground border rounded-lg">
          Select a variant to view and manage its properties
        </div>
      )}
    </div>
  );
};

export default ComponentVariantManager;
