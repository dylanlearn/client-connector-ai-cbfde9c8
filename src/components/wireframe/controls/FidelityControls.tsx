
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CheckIcon, CircleSlash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFidelity } from '../fidelity/FidelityContext';
import { FidelityLevel } from '../fidelity/FidelityLevels';

export interface FidelityControlsProps {
  showLevelSelector?: boolean;
  showDetailControls?: boolean;
  className?: string;
  compact?: boolean;
}

const FidelityControls: React.FC<FidelityControlsProps> = ({
  showLevelSelector = true,
  showDetailControls = true,
  className,
  compact = false
}) => {
  const { currentLevel, settings, setFidelityLevel, updateSettings, isTransitioning } = useFidelity();

  const fidelityLevels: { value: FidelityLevel; label: string; description: string }[] = [
    {
      value: 'wireframe',
      label: 'Wireframe',
      description: 'Basic wireframe outline with no styling'
    },
    { 
      value: 'low',
      label: 'Low',
      description: 'Simple shapes with minimal effects'
    },
    { 
      value: 'medium',
      label: 'Medium',
      description: 'Balanced detail and performance'
    },
    { 
      value: 'high',
      label: 'High',
      description: 'Maximum detail with all visual effects'
    }
  ];

  if (compact) {
    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">Fidelity:</span>
          <div className="flex items-center space-x-1">
            {fidelityLevels.map((level) => (
              <Button
                key={level.value}
                variant={currentLevel === level.value ? 'default' : 'outline'}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setFidelityLevel(level.value)}
                disabled={isTransitioning}
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showLevelSelector && (
        <div>
          <h3 className="text-sm font-medium mb-3">Fidelity Level</h3>
          <div className="grid grid-cols-2 gap-2">
            {fidelityLevels.map((level) => (
              <TooltipProvider key={level.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={currentLevel === level.value ? 'default' : 'outline'}
                      className={cn(
                        "justify-between",
                        isTransitioning && "opacity-70 cursor-not-allowed"
                      )}
                      onClick={() => setFidelityLevel(level.value)}
                      disabled={isTransitioning}
                    >
                      <span>{level.label}</span>
                      {currentLevel === level.value && <CheckIcon className="h-4 w-4 ml-2" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{level.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      {showDetailControls && (
        <>
          <Separator />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">Detail Level</h4>
                <span className="text-xs text-muted-foreground">
                  {Math.round(settings.detailLevel * 100)}%
                </span>
              </div>
              <Slider
                value={[settings.detailLevel]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(value) => updateSettings({ detailLevel: value[0] })}
                disabled={isTransitioning}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Visual Effects</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.showShadows ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ showShadows: !settings.showShadows })}
                  disabled={isTransitioning}
                  className="justify-between"
                >
                  <span>Shadows</span>
                  {settings.showShadows ? (
                    <CheckIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <CircleSlash className="h-4 w-4 ml-1 opacity-70" />
                  )}
                </Button>
                
                <Button
                  variant={settings.showGradients ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ showGradients: !settings.showGradients })}
                  disabled={isTransitioning}
                  className="justify-between"
                >
                  <span>Gradients</span>
                  {settings.showGradients ? (
                    <CheckIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <CircleSlash className="h-4 w-4 ml-1 opacity-70" />
                  )}
                </Button>
                
                <Button
                  variant={settings.showTextures ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ showTextures: !settings.showTextures })}
                  disabled={isTransitioning}
                  className="justify-between"
                >
                  <span>Textures</span>
                  {settings.showTextures ? (
                    <CheckIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <CircleSlash className="h-4 w-4 ml-1 opacity-70" />
                  )}
                </Button>
                
                <Button
                  variant={settings.showAnimations ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ showAnimations: !settings.showAnimations })}
                  disabled={isTransitioning}
                  className="justify-between"
                >
                  <span>Animations</span>
                  {settings.showAnimations ? (
                    <CheckIcon className="h-4 w-4 ml-1" />
                  ) : (
                    <CircleSlash className="h-4 w-4 ml-1 opacity-70" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">Render Quality</h4>
                <span className="text-xs text-muted-foreground">
                  {Math.round(settings.renderQuality * 100)}%
                </span>
              </div>
              <Slider
                value={[settings.renderQuality]}
                min={0.5}
                max={1}
                step={0.05}
                onValueChange={(value) => updateSettings({ renderQuality: value[0] })}
                disabled={isTransitioning}
                className="w-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FidelityControls;
