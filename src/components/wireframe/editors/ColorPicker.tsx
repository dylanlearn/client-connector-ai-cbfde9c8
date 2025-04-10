
import React from 'react';

interface ColorPickerProps {
  id: string;
  color: string;
  onChange: (color: string) => void;
}

// A very simple color picker for now
const ColorPicker: React.FC<ColorPickerProps> = ({ id, color, onChange }) => {
  return (
    <input
      type="color"
      id={id}
      value={color}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 p-0 border rounded cursor-pointer"
    />
  );
};

export default ColorPicker;
