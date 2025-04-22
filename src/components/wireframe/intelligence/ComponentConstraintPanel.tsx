
import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Maximize2, Plus, Trash2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useComponentConstraints } from '@/hooks/wireframe/use-component-constraints';

interface ComponentConstraintPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const ComponentConstraintPanel: React.FC<ComponentConstraintPanelProps> = ({ wireframe, onUpdateWireframe }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'size',
    target: '',
    rule: '',
    value: '',
    priority: 'medium',
  });
  
  const { 
    constraints, 
    constraintTypes, 
    analyzing, 
    analyze, 
    addConstraint, 
    updateConstraint, 
    removeConstraint, 
    applyConstraints 
  } = useComponentConstraints(wireframe, onUpdateWireframe);

  const handleAddConstraint = () => {
    addConstraint({
      name: formData.name,
      type: formData.type as "size" | "position" | "alignment" | "spacing" | "relationship",
      target: formData.target,
      rule: formData.rule,
      value: formData.value,
      priority: formData.priority as "low" | "medium" | "high",
      enabled: true
    });
    
    // Reset form
    setFormData({
      name: '',
      type: 'size',
      target: '',
      rule: '',
      value: '',
      priority: 'medium',
    });
  };

  const handleToggleConstraint = (index: number, enabled: boolean) => {
    const constraint = constraints[index];
    updateConstraint(index, { ...constraint, enabled });
  };

  const handleRemoveConstraint = (index: number) => {
    removeConstraint(index);
  };

  // Available constraint rules based on constraint type
  const getRulesForType = (type: string) => {
    switch (type) {
      case 'size':
        return [
          { value: 'fixed-width', label: 'Fixed Width' },
          { value: 'fixed-height', label: 'Fixed Height' },
          { value: 'min-width', label: 'Minimum Width' },
          { value: 'max-width', label: 'Maximum Width' },
          { value: 'aspect-ratio', label: 'Aspect Ratio' }
        ];
      case 'position':
        return [
          { value: 'fixed-position', label: 'Fixed Position' },
          { value: 'relative-position', label: 'Relative Position' },
          { value: 'center-in-parent', label: 'Center in Parent' },
          { value: 'align-edges', label: 'Align Edges' }
        ];
      case 'alignment':
        return [
          { value: 'left-align', label: 'Left Align' },
          { value: 'center-align', label: 'Center Align' },
          { value: 'right-align', label: 'Right Align' },
          { value: 'top-align', label: 'Top Align' },
          { value: 'middle-align', label: 'Middle Align' },
          { value: 'bottom-align', label: 'Bottom Align' }
        ];
      case 'spacing':
        return [
          { value: 'fixed-spacing', label: 'Fixed Spacing' },
          { value: 'proportional-spacing', label: 'Proportional Spacing' },
          { value: 'equal-spacing', label: 'Equal Spacing' }
        ];
      case 'relationship':
        return [
          { value: 'parent-child', label: 'Parent-Child' },
          { value: 'sibling', label: 'Sibling' },
          { value: 'group', label: 'Group' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Component Constraints</h3>
          <p className="text-sm text-muted-foreground">
            Define how components should behave when resized or repositioned
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={analyze} 
          disabled={analyzing}
        >
          <Maximize2 className="mr-2 h-4 w-4" />
          {analyzing ? 'Analyzing...' : 'Analyze Layout'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Constraint</CardTitle>
          <CardDescription>
            Create rules for how components should adapt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="constraint-name">Name</Label>
                <Input 
                  id="constraint-name" 
                  placeholder="Constraint name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="constraint-type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={value => setFormData({...formData, type: value})}
                >
                  <SelectTrigger id="constraint-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {constraintTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="constraint-target">Target Element</Label>
                <Input 
                  id="constraint-target" 
                  placeholder="CSS selector or component ID" 
                  value={formData.target} 
                  onChange={e => setFormData({...formData, target: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="constraint-rule">Rule</Label>
                <Select 
                  value={formData.rule} 
                  onValueChange={value => setFormData({...formData, rule: value})}
                >
                  <SelectTrigger id="constraint-rule">
                    <SelectValue placeholder="Select rule" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRulesForType(formData.type).map(rule => (
                      <SelectItem key={rule.value} value={rule.value}>
                        {rule.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="constraint-value">Value</Label>
                <Input 
                  id="constraint-value" 
                  placeholder="e.g. 100px, 2rem, 1:1" 
                  value={formData.value} 
                  onChange={e => setFormData({...formData, value: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup 
                  value={formData.priority} 
                  onValueChange={value => setFormData({...formData, priority: value})}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="low" id="priority-low" />
                    <Label htmlFor="priority-low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="medium" id="priority-medium" />
                    <Label htmlFor="priority-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="high" id="priority-high" />
                    <Label htmlFor="priority-high">High</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <Button onClick={handleAddConstraint} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Constraint
            </Button>
          </div>
        </CardContent>
      </Card>

      {constraints.length > 0 ? (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Active Constraints</h3>
            
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {constraints.map((constraint, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{constraint.name || `Constraint ${index + 1}`}</h4>
                        <Badge variant={
                          constraint.priority === 'high' ? 'destructive' : 
                          constraint.priority === 'medium' ? 'default' : 
                          'outline'
                        }>
                          {constraint.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {constraint.type} - {constraint.rule}: {constraint.value}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={constraint.enabled} 
                        onCheckedChange={(checked) => handleToggleConstraint(index, checked)}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveConstraint(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <Button onClick={applyConstraints} className="w-full">
            Apply Constraints to Wireframe
          </Button>
        </>
      ) : (
        <div className="rounded-md bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No constraints added yet. Add constraints above or analyze your layout to get suggestions.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComponentConstraintPanel;
