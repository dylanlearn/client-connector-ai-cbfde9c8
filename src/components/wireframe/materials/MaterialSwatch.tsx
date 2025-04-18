
import React from 'react';
import { cn } from '@/lib/utils';
import { MaterialType, SurfaceTreatment, generateMaterialStyles } from '../fidelity/FidelityLevels';

interface MaterialSwatchProps {
  material: MaterialType;
  surface?: SurfaceTreatment;
  color?: string;
  intensity?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

const MaterialSwatch: React.FC<MaterialSwatchProps> = ({
  material,
  surface = 'smooth',
  color = '#4a90e2',
  intensity = 1,
  size = 'md',
  className,
  onClick,
  selected = false
}) => {
  // Generate material styles
  const materialStyles = generateMaterialStyles(
    material,
    surface,
    color,
    intensity
  );
  
  // Determine swatch size
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <div 
      className={cn(
        "material-swatch rounded-md border transition-all cursor-pointer",
        sizeClasses[size],
        selected && "ring-2 ring-primary ring-offset-2",
        className
      )}
      style={materialStyles}
      onClick={onClick}
    />
  );
};

export default MaterialSwatch;
