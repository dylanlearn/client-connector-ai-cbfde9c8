
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, ArrowsMaximize, LayoutGrid, Trash2 } from 'lucide-react';
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
    type: 'size' as 'size' | 'position' | 'alignment' | 'spacing' | 'relationship',
    target: '',
    rule: '',
    value: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleAddConstraint = () => {
    addConstraint(newConstraint);
    setNewConstraint({
      name: '',
      type: 'size',
      target: '',
      rule: '',
      value: '',
      priority: 'medium'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Component Constraints</h3>
          <p className="text-sm text-muted-foreground">
            Define how components behave when their container changes
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={analyze} 
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              <ArrowsMaximize className="mr-2 h-4 w-4" />
              Auto-Analyze
            </>
          )}
        </Button>
      </div>

      {/* Add new constraint form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Add New Constraint</CardTitle>
          <CardDescription>
            Define how components should resize, reposition or align
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="constraint-name">Name</Label>
                <Input
                  id="constraint-name"
                  placeholder="e.g., Header Height"
                  value={newConstraint.name}
                  onChange={(e) => setNewConstraint({ ...newConstraint, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="constraint-type">Type</Label>
                <Select
                  value={newConstraint.type}
                  onValueChange={(value) => setNewConstraint({ 
                    ...newConstraint, 
                    type: value as 'size' | 'position' | 'alignment' | 'spacing' | 'relationship' 
                  })}
                >
                  <SelectTrigger id="constraint-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {constraintTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="constraint-target">Target Element</Label>
              <Input
                id="constraint-target"
                placeholder="e.g., #header, .navigation"
                value={newConstraint.target}
                onChange={(e) => setNewConstraint({ ...newConstraint, target: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="constraint-rule">Rule</Label>
                <Input
                  id="constraint-rule"
                  placeholder="e.g., fixed-height"
                  value={newConstraint.rule}
                  onChange={(e) => setNewConstraint({ ...newConstraint, rule: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="constraint-value">Value</Label>
                <Input
                  id="constraint-value"
                  placeholder="e.g., 80px, 100%"
                  value={newConstraint.value}
                  onChange={(e) => setNewConstraint({ ...newConstraint, value: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="constraint-priority">Priority</Label>
              <Select
                value={newConstraint.priority}
                onValueChange={(value) => setNewConstraint({ 
                  ...newConstraint, 
                  priority: value as 'low' | 'medium' | 'high'
                })}
              >
                <SelectTrigger id="constraint-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleAddConstraint} disabled={!newConstraint.name || !newConstraint.target}>
              Add Constraint
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current constraints list */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Active Constraints ({constraints.length})</h4>
        
        {constraints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <LayoutGrid className="mx-auto h-8 w-8 mb-2" />
            <p>No constraints defined yet</p>
            <p className="text-sm">Add constraints or use Auto-Analyze</p>
          </div>
        ) : (
          <div className="space-y-2">
            {constraints.map((constraint, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{constraint.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {constraint.target} - {constraint.rule}: {constraint.value}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded mr-2">
                        {constraint.type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        constraint.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : constraint.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {constraint.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={constraint.enabled !== false}
                        onCheckedChange={(checked) => {
                          const updatedConstraint = { ...constraint, enabled: checked };
                          updateConstraint(index, updatedConstraint);
                        }}
                      />
                      <Label className="text-sm">Enabled</Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeConstraint(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            <Button 
              onClick={applyConstraints} 
              disabled={constraints.filter(c => c.enabled !== false).length === 0}
              className="w-full mt-4"
            >
              Apply All Constraints
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentConstraintPanel;
