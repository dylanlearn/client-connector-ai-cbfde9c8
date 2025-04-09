
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  className,
  disabled = false,
}) => {
  const [value, setValue] = useState(color);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setValue(newColor);
    onChange(newColor);
  };
  
  const presetColors = [
    '#000000', '#ffffff', '#FF6900', '#FCB900',
    '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3',
    '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF',
  ];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full flex justify-start p-0 border-input h-10", className)}
          disabled={disabled}
        >
          <div
            className="h-full w-10 rounded-l-md border-r"
            style={{ backgroundColor: color }}
          />
          <div className="ml-2">{color}</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div
              className="w-full h-24 rounded-md mb-2"
              style={{ backgroundColor: value }}
            />
            <Input
              value={value}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                className={cn(
                  "w-full h-6 rounded-md border",
                  presetColor === value ? "ring-2 ring-offset-2 ring-primary" : ""
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  setValue(presetColor);
                  onChange(presetColor);
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
