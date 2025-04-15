
import React from 'react';
import { ColorPicker as UIColorPicker } from '@/components/ui/color-picker';

interface ColorPickerProps {
  id: string;
  color: string;
  onChange: (color: string) => void;
}

// This is now a wrapper around the UI component for backward compatibility
const ColorPicker: React.FC<ColorPickerProps> = ({ id, color, onChange }) => {
  return <UIColorPicker id={id} value={color} onChange={onChange} />;
};

export default ColorPicker;
