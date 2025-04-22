
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Maximize2, Trash } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useComponentConstraints } from '@/hooks/wireframe/use-component-constraints';

interface ComponentConstraintPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const ComponentConstraintPanel: React.FC<ComponentConstraintPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
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

  const [newConstraint, setNewConstraint] = useState({
    name: '',
    type: 'size',
    target: '',
    rule: 'min-width',
    value: '100px',
    priority: 'high'
  });

  const handleAddConstraint = () => {
    addConstraint(newConstraint);
    setNewConstraint({
      name: '',
      type: 'size',
      target: '',
      rule: 'min-width',
      value: '100px',
      priority: 'high'
    });
  };

  const handleApplyConstraints = () => {
    applyConstraints();
  };

  return (
    <div className="component-constraint-panel space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-medium">Component Constraints</h3>
          <p className="text-sm text-muted-foreground">
            Define how components adapt to changes in layout and screen size
          </p>
        </div>
        <Button 
          onClick={analyze}
          disabled={analyzing}
        >
          {analyzing ? 'Analyzing...' : 'Analyze Components'}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Constraint</CardTitle>
            <CardDescription>
              Create rules for how components resize and position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="constraint-name">Name</Label>
                <Input 
                  id="constraint-name"
                  placeholder="Header height constraint" 
                  value={newConstraint.name}
                  onChange={e => setNewConstraint({...newConstraint, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraint-type">Constraint Type</Label>
                <Select 
                  value={newConstraint.type} 
                  onValueChange={value => setNewConstraint({...newConstraint, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="position">Position</SelectItem>
                    <SelectItem value="alignment">Alignment</SelectItem>
                    <SelectItem value="spacing">Spacing</SelectItem>
                    <SelectItem value="relationship">Relationship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraint-target">Target Component</Label>
                <Input 
                  id="constraint-target"
                  placeholder="component-id or selector" 
                  value={newConstraint.target}
                  onChange={e => setNewConstraint({...newConstraint, target: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraint-rule">Rule</Label>
                <Select 
                  value={newConstraint.rule} 
                  onValueChange={value => setNewConstraint({...newConstraint, rule: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="min-width">Min Width</SelectItem>
                    <SelectItem value="max-width">Max Width</SelectItem>
                    <SelectItem value="fixed-height">Fixed Height</SelectItem>
                    <SelectItem value="aspect-ratio">Aspect Ratio</SelectItem>
                    <SelectItem value="responsive-scale">Responsive Scale</SelectItem>
                    <SelectItem value="relative-position">Relative Position</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraint-value">Value</Label>
                <Input 
                  id="constraint-value"
                  placeholder="100px, 50%, 2rem, etc." 
                  value={newConstraint.value}
                  onChange={e => setNewConstraint({...newConstraint, value: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraint-priority">Priority</Label>
                <Select 
                  value={newConstraint.priority} 
                  onValueChange={value => setNewConstraint({...newConstraint, priority: value as 'low' | 'medium' | 'high'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddConstraint}>Add Constraint</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Constraints</CardTitle>
            <CardDescription>
              {constraints.length === 0 
                ? "No constraints have been defined yet" 
                : `${constraints.length} constraints defined`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {constraints.length === 0 ? (
              <div className="text-center py-8">
                <Maximize2 className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No Constraints Yet</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Add your first constraint above or use the analyze button to automatically detect constraints.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {constraints.map((constraint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">{constraint.name || `Constraint ${index + 1}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {constraint.type}: {constraint.rule} = {constraint.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateConstraint(index, { ...constraint, enabled: !constraint.enabled })}
                      >
                        {constraint.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => removeConstraint(index)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="mt-6">
                  <Button onClick={handleApplyConstraints} className="w-full">
                    Apply All Constraints
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Constraint Type Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {constraintTypes.map((type) => (
            <Card key={type.id} className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComponentConstraintPanel;
