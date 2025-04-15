
import React from 'react';
import { ColorPicker as UIColorPicker } from '@/components/ui/color-picker';

interface ColorPickerProps {
  id?: string;
  color?: string;
  value?: string;
  onChange: (color: string) => void;
}

// This is a wrapper around the UI component for backward compatibility
// It accepts both 'color' and 'value' props to be flexible with different usage patterns
const ColorPicker: React.FC<ColorPickerProps> = ({ id, color, value, onChange }) => {
  // Use either value or color prop (for backward compatibility)
  const actualValue = value !== undefined ? value : color;
  
  return <UIColorPicker id={id} value={actualValue} onChange={onChange} />;
};

export default ColorPicker;
