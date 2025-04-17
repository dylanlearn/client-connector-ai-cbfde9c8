
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { 
  MaterialType,
  SurfaceTreatment,
  MATERIAL_DEFINITIONS,
  SURFACE_TREATMENTS
} from '../fidelity/FidelityLevels';
import { useFidelity } from '../fidelity/FidelityContext';
import { cn } from '@/lib/utils';

export interface MaterialControlsProps {
  className?: string;
  onMaterialChange?: (material: MaterialType) => void;
  onSurfaceChange?: (surface: SurfaceTreatment) => void;
  onReflectionChange?: (value: number) => void;
  onShadowIntensityChange?: (value: number) => void;
  compact?: boolean;
}

const MaterialControls: React.FC<MaterialControlsProps> = ({
  className,
  onMaterialChange,
  onSurfaceChange,
  onReflectionChange,
  onShadowIntensityChange,
  compact = false
}) => {
  const { settings, updateSettings } = useFidelity();
  
  const handleMaterialChange = (value: MaterialType) => {
    const newMaterial = value as MaterialType;
    
    // Update fidelity context
    updateSettings({ defaultMaterial: newMaterial });
    
    // Call the callback if provided
    if (onMaterialChange) {
      onMaterialChange(newMaterial);
    }
  };
  
  const handleSurfaceChange = (value: SurfaceTreatment) => {
    const newSurface = value as SurfaceTreatment;
    
    // Update fidelity context
    updateSettings({ surfaceTreatment: newSurface });
    
    // Call the callback if provided
    if (onSurfaceChange) {
      onSurfaceChange(newSurface);
    }
  };
  
  const handleReflectionChange = (value: number[]) => {
    const newReflection = value[0];
    
    // Update fidelity context
    updateSettings({ reflectionIntensity: newReflection });
    
    // Call the callback if provided
    if (onReflectionChange) {
      onReflectionChange(newReflection);
    }
  };
  
  const handleShadowChange = (value: number[]) => {
    const newIntensity = value[0];
    
    // Update fidelity context
    updateSettings({ shadowIntensity: newIntensity });
    
    // Call the callback if provided
    if (onShadowIntensityChange) {
      onShadowIntensityChange(newIntensity);
    }
  };

  // Filter compatible surfaces based on current material
  const currentMaterial = settings.defaultMaterial;
  const compatibleSurfaces = Object.keys(SURFACE_TREATMENTS).filter(
    surface => MATERIAL_DEFINITIONS[currentMaterial].compatibleSurfaces.includes(surface as SurfaceTreatment)
  );

  if (compact) {
    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        <div className="flex items-center space-x-2">
          <label className="text-xs font-medium flex-shrink-0">Material:</label>
          <Select value={settings.defaultMaterial} onValueChange={handleMaterialChange}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Material" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MATERIAL_DEFINITIONS).map(([value, def]) => (
                <SelectItem key={value} value={value}>
                  {def.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-xs font-medium flex-shrink-0">Surface:</label>
          <Select value={settings.surfaceTreatment} onValueChange={handleSurfaceChange}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Surface" />
            </SelectTrigger>
            <SelectContent>
              {compatibleSurfaces.map((value) => (
                <SelectItem key={value} value={value}>
                  {SURFACE_TREATMENTS[value as SurfaceTreatment].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Material</h4>
          <span className="text-xs text-muted-foreground">
            {MATERIAL_DEFINITIONS[settings.defaultMaterial].name}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(MATERIAL_DEFINITIONS).map(([type, def]) => (
            <TooltipProvider key={type}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={settings.defaultMaterial === type ? "default" : "outline"}
                    size="sm"
                    className="w-full h-16 relative overflow-hidden"
                    onClick={() => handleMaterialChange(type as MaterialType)}
                  >
                    <div 
                      className="absolute inset-2 rounded"
                      style={Object.entries(def.cssProperties).reduce((acc, [key, value]) => {
                        acc[key] = value.replace('var(--color-fill)', '#4a90e2');
                        return acc;
                      }, {} as Record<string, string>)}
                    />
                    <span className="absolute bottom-1 text-[10px] font-medium">
                      {def.name}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-medium">{def.name}</p>
                    <p>{def.description}</p>
                    <p className="mt-1 text-muted-foreground">
                      Performance cost: {def.performanceCost}/10
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Surface Treatment</h4>
          <span className="text-xs text-muted-foreground">
            {SURFACE_TREATMENTS[settings.surfaceTreatment].name}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {compatibleSurfaces.map((type) => {
            const def = SURFACE_TREATMENTS[type as SurfaceTreatment];
            return (
              <TooltipProvider key={type}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={settings.surfaceTreatment === type ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                      onClick={() => handleSurfaceChange(type as SurfaceTreatment)}
                    >
                      {def.name}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-medium">{def.name}</p>
                      <p>{def.description}</p>
                      <p className="mt-1 text-muted-foreground">
                        Performance impact: +{def.performanceImpact}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Reflection Intensity</h4>
          <span className="text-xs text-muted-foreground">
            {Math.round(settings.reflectionIntensity * 100)}%
          </span>
        </div>
        <Slider 
          value={[settings.reflectionIntensity]} 
          min={0} 
          max={1} 
          step={0.05}
          onValueChange={handleReflectionChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Shadow Intensity</h4>
          <span className="text-xs text-muted-foreground">
            {Math.round(settings.shadowIntensity * 100)}%
          </span>
        </div>
        <Slider 
          value={[settings.shadowIntensity]} 
          min={0} 
          max={1} 
          step={0.05}
          onValueChange={handleShadowChange}
        />
      </div>
    </div>
  );
};

export default MaterialControls;
