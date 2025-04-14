
import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type ConfigType = 'text' | 'number' | 'boolean' | 'select';

interface SelectOption {
  label: string;
  value: string;
}

interface ConfigurationItemProps {
  label: string;
  description?: string;
  type: ConfigType;
  value: any;
  configKey: string;
  onChange: (field: string, value: any) => void;
  options?: SelectOption[];
  min?: number;
  max?: number;
  className?: string;
}

export function ConfigurationItem({ 
  label, 
  description, 
  type,
  value,
  configKey,
  onChange,
  options = [],
  min,
  max,
  className = ""
}: ConfigurationItemProps) {
  
  const handleChange = (newValue: any) => {
    onChange(configKey, newValue);
  };
  
  const renderInput = () => {
    switch (type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch 
              id={`config-${configKey}`}
              checked={value === true}
              onCheckedChange={handleChange}
            />
            <Label htmlFor={`config-${configKey}`}>{value ? 'Enabled' : 'Disabled'}</Label>
          </div>
        );
        
      case 'number':
        return (
          <Input
            id={`config-${configKey}`}
            type="number"
            value={value}
            onChange={(e) => handleChange(parseFloat(e.target.value))}
            min={min}
            max={max}
            className="max-w-xs"
          />
        );
        
      case 'select':
        return (
          <Select
            value={String(value)}
            onValueChange={handleChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'text':
      default:
        return (
          <Input
            id={`config-${configKey}`}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="max-w-xs"
          />
        );
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <Label htmlFor={`config-${configKey}`} className="text-sm font-medium">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {renderInput()}
      </div>
    </div>
  );
}
