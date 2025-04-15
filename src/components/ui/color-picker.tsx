
import React from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-8 h-8 p-0 border rounded cursor-pointer ${className || ''}`}
    />
  );
}
