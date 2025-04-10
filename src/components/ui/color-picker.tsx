
import React from 'react';

interface ColorPickerProps {
  id: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ id, color, onChange }: ColorPickerProps) {
  return (
    <input
      type="color"
      id={id}
      value={color}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 p-0 border rounded cursor-pointer"
    />
  );
}
