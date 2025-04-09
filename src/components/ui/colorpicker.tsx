
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  value = '#000000', 
  onChange,
  className
}) => {
  const [color, setColor] = useState(value);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setColor(value);
  }, [value]);
  
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setColor(newColor);
    onChange?.(newColor);
  }, [onChange]);
  
  const colorSquares = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080',
    '#800000', '#808000', '#008000', '#800080', '#008080',
    '#000080', '#e6194B', '#3cb44b', '#ffe119', '#4363d8',
    '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45',
    '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8',
  ];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-10 h-10 p-0 border-2"
            style={{ backgroundColor: color }}
            onClick={() => {
              setOpen(true);
              setTimeout(() => inputRef.current?.click(), 100);
            }}
          >
            <span className="sr-only">Pick a color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="mb-3">
            <input
              ref={inputRef}
              type="color"
              value={color}
              onChange={handleChange}
              className="w-full h-8"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {colorSquares.map((colorHex) => (
              <button
                key={colorHex}
                style={{ background: colorHex }}
                className={cn(
                  "w-8 h-8 rounded-md border-2",
                  color === colorHex ? "border-primary" : "border-transparent"
                )}
                onClick={() => {
                  setColor(colorHex);
                  onChange?.(colorHex);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
