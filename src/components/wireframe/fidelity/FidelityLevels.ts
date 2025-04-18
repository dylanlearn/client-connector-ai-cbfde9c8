import React from 'react';
import { Properties } from 'csstype';

export type MaterialType =
  | 'basic'
  | 'flat'
  | 'matte'
  | 'glossy'
  | 'metallic'
  | 'glass'
  | 'textured';

export type SurfaceTreatment =
  | 'smooth'
  | 'rough'
  | 'bumpy'
  | 'engraved'
  | 'embossed';

export interface FidelitySettings {
  level: 'low' | 'medium' | 'high';
  transitionDuration: number;
  showShadows: boolean;
  shadowIntensity: number;
  defaultMaterial: MaterialType;
  surfaceTreatment: SurfaceTreatment;
}

export interface MaterialStyle {
  background?: string;
  boxShadow?: string;
  border?: string;
  opacity?: number;
  // Add other CSS properties as needed
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
      materialStyles = {
        background: color,
        color: 'white',
        boxShadow: baseShadow
      };
      break;

    case 'glossy':
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
      break;

    case 'rough':
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

    default:
      break;
  }

  // Properly type the CSS variable as a valid CSSProperties
  materialStyles = {
    ...materialStyles,
    '--color-fill-rgb': getRgbFromHex(color),
    '--color-fill': color
  };

  return materialStyles;
};
