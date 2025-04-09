
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color?: string;
  onChange?: (color: string) => void;
  className?: string;
}

const presetColors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#C0C0C0", "#808080",
  "#800000", "#808000", "#008000", "#800080", "#008080",
  "#000080", "#FF8080", "#80FF80", "#8080FF", "#FFA500"
];

export const Colorpicker: React.FC<ColorPickerProps> = ({
  color = "#000000",
  onChange,
  className
}) => {
  const [selectedColor, setSelectedColor] = useState(color);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    if (onChange) onChange(newColor);
  };

  const handlePresetClick = (presetColor: string) => {
    setSelectedColor(presetColor);
    if (onChange) onChange(presetColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-8 h-8 rounded-md p-0", className)}
          style={{ backgroundColor: selectedColor }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <div>
            <div className="h-10 rounded-md" style={{ backgroundColor: selectedColor }} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="color-picker">
              Color
            </label>
            <input
              id="color-picker"
              type="color"
              className="w-full h-8 cursor-pointer"
              value={selectedColor}
              onChange={handleColorChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Hex
            </label>
            <input
              type="text"
              className="w-full px-2 py-1 border rounded"
              value={selectedColor}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-F]{0,6}$/i.test(val) || val === '') {
                  setSelectedColor(val);
                  if (val.length === 7 && onChange) onChange(val);
                }
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Presets
            </label>
            <div className="grid grid-cols-10 gap-1 mt-1">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className={cn(
                    "w-4 h-4 rounded-sm cursor-pointer border",
                    selectedColor === presetColor && "ring-2 ring-primary"
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handlePresetClick(presetColor)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
