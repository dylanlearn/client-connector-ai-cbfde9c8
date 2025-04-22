
import React, { useState } from 'react';
import { useComponentConstraints } from '@/hooks/wireframe/use-component-constraints';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Maximize2,
  ArrowsUpDown,
  Grid,
  Link,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ComponentConstraintPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const ComponentConstraintPanel: React.FC<ComponentConstraintPanelProps> = ({
  wireframe,
  onUpdateWireframe,
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

  const [showDescription, setShowDescription] = useState(false);

  const handleAddConstraint = () => {
    // Fixed type to use a valid constraint type from the allowed values
    addConstraint({
      name: 'New Constraint',
      type: 'size', // This is now a valid value of the allowed types
      target: 'component-id',
      rule: 'fixed-width',
      value: '100%',
      priority: 'medium',
    });
  };

  return (
    <div className="component-constraint-panel">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Component Constraints</h3>
          <p className="text-sm text-muted-foreground">
            Define how components should behave and relate to each other
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={analyzing}
          onClick={analyze}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Analyze</span>
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="constraint-types mb-4">
          <h4 className="text-sm font-medium mb-2">Available Constraint Types</h4>
          <div className="flex flex-wrap gap-2">
            {constraintTypes.map((type) => (
              <Badge
                key={type.id}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => setShowDescription(prev => !prev)}
              >
                {type.name}
              </Badge>
            ))}
          </div>
          
          {showDescription && (
            <div className="mt-2 text-sm text-muted-foreground p-2 bg-muted rounded-md">
              <p>Click on a constraint type to learn more about how it works and when to use it.</p>
            </div>
          )}
        </div>

        <Separator />

        {constraints.length === 0 ? (
          <div className="text-center p-4 bg-muted rounded-md">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">No constraints defined yet</p>
            <p className="text-xs mb-4">
              Constraints help ensure your wireframe layout remains consistent across different screen sizes and when content changes.
            </p>
            <Button size="sm" onClick={handleAddConstraint}>Add a Constraint</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {constraints.map((constraint, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="py-2 px-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">{constraint.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Badge variant={constraint.priority === 'high' ? 'destructive' : 
                        constraint.priority === 'medium' ? 'default' : 'outline'}>
                        {constraint.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4 text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-1">
                        {constraint.type === 'size' && <Maximize2 className="h-3 w-3" />}
                        {constraint.type === 'position' && <ArrowsUpDown className="h-3 w-3" />}
                        {constraint.type === 'alignment' && <Grid className="h-3 w-3" />}
                        {constraint.type === 'relationship' && <Link className="h-3 w-3" />}
                        <span className="text-xs text-muted-foreground">{constraint.type}</span>
                      </div>
                      <div className="mt-1">
                        <span className="font-mono text-xs">{constraint.target} → {constraint.rule}: {constraint.value}</span>
                      </div>
                    </div>
                    <div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => removeConstraint(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between mt-4">
              <Button size="sm" variant="outline" onClick={handleAddConstraint}>
                Add Constraint
              </Button>
              
              <Button size="sm" onClick={applyConstraints}>
                Apply All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentConstraintPanel;
