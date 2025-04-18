
import { useState, useCallback } from 'react';

export type FidelityLevel = 'low' | 'medium' | 'high';
export type MaterialType = 'basic' | 'flat' | 'matte' | 'glossy' | 'metallic' | 'glass' | 'textured' | 'metal' | 'plastic';
export type SurfaceTreatment = 'smooth' | 'rough' | 'bumpy' | 'engraved' | 'embossed' | 'matte' | 'glossy' | 'textured' | 'frosted';

export interface MaterialStyle {
  backgroundColor?: string;
  color?: string;
  border?: string;
  boxShadow?: string;
  filter?: string;
  // Add other style properties as needed
}

export interface UseFidelityRendererOptions {
  initialFidelity?: FidelityLevel;
  initialMaterial?: MaterialType;
  initialSurface?: SurfaceTreatment;
  initialColor?: string;
  initialIntensity?: number;
}

export function useFidelityRenderer(options: UseFidelityRendererOptions = {}) {
  const {
    initialFidelity = 'medium',
    initialMaterial = 'flat',
    initialSurface = 'smooth',
    initialColor = '#4a90e2',
    initialIntensity = 1
  } = options;
  
  const [fidelity, setFidelity] = useState<FidelityLevel>(initialFidelity);
  const [material, setMaterial] = useState<MaterialType>(initialMaterial);
  const [surface, setSurface] = useState<SurfaceTreatment>(initialSurface);
  const [color, setColor] = useState<string>(initialColor);
  const [intensity, setIntensity] = useState<number>(initialIntensity);
  
  // Fidelity level styles
  const fidelityStyles: Record<FidelityLevel, React.CSSProperties> = {
    low: {
      border: '1px solid #ccc',
      backgroundColor: '#eee'
    },
    medium: {
      border: '1px solid #999',
      backgroundColor: '#ddd'
    },
    high: {
      border: '1px solid #666',
      backgroundColor: '#ccc'
    }
  };
  
  // Material gloss maps
  const materialGlossMap: Partial<Record<MaterialType, string>> = {
    matte: 'matte',
    glossy: 'glossy',
    metallic: 'metallic',
    glass: 'glass',
    textured: 'textured',
    metal: 'metal',
    plastic: 'plastic'
  };
  
  // Surface treatments
  const surfaceTreatments: Record<SurfaceTreatment, MaterialStyle> = {
    smooth: {},
    rough: {
      filter: 'blur(1px)'
    },
    bumpy: {
      filter: 'blur(2px)'
    },
    engraved: {
      boxShadow: 'inset 0px 0px 5px rgba(0,0,0,0.6)'
    },
    embossed: {
      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
    },
    matte: {},
    glossy: {},
    textured: {},
    frosted: {}
  };
  
  // Generate material styles
  const generateMaterialStyles = useCallback((
    materialType: MaterialType,
    surfaceTreatment: SurfaceTreatment,
    baseColor: string,
    lightIntensity: number
  ): MaterialStyle => {
    let styles: MaterialStyle = {};
    
    // Apply base color
    styles.backgroundColor = baseColor;
    styles.color = baseColor;
    
    // Apply gloss
    const gloss = materialGlossMap[materialType];
    if (gloss === 'glossy') {
      styles.boxShadow = `0 0 10px ${baseColor}`;
    } else if (gloss === 'metallic') {
      styles.border = `1px solid ${baseColor}`;
    } else if (gloss === 'glass') {
      styles.backgroundColor = 'transparent';
      styles.border = `1px solid ${baseColor}`;
    }
    
    // Apply surface treatment
    const surfaceStyle = surfaceTreatments[surfaceTreatment];
    if (surfaceStyle) {
      styles = { ...styles, ...surfaceStyle };
    }
    
    // Apply light intensity
    if (lightIntensity > 1) {
      styles.boxShadow = `0 0 ${lightIntensity}px ${baseColor}`;
    }
    
    return styles;
  }, [materialGlossMap, surfaceTreatments]);
  
  return {
    fidelity,
    material,
    surface,
    color,
    intensity,
    setFidelity,
    setMaterial,
    setSurface,
    setColor,
    setIntensity,
    fidelityStyles,
    generateMaterialStyles
  };
}
