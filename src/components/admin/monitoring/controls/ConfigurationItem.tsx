
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export interface ConfigurationItemProps {
  label: string;
  value: string | number | boolean;
  configKey: string;
  onChange: (key: string, value: any) => void;
  type?: 'text' | 'number' | 'boolean' | 'slider';
}

export function ConfigurationItem({
  label,
  value,
  configKey,
  onChange,
  type = 'text'
}: ConfigurationItemProps) {
  const labelText = label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
    
  const handleChange = (newValue: any) => {
    onChange(configKey, newValue);
  };
  
  const renderInput = () => {
    switch (type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch 
              checked={!!value} 
              onCheckedChange={handleChange} 
              id={`config-${configKey}`}
            />
            <Label htmlFor={`config-${configKey}`}>{value ? 'Enabled' : 'Disabled'}</Label>
          </div>
        );
        
      case 'number':
        return (
          <Input
            type="number"
            value={String(value)}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="max-w-[200px]"
            id={`config-${configKey}`}
          />
        );
        
      case 'slider':
        return (
          <div className="space-y-2">
            <Slider
              value={[typeof value === 'number' ? value : 0]}
              onValueChange={(vals) => handleChange(vals[0])}
              max={100}
              step={1}
              id={`config-${configKey}`}
            />
            <div className="text-sm text-muted-foreground">Value: {value}</div>
          </div>
        );
        
      default:
        return (
          <Input
            type="text"
            value={String(value)}
            onChange={(e) => handleChange(e.target.value)}
            id={`config-${configKey}`}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`config-${configKey}`}>{labelText}</Label>
      {renderInput()}
    </div>
  );
}
