
import React from 'react';
import { 
  MaterialType, 
  SurfaceTreatment, 
  generateMaterialStyles 
} from '../fidelity/FidelityLevels';
import { cn } from '@/lib/utils';
import { useFidelity } from '../fidelity/FidelityContext';

export interface MaterialRendererProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  material?: MaterialType;
  surface?: SurfaceTreatment;
  color?: string;
  intensity?: number;
  width?: string | number;
  height?: string | number;
  isContainer?: boolean;
  darkMode?: boolean;
  textureUrl?: string;
}

/**
 * Renders content with applied material and surface treatment
 */
const MaterialRenderer: React.FC<MaterialRendererProps> = ({
  className,
  style,
  children,
  material,
  surface,
  color = '#4a90e2',
  intensity,
  width = '100%',
  height = '100%',
  isContainer = false,
  darkMode = false,
  textureUrl
}) => {
  const { settings } = useFidelity();
  
  // Use provided values or fall back to global settings
  const materialType = material || settings.defaultMaterial;
  const surfaceType = surface || settings.surfaceTreatment;
  const materialIntensity = intensity !== undefined ? intensity : 1.0;
  
  // Generate material styles
  const materialStyles = generateMaterialStyles(materialType, surfaceType, color, materialIntensity);
  
  // Add texture URL if available
  if (textureUrl && materialType === 'textured') {
    materialStyles['--texture-url'] = `url(${textureUrl})`;
  }
  
  // Adjust shadows based on fidelity settings
  const shadowsEnabled = settings.showShadows;
  if (!shadowsEnabled && materialStyles.boxShadow) {
    materialStyles.boxShadow = 'none';
  } else if (shadowsEnabled && materialStyles.boxShadow && materialStyles.boxShadow !== 'none') {
    // Adjust shadow intensity based on settings
    const shadowIntensity = settings.shadowIntensity;
    if (shadowIntensity < 1.0) {
      // Extract and adjust shadow values
      const shadows = materialStyles.boxShadow.split(',').map(shadow => {
        // Only modify shadows that have rgba values
        if (shadow.includes('rgba(')) {
          return shadow.replace(/rgba\((\d+,\s*\d+,\s*\d+),\s*([\d.]+)\)/, (match, rgb, alpha) => {
            const newAlpha = parseFloat(alpha) * shadowIntensity;
            return `rgba(${rgb}, ${newAlpha.toFixed(3)})`;
          });
        }
        return shadow;
      });
      materialStyles.boxShadow = shadows.join(',');
    }
  }
  
  // Apply additional dark mode adjustments
  if (darkMode) {
    // Invert shadows for dark mode
    if (materialStyles.boxShadow && materialStyles.boxShadow !== 'none') {
      if (materialStyles.boxShadow.includes('inset')) {
        materialStyles.boxShadow = materialStyles.boxShadow.replace(
          /rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/g, 
          'rgba(0, 0, 0, $1)'
        ).replace(
          /rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/g, 
          'rgba(255, 255, 255, $1)'
        );
      }
    }
    
    // Adjust background for dark mode
    if (materialType === 'glass') {
      materialStyles.background = `rgba(${materialStyles['--color-fill-rgb']}, 0.2)`;
      materialStyles.backdropFilter = 'blur(4px) brightness(0.8)';
    }
  }
  
  // Apply container-specific styles
  const containerStyles = isContainer ? {
    padding: '1rem',
    transition: 'all var(--fidelity-transition-duration, 300ms) ease-in-out'
  } : {};
  
  return (
    <div 
      className={cn(
        "material-renderer",
        materialType && `material-${materialType}`,
        surfaceType && `surface-${surfaceType}`,
        className
      )}
      style={{
        width,
        height,
        ...containerStyles,
        ...style,
        ...materialStyles
      }}
    >
      {children}
    </div>
  );
};

export default MaterialRenderer;
