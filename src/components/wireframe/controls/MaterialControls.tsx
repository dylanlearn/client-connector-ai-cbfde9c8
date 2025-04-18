
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/colorpicker';
import { MaterialType, SurfaceTreatment } from '../fidelity/FidelityLevels';

export interface MaterialControlsProps {
  initialMaterial?: MaterialType;
  initialSurface?: SurfaceTreatment;
  initialColor?: string;
  initialIntensity?: number;
  onChange?: (settings: {
    material: MaterialType;
    surface: SurfaceTreatment;
    color: string;
    intensity: number;
  }) => void;
}

const MaterialControls: React.FC<MaterialControlsProps> = ({
  initialMaterial = 'matte',
  initialSurface = 'smooth',
  initialColor = '#4a90e2',
  initialIntensity = 1.0,
  onChange
}) => {
  const [material, setMaterial] = useState<MaterialType>(initialMaterial);
  const [surface, setSurface] = useState<SurfaceTreatment>(initialSurface);
  const [color, setColor] = useState(initialColor);
  const [intensity, setIntensity] = useState(initialIntensity);

  const handleMaterialChange = (value: string) => {
    const newMaterial = value as MaterialType;
    setMaterial(newMaterial);
    if (onChange) {
      onChange({ material: newMaterial, surface, color, intensity });
    }
  };

  const handleSurfaceChange = (value: string) => {
    const newSurface = value as SurfaceTreatment;
    setSurface(newSurface);
    if (onChange) {
      onChange({ material, surface: newSurface, color, intensity });
    }
  };

  const handleColorChange = (value: string) => {
    setColor(value);
    if (onChange) {
      onChange({ material, surface, color: value, intensity });
    }
  };

  const handleIntensityChange = (value: number[]) => {
    const newIntensity = value[0];
    setIntensity(newIntensity);
    if (onChange) {
      onChange({ material, surface, color, intensity: newIntensity });
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <Label htmlFor="material-type">Material Type</Label>
        <Select value={material} onValueChange={handleMaterialChange}>
          <SelectTrigger id="material-type" className="mt-1">
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="flat">Flat</SelectItem>
            <SelectItem value="matte">Matte</SelectItem>
            <SelectItem value="glossy">Glossy</SelectItem>
            <SelectItem value="metallic">Metallic</SelectItem>
            <SelectItem value="glass">Glass</SelectItem>
            <SelectItem value="textured">Textured</SelectItem>
            <SelectItem value="metal">Metal</SelectItem>
            <SelectItem value="plastic">Plastic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="surface-treatment">Surface Treatment</Label>
        <Select value={surface} onValueChange={handleSurfaceChange}>
          <SelectTrigger id="surface-treatment" className="mt-1">
            <SelectValue placeholder="Select surface treatment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smooth">Smooth</SelectItem>
            <SelectItem value="rough">Rough</SelectItem>
            <SelectItem value="bumpy">Bumpy</SelectItem>
            <SelectItem value="engraved">Engraved</SelectItem>
            <SelectItem value="embossed">Embossed</SelectItem>
            <SelectItem value="matte">Matte</SelectItem>
            <SelectItem value="glossy">Glossy</SelectItem>
            <SelectItem value="frosted">Frosted</SelectItem>
            <SelectItem value="textured">Textured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="material-color">Color</Label>
        <div className="mt-1">
          <ColorPicker value={color} onChange={handleColorChange} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="intensity">Material Intensity</Label>
          <span className="text-sm text-muted-foreground">
            {intensity.toFixed(1)}
          </span>
        </div>
        <Slider
          id="intensity"
          min={0}
          max={1}
          step={0.1}
          value={[intensity]}
          onValueChange={handleIntensityChange}
        />
      </div>
    </Card>
  );
};

export default MaterialControls;
