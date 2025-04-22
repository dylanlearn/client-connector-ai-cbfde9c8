import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';  // Change from card to button
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useComponentConstraints } from '@/hooks/wireframe/use-component-constraints';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { toast } from 'sonner';
import { Plus, Trash2, Check, RefreshCw } from 'lucide-react';

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
    rule: '',
    value: '',
    priority: 'medium'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewConstraint({ ...newConstraint, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewConstraint({ ...newConstraint, [name]: value });
  };

  const handleAddConstraint = () => {
    if (newConstraint.name && newConstraint.type && newConstraint.target && newConstraint.rule && newConstraint.value) {
      addConstraint(newConstraint);
      setNewConstraint({
        name: '',
        type: 'size',
        target: '',
        rule: '',
        value: '',
        priority: 'medium'
      });
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Component Constraints</CardTitle>
        <Button variant="outline" size="sm" onClick={analyze} disabled={analyzing}>
          {analyzing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          {analyzing ? 'Analyzing...' : 'Analyze Components'}
        </Button>
      </CardHeader>
      <CardContent className="overflow-auto flex-grow">
        <div className="grid gap-4">
          <h4 className="text-md font-semibold">Add New Constraint</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" name="name" value={newConstraint.name} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {constraintTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="target">Target</Label>
              <Input type="text" id="target" name="target" value={newConstraint.target} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="rule">Rule</Label>
              <Input type="text" id="rule" name="rule" value={newConstraint.rule} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input type="text" id="value" name="value" value={newConstraint.value} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => handleSelectChange('priority', value)}>
                <SelectTrigger className="w-full">
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
          <Button variant="secondary" size="sm" onClick={handleAddConstraint}>
            Add Constraint
          </Button>

          <h4 className="text-md font-semibold">Existing Constraints</h4>
          {constraints.length === 0 ? (
            <p className="text-sm text-muted-foreground">No constraints defined. Analyze components to get suggestions.</p>
          ) : (
            <div className="grid gap-2">
              {constraints.map((constraint, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><strong>Name:</strong> {constraint.name}</div>
                    <div><strong>Type:</strong> {constraint.type}</div>
                    <div><strong>Target:</strong> {constraint.target}</div>
                    <div><strong>Rule:</strong> {constraint.rule}</div>
                    <div><strong>Value:</strong> {constraint.value}</div>
                    <div><strong>Priority:</strong> {constraint.priority}</div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Switch
                      id={`enabled-${index}`}
                      checked={constraint.enabled}
                      onCheckedChange={(checked) => {
                        updateConstraint(index, { ...constraint, enabled: checked });
                      }}
                    />
                    <Label htmlFor={`enabled-${index}`} className="text-sm text-muted-foreground">
                      {constraint.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeConstraint(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4">
        <Button onClick={applyConstraints} className="w-full">
          <Check className="mr-2 h-4 w-4" />
          Apply Constraints
        </Button>
      </div>
    </Card>
  );
};

export default ComponentConstraintPanel;
