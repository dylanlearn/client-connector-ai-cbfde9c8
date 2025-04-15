
import React from 'react';

export interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  className?: string;
  id?: string;
  color?: string; // Added for backward compatibility
}

export function ColorPicker({ value, color, onChange, className, id }: ColorPickerProps) {
  // Use either value or color prop (for backward compatibility)
  const colorValue = value !== undefined ? value : color || '#000000';
  
  return (
    <input
      id={id}
      type="color"
      value={colorValue}
      onChange={(e) => onChange(e.target.value)}
      className={`w-8 h-8 p-0 border rounded cursor-pointer ${className || ''}`}
    />
  );
}
