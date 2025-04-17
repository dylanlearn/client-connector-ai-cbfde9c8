
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HexColorPicker } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SelectionConfig } from '@/components/wireframe/utils/types';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowsOutCardinal, ArrowsVertical, ArrowsHorizontal } from 'lucide-react';

interface SelectionSettingsPanelProps {
  config: SelectionConfig;
  onChange: (config: Partial<SelectionConfig>) => void;
}

const SelectionSettingsPanel: React.FC<SelectionSettingsPanelProps> = ({
  config,
  onChange
}) => {
  const [borderColor, setBorderColor] = useState(config.style.borderColor);
  const [cornerColor, setCornerColor] = useState(config.style.cornerColor);
  const [selectionBg, setSelectionBg] = useState(config.style.selectionBackgroundColor);
  
  // Update color pickers when config changes
  useEffect(() => {
    setBorderColor(config.style.borderColor);
    setCornerColor(config.style.cornerColor);
    setSelectionBg(config.style.selectionBackgroundColor);
  }, [config]);
  
  // Handle color changes with a timeout to avoid excessive updates
  const handleColorChange = (colorType: 'border' | 'corner' | 'background', color: string) => {
    if (colorType === 'border') {
      setBorderColor(color);
      onChange({ 
        style: { ...config.style, borderColor: color } 
      });
    } else if (colorType === 'corner') {
      setCornerColor(color);
      onChange({ 
        style: { ...config.style, cornerColor: color } 
      });
    } else if (colorType === 'background') {
      setSelectionBg(color);
      onChange({ 
        style: { ...config.style, selectionBackgroundColor: color } 
      });
    }
  };

  return (
    <div className="selection-settings-panel space-y-4 p-4">
      <h3 className="text-lg font-medium">Selection Settings</h3>
      
      <Accordion type="single" collapsible defaultValue="selection-behavior">
        <AccordionItem value="selection-behavior">
          <AccordionTrigger className="py-2">Selection Behavior</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="selection-mode">Selection Mode</Label>
                <Select
                  value={config.mode}
                  onValueChange={(value) => onChange({ mode: value as 'single' | 'multiple' })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Selection Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="multiple">Multiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="selection-key">Multi-select Key</Label>
                <Select
                  value={config.selectionKey}
                  onValueChange={(value) => onChange({ selectionKey: value as 'shift' | 'ctrl' | 'alt' })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Selection Key" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shift">Shift</SelectItem>
                    <SelectItem value="ctrl">Ctrl</SelectItem>
                    <SelectItem value="alt">Alt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="object-priority">Selection Priority</Label>
                <Select
                  value={config.objectSelectionPriority}
                  onValueChange={(value) => onChange({ 
                    objectSelectionPriority: value as 'front-to-back' | 'back-to-front' 
                  })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front-to-back">Front to Back</SelectItem>
                    <SelectItem value="back-to-front">Back to Front</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-deselect">Allow Deselection</Label>
                <Switch
                  id="allow-deselect"
                  checked={config.allowDeselect}
                  onCheckedChange={(checked) => onChange({ allowDeselect: checked })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      
        <AccordionItem value="keyboard-movement">
          <AccordionTrigger className="py-2">
            <div className="flex items-center space-x-2">
              <ArrowsVertical className="h-4 w-4" />
              <span>Keyboard Movement</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Movement Step (px)</Label>
                  <span className="text-sm">{config.keyboardMovementStep}px</span>
                </div>
                <Slider
                  id="movement-step"
                  min={1}
                  max={20}
                  step={1}
                  value={[config.keyboardMovementStep]}
                  onValueChange={(value) => onChange({ keyboardMovementStep: value[0] })}
                />
                <p className="text-xs text-muted-foreground">
                  Hold Shift for 10x movement speed
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      
        <AccordionItem value="visual-style">
          <AccordionTrigger className="py-2">Visual Style</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Border Color</Label>
                  <div className="flex">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div 
                          className="h-8 w-8 rounded-md border cursor-pointer"
                          style={{ backgroundColor: borderColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <HexColorPicker 
                          color={borderColor}
                          onChange={(color) => handleColorChange('border', color)}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input 
                      value={borderColor}
                      onChange={(e) => handleColorChange('border', e.target.value)}
                      className="w-24 ml-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Corner Color</Label>
                  <div className="flex">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div 
                          className="h-8 w-8 rounded-md border cursor-pointer"
                          style={{ backgroundColor: cornerColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <HexColorPicker 
                          color={cornerColor}
                          onChange={(color) => handleColorChange('corner', color)}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input 
                      value={cornerColor}
                      onChange={(e) => handleColorChange('corner', e.target.value)}
                      className="w-24 ml-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Selection Background</Label>
                <div className="flex">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div 
                        className="h-8 w-8 rounded-md border cursor-pointer"
                        style={{ backgroundColor: selectionBg }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <HexColorPicker 
                        color={selectionBg}
                        onChange={(color) => handleColorChange('background', color)}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input 
                    value={selectionBg}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="w-24 ml-2"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Transparent Corners</Label>
                <Switch
                  checked={config.style.transparentCorners}
                  onCheckedChange={(checked) => onChange({ 
                    style: { ...config.style, transparentCorners: checked } 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Corner Size</Label>
                  <span className="text-sm">{config.style.cornerSize}px</span>
                </div>
                <Slider
                  min={4}
                  max={16}
                  step={1}
                  value={[config.style.cornerSize]}
                  onValueChange={(value) => onChange({ 
                    style: { ...config.style, cornerSize: value[0] } 
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Corner Style</Label>
                <Select
                  value={config.style.cornerStyle}
                  onValueChange={(value) => onChange({ 
                    style: { ...config.style, cornerStyle: value as 'circle' | 'rect' } 
                  })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Corner Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="rect">Rectangle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SelectionSettingsPanel;
