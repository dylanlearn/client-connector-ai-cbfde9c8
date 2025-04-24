
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ComponentContractProps {
  onContractChange?: (contract: ComponentContractType) => void;
  className?: string;
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface ComponentContractType {
  name: string;
  version: string;
  description: string;
  props: PropDefinition[];
  events: string[];
  behaviors: string[];
}

export const ComponentContract: React.FC<ComponentContractProps> = ({
  onContractChange,
  className
}) => {
  const [contract, setContract] = React.useState<ComponentContractType>({
    name: '',
    version: '1.0.0',
    description: '',
    props: [],
    events: [],
    behaviors: []
  });

  const [newProp, setNewProp] = React.useState<PropDefinition>({
    name: '',
    type: '',
    required: false,
    description: ''
  });

  const handleContractChange = (field: keyof ComponentContractType, value: any) => {
    const newContract = { ...contract, [field]: value };
    setContract(newContract);
    onContractChange?.(newContract);
  };

  const addProp = () => {
    if (!newProp.name || !newProp.type) {
      toast.error('Name and type are required for props');
      return;
    }

    handleContractChange('props', [...contract.props, newProp]);
    setNewProp({
      name: '',
      type: '',
      required: false,
      description: ''
    });
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Component Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Component Name</Label>
            <Input 
              value={contract.name}
              onChange={(e) => handleContractChange('name', e.target.value)}
              placeholder="MyComponent"
            />
          </div>
          <div className="space-y-2">
            <Label>Version</Label>
            <Input 
              value={contract.version}
              onChange={(e) => handleContractChange('version', e.target.value)}
              placeholder="1.0.0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea 
            value={contract.description}
            onChange={(e) => handleContractChange('description', e.target.value)}
            placeholder="Describe the component's purpose and usage"
          />
        </div>

        <div className="space-y-4">
          <Label>Props</Label>
          {contract.props.map((prop, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <span className="font-medium">{prop.name}</span>
              <span className="text-sm text-muted-foreground">({prop.type})</span>
              {prop.required && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
              )}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input 
                value={newProp.name}
                onChange={(e) => setNewProp({ ...newProp, name: e.target.value })}
                placeholder="Prop name"
              />
            </div>
            <div className="space-y-2">
              <Input 
                value={newProp.type}
                onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                placeholder="Prop type"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              checked={newProp.required}
              onCheckedChange={(checked) => setNewProp({ ...newProp, required: checked })}
            />
            <Label>Required</Label>
          </div>

          <Textarea 
            value={newProp.description}
            onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
            placeholder="Prop description"
          />

          <Button onClick={addProp}>Add Prop</Button>
        </div>
      </CardContent>
    </Card>
  );
};
