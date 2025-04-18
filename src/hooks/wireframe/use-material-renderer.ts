import { useCallback, useEffect } from 'react';
import { useFidelity } from '@/components/wireframe/fidelity/FidelityContext';
import { MaterialType, SurfaceTreatment } from '@/components/wireframe/fidelity/FidelityLevels';

interface MaterialStyle {
  background?: string;
  boxShadow?: string;
  borderRadius?: string;
  border?: string;
  opacity?: number;
  filter?: string;
  backdropFilter?: string;
  transition?: string;
}

interface UseMaterialRendererOptions {
  material?: MaterialType;
  surface?: SurfaceTreatment;
  color?: string;
  intensity?: number;
  darkMode?: boolean;
}

export const useMaterialRenderer = (options: UseMaterialRendererOptions = {}) => {
  const { 
    material: materialOverride, 
    surface: surfaceOverride, 
    color = '#4a90e2',
    intensity: intensityOverride,
    darkMode = false
  } = options;
  
  const { currentLevel, settings } = useFidelity();
  
  // Generate CSS variables for the material system
  useEffect(() => {
    document.documentElement.style.setProperty('--material-transition-duration', 'var(--fidelity-transition-duration, 300ms)');
    
    return () => {
      document.documentElement.removeAttribute('style');
    };
  }, []);
  
  // Generate material styles based on fidelity level
  const getMaterialStyles = useCallback((
    materialType: MaterialType = settings.defaultMaterial,
    surfaceType: SurfaceTreatment = settings.surfaceTreatment,
    materialIntensity: number = 1.0
  ): MaterialStyle => {
    // Convert hex color to RGB for various effects
    const hexToRgb = (hex: string): {r: number, g: number, b: number} => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
      
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    };
    
    const rgb = hexToRgb(color);
    const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    
    // Base styles
    const baseStyles: MaterialStyle = {
      background: color,
      borderRadius: (surfaceType === 'smooth' && settings.roundCorners) ? 'var(--radius)' : '0px',
      transition: 'all var(--fidelity-transition-duration, 300ms) ease-in-out',
    };
    
    // Gradients - only show if fidelity settings allow it
    const materialGlossMap: Partial<Record<MaterialType, string>> = {
      matte: settings.showGradients ? 
        `linear-gradient(to bottom, rgba(${rgbString}, ${0.95 * materialIntensity}) 0%, rgba(${rgbString}, 1) 100%)` : 
        color,
      glossy: settings.showGradients ? 
        `linear-gradient(to bottom, rgba(${rgbString}, 1) 0%, rgba(${rgbString}, 0.85) 100%)` : 
        color,
      metallic: settings.showGradients ? 
        `linear-gradient(135deg, rgba(${rgbString}, 0.9) 0%, rgba(${rgbString}, 1) 50%, rgba(${rgbString}, 0.8) 100%)` : 
        color,
      glass: `rgba(${rgbString}, ${0.15 * materialIntensity})`,
      textured: color,
      metal: color,
      plastic: color
    };
    
    // Material-specific styles
    switch (materialType) {
      case 'basic':
        return {
          ...baseStyles,
          background: color,
          boxShadow: 'none'
        };
        
      case 'flat':
        return {
          ...baseStyles,
          background: color,
          boxShadow: 'none'
        };
        
      case 'matte':
        return {
          ...baseStyles,
          background: materialGlossMap.matte || color,
          boxShadow: settings.showShadows ? 
            `0px 2px 4px rgba(0, 0, 0, ${0.1 * materialIntensity * settings.shadowIntensity})` : 
            'none'
        };
        
      case 'glossy':
        return {
          ...baseStyles,
          background: materialGlossMap.glossy || color,
          boxShadow: settings.showShadows ? 
            `0px 2px 8px rgba(0, 0, 0, ${0.15 * materialIntensity * settings.shadowIntensity}), 
            inset 0px 1px 1px rgba(255, 255, 255, ${0.25 * materialIntensity})` : 
            'none'
        };
        
      case 'metallic':
        return {
          ...baseStyles,
          background: materialGlossMap.metallic || color,
          boxShadow: settings.showShadows ? 
            `0px 3px 10px rgba(0, 0, 0, ${0.2 * materialIntensity * settings.shadowIntensity}),
            inset 0px 1px 1px rgba(255, 255, 255, ${0.3 * materialIntensity})` : 
            'none'
        };
        
      case 'glass':
        return {
          ...baseStyles,
          background: materialGlossMap.glass,
          backdropFilter: settings.showTextures ? `blur(${8 * materialIntensity}px)` : 'none',
          boxShadow: settings.showShadows ? 
            `0px 4px 12px rgba(0, 0, 0, ${0.1 * materialIntensity * settings.shadowIntensity}),
            inset 0px 1px 1px rgba(255, 255, 255, ${0.3 * materialIntensity})` : 
            'none'
        };
        
      case 'textured':
        return {
          ...baseStyles,
          background: color,
          boxShadow: settings.showShadows ? 
            `0px 2px 6px rgba(0, 0, 0, ${0.15 * materialIntensity * settings.shadowIntensity})` : 
            'none'
        };
        
      default:
        return baseStyles;
    }
  }, [color, settings]);
  
  // Apply surface treatment styles
  const getSurfaceTreatmentStyles = useCallback((
    surface: SurfaceTreatment,
    intensity: number = 1.0
  ): MaterialStyle => {
    if (surface === 'smooth') {
      return {};
    }
    
    // Surface treatment styles
    const surfaceTreatments: Record<SurfaceTreatment, MaterialStyle> = {
      smooth: {},
      rough: {
        filter: `contrast(${0.95 * intensity}) brightness(${0.98 * intensity})`
      },
      bumpy: {
        filter: `contrast(${1.05 * intensity})`
      },
      engraved: {
        boxShadow: settings.showShadows ? 
          `inset 0 1px 3px rgba(0,0,0,${0.2 * intensity * settings.shadowIntensity})` : 
          'none'
      },
      embossed: {
        boxShadow: settings.showShadows ? 
          `0 1px 2px rgba(255,255,255,${0.3 * intensity}), 
          inset 0 1px 1px rgba(0,0,0,${0.15 * intensity * settings.shadowIntensity})` : 
          'none'
      },
      matte: {
        filter: `contrast(${0.95 * intensity}) brightness(${0.98 * intensity})`
      },
      glossy: {
        filter: `contrast(${1.05 * intensity})`
      },
      textured: {
        filter: `contrast(${0.95 * intensity}) brightness(${0.98 * intensity})`
      },
      frosted: {
        filter: `contrast(${0.95 * intensity}) brightness(${0.98 * intensity})`
      }
    };
    
    return surfaceTreatments[surface] || {};
  }, [settings]);
  
  // Apply border styles based on fidelity level
  const getBorderStyles = useCallback((
    wireframeMode: boolean = currentLevel === 'wireframe'
  ): MaterialStyle => {
    if (wireframeMode && settings.showBorders) {
      return {
        border: '1px solid rgba(0, 0, 0, 0.2)',
        background: 'transparent'
      };
    }
    
    if (currentLevel === 'low' && settings.showBorders) {
      return {
        border: '1px solid rgba(0, 0, 0, 0.1)'
      };
    }
    
    if (currentLevel === 'medium' && settings.showBorders) {
      return {
        border: '1px solid rgba(0, 0, 0, 0.05)'
      };
    }
    
    return {};
  }, [currentLevel, settings]);
  
  // Combine all style effects
  const generateStyles = useCallback(() => {
    const material = materialOverride || settings.defaultMaterial;
    const surface = surfaceOverride || settings.surfaceTreatment;
    const intensity = intensityOverride !== undefined ? intensityOverride : 1.0;
    
    // Get all style components
    const materialStyles = getMaterialStyles(material, surface, intensity);
    const surfaceStyles = getSurfaceTreatmentStyles(surface, intensity);
    const borderStyles = getBorderStyles();
    
    // Apply dark mode adjustments if needed
    const darkModeAdjustments: MaterialStyle = darkMode ? {
      filter: `brightness(0.8) ${materialStyles.filter || ''}`,
      boxShadow: materialStyles.boxShadow ? 
        materialStyles.boxShadow.replace(/rgba\(0,\s*0,\s*0/g, 'rgba(0, 0, 0') : 
        undefined
    } : {};
    
    // Combine all styles
    return {
      ...materialStyles,
      ...surfaceStyles,
      ...borderStyles,
      ...(darkMode ? darkModeAdjustments : {})
    };
  }, [
    currentLevel, 
    settings,
    materialOverride,
    surfaceOverride,
    intensityOverride,
    darkMode,
    getMaterialStyles,
    getSurfaceTreatmentStyles,
    getBorderStyles
  ]);
  
  return {
    currentLevel,
    settings,
    generateStyles,
    getMaterialStyles,
    getSurfaceTreatmentStyles
  };
};

export default useMaterialRenderer;
