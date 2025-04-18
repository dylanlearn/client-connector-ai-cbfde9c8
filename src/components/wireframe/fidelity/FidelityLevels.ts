
import React from 'react';
import { Properties } from 'csstype';

// Define material and surface treatment types
export type MaterialType =
  | 'basic'
  | 'flat'
  | 'matte'
  | 'glossy'
  | 'metallic'
  | 'glass'
  | 'textured'
  | 'metal'    // Added to support existing code
  | 'plastic'; // Added to support existing code

export type SurfaceTreatment =
  | 'smooth'
  | 'rough'
  | 'bumpy'
  | 'engraved'
  | 'embossed'
  | 'matte'    // Added to support existing code
  | 'glossy'   // Added to support existing code
  | 'frosted'  // Added to support existing code
  | 'textured'; // Added to support existing code

// Define fidelity levels
export type FidelityLevel = 'wireframe' | 'low' | 'medium' | 'high';

export interface FidelitySettings {
  level: FidelityLevel;
  transitionDuration: number;
  showShadows: boolean;
  shadowIntensity: number;
  defaultMaterial: MaterialType;
  surfaceTreatment: SurfaceTreatment;
  // Additional properties needed by current implementation
  detailLevel?: number;
  renderQuality?: number;
  colorDepth?: number;
  showAnimations?: boolean;
  exportResolution?: number;
  performanceMode?: boolean;
  maxElementsPerView?: number;
  antiAliasing?: boolean;
  showBorders?: boolean;
  roundCorners?: boolean;
  showTextures?: boolean;
  showGradients?: boolean;
}

// Define default presets for fidelity levels
export const FIDELITY_PRESETS: Record<FidelityLevel, FidelitySettings> = {
  wireframe: {
    level: 'wireframe',
    transitionDuration: 0,
    showShadows: false,
    shadowIntensity: 0,
    defaultMaterial: 'basic',
    surfaceTreatment: 'smooth',
    detailLevel: 0,
    renderQuality: 0.2,
    colorDepth: 1,
    showAnimations: false,
    showTextures: false,
    showGradients: false
  },
  low: {
    level: 'low',
    transitionDuration: 150,
    showShadows: true,
    shadowIntensity: 0.3,
    defaultMaterial: 'flat',
    surfaceTreatment: 'smooth',
    detailLevel: 0.3,
    renderQuality: 0.5,
    colorDepth: 2,
    showAnimations: false,
    showTextures: false,
    showGradients: true
  },
  medium: {
    level: 'medium',
    transitionDuration: 300,
    showShadows: true,
    shadowIntensity: 0.6,
    defaultMaterial: 'matte',
    surfaceTreatment: 'smooth',
    detailLevel: 0.7,
    renderQuality: 0.8,
    colorDepth: 3,
    showAnimations: true,
    showTextures: true,
    showGradients: true
  },
  high: {
    level: 'high',
    transitionDuration: 500,
    showShadows: true,
    shadowIntensity: 0.8,
    defaultMaterial: 'glossy',
    surfaceTreatment: 'smooth',
    detailLevel: 1.0,
    renderQuality: 1.0,
    colorDepth: 4,
    showAnimations: true,
    showBorders: true,
    roundCorners: true,
    showTextures: true,
    showGradients: true
  }
};

// Utility function to merge custom settings with presets
export function getFidelitySettings(
  level: FidelityLevel,
  customSettings: Partial<FidelitySettings> = {}
): FidelitySettings {
  return { ...FIDELITY_PRESETS[level], ...customSettings };
}

// Utility function to convert hex to RGB
const getRgbFromHex = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);

  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
};

export interface MaterialStyle {
  background?: string;
  boxShadow?: string;
  border?: string;
  opacity?: number;
  filter?: string;
  backdropFilter?: string;
  // Add other CSS properties as needed
}

export const generateMaterialStyles = (
  material: MaterialType,
  surface: SurfaceTreatment,
  color: string,
  intensity: number = 1.0
): React.CSSProperties => {
  const colorRgb = getRgbFromHex(color);
  const alpha = intensity.toFixed(2);

  const baseShadow = `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)`;
  const insetShadow = `inset 0 2px 4px rgba(0,0,0,0.05)`;

  let materialStyles: React.CSSProperties = {};

  switch (material) {
    case 'basic':
      materialStyles = {
        background: color,
        color: 'white'
      };
      break;

    case 'flat':
      materialStyles = {
        background: color,
        color: 'white',
        boxShadow: 'none'
      };
      break;

    case 'matte':
    case 'metal': // Map metal to matte for compatibility
      materialStyles = {
        background: color,
        color: 'white',
        boxShadow: baseShadow
      };
      break;

    case 'glossy':
    case 'plastic': // Map plastic to glossy for compatibility
      materialStyles = {
        background: `linear-gradient(135deg, rgba(${colorRgb}, ${alpha}) 0%, rgba(${colorRgb}, ${alpha}) 70%, rgba(255,255,255,0.3) 100%)`,
        color: 'white',
        boxShadow: `0 4px 8px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2)`
      };
      break;

    case 'metallic':
      materialStyles = {
        background: `linear-gradient(135deg, rgba(${colorRgb}, ${alpha}) 0%, rgba(${colorRgb}, ${alpha}) 70%, rgba(255,255,255,0.3) 100%)`,
        color: 'white',
        boxShadow: `0 4px 8px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.2)`
      };
      break;

    case 'glass':
      materialStyles = {
        background: `rgba(${colorRgb}, 0.3)`,
        color: 'white',
        backdropFilter: 'blur(10px)',
        boxShadow: baseShadow
      };
      break;

    case 'textured':
      materialStyles = {
        background: `url(var(--texture-url))`,
        backgroundSize: 'cover',
        color: 'white',
        boxShadow: baseShadow
      };
      break;

    default:
      materialStyles = {
        background: color,
        color: 'white'
      };
      break;
  }

  switch (surface) {
    case 'smooth':
    case 'matte': // Map matte surface to smooth for compatibility
      break;

    case 'rough':
    case 'frosted': // Map frosted to rough for compatibility
      materialStyles.opacity = 0.9;
      break;

    case 'bumpy':
      materialStyles.boxShadow = insetShadow;
      break;

    case 'engraved':
      materialStyles.boxShadow = insetShadow;
      break;

    case 'embossed':
      materialStyles.boxShadow = baseShadow;
      break;

    case 'glossy':
    case 'textured': // Handle textured surface for compatibility
      // No additional styles for these surface treatments
      break;

    default:
      break;
  }

  // Add CSS variables using type assertion
  const styleWithVariables = {
    ...materialStyles,
    '--color-fill-rgb': getRgbFromHex(color),
    '--color-fill': color
  } as React.CSSProperties;

  return styleWithVariables;
};
