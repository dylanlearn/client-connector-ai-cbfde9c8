
// Define the fidelity levels for the rendering system
export type FidelityLevel = 'wireframe' | 'low' | 'medium' | 'high';

// Define material types for the material system
export type MaterialType = 'basic' | 'flat' | 'matte' | 'glossy' | 'metallic' | 'glass' | 'textured';

// Define surface treatments for the material system
export type SurfaceTreatment = 'smooth' | 'rough' | 'bumpy' | 'engraved' | 'embossed';

// Define color depth options
export type ColorDepth = 'grayscale' | 'limited' | 'full';

// Define settings for each fidelity level
export interface FidelitySettings {
  fidelityLevel: FidelityLevel;
  detailLevel: number; // 0-1
  showShadows: boolean;
  shadowIntensity: number; // 0-1
  renderQuality: number; // 0-1
  showAnimations: boolean;
  colorDepth: ColorDepth;
  defaultMaterial: MaterialType;
  surfaceTreatment: SurfaceTreatment;
  roundCorners: boolean;
}

// Presets for each fidelity level
export const FIDELITY_PRESETS: Record<FidelityLevel, FidelitySettings> = {
  wireframe: {
    fidelityLevel: 'wireframe',
    detailLevel: 0.3,
    showShadows: false,
    shadowIntensity: 0,
    renderQuality: 0.5,
    showAnimations: false,
    colorDepth: 'grayscale',
    defaultMaterial: 'basic',
    surfaceTreatment: 'smooth',
    roundCorners: false
  },
  low: {
    fidelityLevel: 'low',
    detailLevel: 0.5,
    showShadows: true,
    shadowIntensity: 0.3,
    renderQuality: 0.6,
    showAnimations: true,
    colorDepth: 'limited',
    defaultMaterial: 'flat',
    surfaceTreatment: 'smooth',
    roundCorners: true
  },
  medium: {
    fidelityLevel: 'medium',
    detailLevel: 0.8,
    showShadows: true,
    shadowIntensity: 0.7,
    renderQuality: 0.8,
    showAnimations: true,
    colorDepth: 'full',
    defaultMaterial: 'matte',
    surfaceTreatment: 'smooth',
    roundCorners: true
  },
  high: {
    fidelityLevel: 'high',
    detailLevel: 1.0,
    showShadows: true,
    shadowIntensity: 1.0,
    renderQuality: 1.0,
    showAnimations: true,
    colorDepth: 'full',
    defaultMaterial: 'glossy',
    surfaceTreatment: 'smooth',
    roundCorners: true
  }
};

// Helper function to get settings with overrides
export const getFidelitySettings = (
  level: FidelityLevel,
  overrides: Partial<FidelitySettings> = {}
): FidelitySettings => {
  return {
    ...FIDELITY_PRESETS[level],
    ...overrides
  };
};

// Material style generation function
export const generateMaterialStyles = (
  materialType: MaterialType,
  surfaceType: SurfaceTreatment,
  color: string = '#4a90e2',
  intensity: number = 1.0
): React.CSSProperties => {
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
  const baseStyles: React.CSSProperties = {
    background: color,
    borderRadius: surfaceType === 'smooth' ? 'var(--radius)' : '0px',
    transition: 'all var(--fidelity-transition-duration, 300ms) ease-in-out',
    '--color-rgb': rgbString,
    '--material-intensity': intensity.toString(),
    '--color-fill-rgb': rgbString
  } as React.CSSProperties;
  
  // Material-specific styles
  switch (materialType) {
    case 'basic':
      return {
        ...baseStyles,
        background: color
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
        background: `linear-gradient(to bottom, 
          rgba(${rgbString}, ${0.95 * intensity}) 0%, 
          rgba(${rgbString}, 1) 100%)`,
        boxShadow: `0px 2px 4px rgba(0, 0, 0, ${0.1 * intensity})`
      };
      
    case 'glossy':
      return {
        ...baseStyles,
        background: color,
        boxShadow: `
          0px 2px 8px rgba(0, 0, 0, ${0.15 * intensity}),
          inset 0px 1px 1px rgba(255, 255, 255, ${0.25 * intensity})
        `
      };
      
    case 'metallic':
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, 
          rgba(${rgbString}, 0.9) 0%, 
          rgba(${rgbString}, 1) 50%,
          rgba(${rgbString}, 0.8) 100%)`,
        boxShadow: `
          0px 3px 10px rgba(0, 0, 0, ${0.2 * intensity}),
          inset 0px 1px 1px rgba(255, 255, 255, ${0.3 * intensity})
        `
      };
      
    case 'glass':
      return {
        ...baseStyles,
        background: `rgba(${rgbString}, ${0.15 * intensity})`,
        backdropFilter: `blur(${8 * intensity}px)`,
        boxShadow: `
          0px 4px 12px rgba(0, 0, 0, ${0.1 * intensity}),
          inset 0px 1px 1px rgba(255, 255, 255, ${0.3 * intensity})
        `
      };
      
    case 'textured':
      return {
        ...baseStyles,
        backgroundImage: 'var(--texture-url)',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        boxShadow: `0px 2px 6px rgba(0, 0, 0, ${0.15 * intensity})`
      };
      
    default:
      return baseStyles;
  }
};

