
import React from 'react';
import { MaterialType, SurfaceTreatment } from '../fidelity/FidelityLevels';
import MaterialRenderer from './MaterialRenderer';

interface MaterialSwatchProps {
  material: MaterialType;
  surface?: SurfaceTreatment;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
  label?: string;
}

const MaterialSwatch: React.FC<MaterialSwatchProps> = ({
  material,
  surface = 'glossy',
  color,
  size = 'md',
  onClick,
  selected = false,
  label
}) => {
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  return (
    <div 
      className="material-swatch"
      onClick={onClick}
    >
      <div 
        className={`
          relative rounded-md overflow-hidden cursor-pointer
          ${sizeClasses[size]} 
          ${selected ? 'ring-2 ring-primary' : 'ring-1 ring-inset ring-border'}
        `}
      >
        <MaterialRenderer
          material={material}
          surface={surface}
          color={color}
          width="100%"
          height="100%"
        />
      </div>
      {label && (
        <p className="text-xs text-center mt-1">{label}</p>
      )}
    </div>
  );
};

export default MaterialSwatch;
