
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { FidelityLevel } from '../fidelity/FidelityLevels';
import { useFidelity } from '../fidelity/FidelityContext';

export interface FidelityControlsProps {
  showDetailControls?: boolean;
}

const FidelityControls = ({ showDetailControls = false }: FidelityControlsProps) => {
  const { currentLevel, settings, setFidelityLevel, updateSettings, isTransitioning } = useFidelity();

  return (
    <div className="fidelity-controls space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Fidelity Level</h3>
        <RadioGroup 
          value={currentLevel}
          onValueChange={(value) => setFidelityLevel(value as FidelityLevel)}
          className="flex flex-wrap gap-3"
        >
          {['wireframe', 'low', 'medium', 'high'].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={level} 
                id={`level-${level}`}
                disabled={isTransitioning}
              />
              <Label htmlFor={`level-${level}`} className="capitalize">
                {level}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {showDetailControls && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="shadow-intensity">Shadow Intensity</Label>
              <span className="text-sm text-muted-foreground">
                {settings.shadowIntensity.toFixed(1)}
              </span>
            </div>
            <Slider
              id="shadow-intensity"
              min={0}
              max={1}
              step={0.1}
              value={[settings.shadowIntensity]}
              onValueChange={(values) => updateSettings({ shadowIntensity: values[0] })}
              disabled={isTransitioning}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="detail-level">Detail Level</Label>
              <span className="text-sm text-muted-foreground">
                {settings.detailLevel.toFixed(1)}
              </span>
            </div>
            <Slider
              id="detail-level"
              min={0}
              max={1}
              step={0.1}
              value={[settings.detailLevel]}
              onValueChange={(values) => updateSettings({ detailLevel: values[0] })}
              disabled={isTransitioning}
            />
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSettings({ showShadows: !settings.showShadows })}
              disabled={isTransitioning}
              className="w-full"
            >
              {settings.showShadows ? 'Disable Shadows' : 'Enable Shadows'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FidelityControls;
