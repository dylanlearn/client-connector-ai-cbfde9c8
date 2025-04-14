
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MonitoringConfiguration } from '@/utils/monitoring/types';

interface ConfigurationItemProps {
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'number' | 'text';
  options?: { label: string; value: string }[];
  value: any;
  configKey: string;
  onChange: (key: string, value: any) => void;
  min?: number;
  max?: number;
}

export function ConfigurationItem({
  label,
  description,
  type,
  options,
  value,
  configKey,
  onChange,
  min,
  max
}: ConfigurationItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <Label className="text-base">{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      <div>
        {type === 'toggle' && (
          <Switch
            checked={!!value}
            onCheckedChange={(checked) => onChange(configKey, checked)}
          />
        )}
        
        {type === 'select' && options && (
          <Select
            value={String(value)}
            onValueChange={(newValue) => onChange(configKey, newValue)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {type === 'number' && (
          <Input
            type="number"
            value={value}
            onChange={(e) => {
              let newValue = parseFloat(e.target.value);
              if (min !== undefined) newValue = Math.max(min, newValue);
              if (max !== undefined) newValue = Math.min(max, newValue);
              onChange(configKey, newValue);
            }}
            className="w-24"
            min={min}
            max={max}
          />
        )}
        
        {type === 'text' && (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(configKey, e.target.value)}
            className="w-40"
          />
        )}
      </div>
    </div>
  );
}
