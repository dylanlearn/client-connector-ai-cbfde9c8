
import React, { useState } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="relative">
      <div 
        className="w-8 h-8 rounded-md border cursor-pointer" 
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-background border rounded-md shadow-lg">
          <input 
            type="color" 
            value={color} 
            onChange={handleChange}
            className="w-32 h-32"
          />
        </div>
      )}
    </div>
  );
};
