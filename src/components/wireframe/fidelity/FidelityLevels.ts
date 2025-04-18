
// Defines the different fidelity levels and their associated settings

export type FidelityLevel = 'wireframe' | 'low' | 'medium' | 'high';
export type MaterialType = 'basic' | 'flat' | 'glass' | 'textured' | 'metal' | 'plastic';
export type SurfaceTreatment = 'matte' | 'glossy' | 'frosted' | 'textured';
export type WidgetRenderMode = 'outline' | 'basic' | 'detailed' | 'realistic';
export type ColorDepth = 'grayscale' | 'limited' | 'full' | 'extended';

export interface FidelitySettings {
  showShadows: boolean;
  shadowIntensity: number;
  showTextures: boolean;
  showGradients: boolean;
  renderQuality: number;
  detailLevel: number;
  defaultMaterial: MaterialType;
  surfaceTreatment: SurfaceTreatment;
  widgetRenderMode: WidgetRenderMode;
  showAnimations: boolean;
  colorDepth: ColorDepth;
  maxElementsPerView: number;
  performanceMode: boolean;
  exportResolution: number;
  antiAliasing: boolean;
}

export const FIDELITY_PRESETS: Record<FidelityLevel, FidelitySettings> = {
  wireframe: {
    showShadows: false,
    shadowIntensity: 0,
    showTextures: false,
    showGradients: false,
    renderQuality: 0.2,
    detailLevel: 0,
    defaultMaterial: 'basic',
    surfaceTreatment: 'matte',
    widgetRenderMode: 'outline',
    showAnimations: false,
    colorDepth: 'grayscale',
    maxElementsPerView: 500,
    performanceMode: true,
    exportResolution: 72,
    antiAliasing: false
  },
  low: {
    showShadows: true,
    shadowIntensity: 0.3,
    showTextures: false,
    showGradients: true,
    renderQuality: 0.4,
    detailLevel: 0.3,
    defaultMaterial: 'flat',
    surfaceTreatment: 'matte',
    widgetRenderMode: 'basic',
    showAnimations: true,
    colorDepth: 'limited',
    maxElementsPerView: 300,
    performanceMode: true,
    exportResolution: 96,
    antiAliasing: false
  },
  medium: {
    showShadows: true,
    shadowIntensity: 0.6,
    showTextures: true,
    showGradients: true,
    renderQuality: 0.7,
    detailLevel: 0.6,
    defaultMaterial: 'plastic',
    surfaceTreatment: 'glossy',
    widgetRenderMode: 'detailed',
    showAnimations: true,
    colorDepth: 'full',
    maxElementsPerView: 200,
    performanceMode: false,
    exportResolution: 150,
    antiAliasing: true
  },
  high: {
    showShadows: true,
    shadowIntensity: 1.0,
    showTextures: true,
    showGradients: true,
    renderQuality: 1.0,
    detailLevel: 1.0,
    defaultMaterial: 'glass',
    surfaceTreatment: 'glossy',
    widgetRenderMode: 'realistic',
    showAnimations: true,
    colorDepth: 'extended',
    maxElementsPerView: 100,
    performanceMode: false,
    exportResolution: 300,
    antiAliasing: true
  }
};

// Helper function to get fidelity settings with potential overrides
export const getFidelitySettings = (level: FidelityLevel, overrides?: Partial<FidelitySettings>): FidelitySettings => {
  const baseSettings = FIDELITY_PRESETS[level];
  return overrides ? { ...baseSettings, ...overrides } : baseSettings;
};

// Generate CSS-in-JS styles for materials
export const generateMaterialStyles = (
  materialType: MaterialType, 
  surface: SurfaceTreatment, 
  color: string, 
  intensity: number = 1.0
): React.CSSProperties => {
  // Helper to convert hex to RGB format
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const formattedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
    
    return result 
      ? { 
          r: parseInt(result[1], 16), 
          g: parseInt(result[2], 16), 
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgb = hexToRgb(color);
  const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  
  const baseStyles: React.CSSProperties = {
    '--color-fill-rgb': rgbStr,
    transition: 'all 0.3s ease-out',
  };

  // Apply material-specific styles
  switch (materialType) {
    case 'glass':
      return {
        ...baseStyles,
        background: `rgba(${rgbStr}, ${0.2 * intensity})`,
        backdropFilter: 'blur(8px)',
        boxShadow: `0 4px 6px rgba(0, 0, 0, ${0.1 * intensity}), 
                    0 1px 3px rgba(0, 0, 0, ${0.08 * intensity}), 
                    inset 0 0 0 1px rgba(255, 255, 255, ${0.15 * intensity})`,
        borderRadius: '4px',
      };
    
    case 'metal':
      return {
        ...baseStyles,
        background: `linear-gradient(145deg, rgba(${rgbStr}, 1), rgba(${rgbStr}, 0.85))`,
        boxShadow: `0 4px 6px rgba(0, 0, 0, ${0.12 * intensity}), 
                    0 1px 3px rgba(0, 0, 0, ${0.1 * intensity})`,
        borderRadius: '4px',
      };
    
    case 'plastic':
      return {
        ...baseStyles,
        background: color,
        boxShadow: `0 2px 4px rgba(0, 0, 0, ${0.08 * intensity})`,
        borderRadius: '4px',
      };
      
    case 'textured':
      return {
        ...baseStyles,
        background: color,
        boxShadow: `0 2px 4px rgba(0, 0, 0, ${0.08 * intensity})`,
        backgroundImage: 'var(--texture-url, none)',
        borderRadius: '4px',
      };
      
    case 'flat':
      return {
        ...baseStyles,
        background: color,
        borderRadius: '2px',
      };
      
    case 'basic':
    default:
      return {
        ...baseStyles,
        background: color,
      };
  }
};
