
/**
 * Defines the available fidelity levels for wireframe rendering
 */
export type FidelityLevel = 'wireframe' | 'low' | 'medium' | 'high';

/**
 * Material types supported by the system
 */
export type MaterialType = 'basic' | 'flat' | 'glossy' | 'matte' | 'metallic' | 'glass' | 'textured';

/**
 * Surface treatment options
 */
export type SurfaceTreatment = 'none' | 'smooth' | 'rough' | 'bumpy' | 'engraved' | 'embossed';

export interface FidelitySettings {
  level: FidelityLevel;
  showShadows: boolean;
  showGradients: boolean;
  showTextures: boolean;
  showAnimations: boolean;
  renderQuality: number; // 0.0 - 1.0
  colorDepth: 'grayscale' | 'limited' | 'full';
  detailLevel: number; // 0.0 - 1.0
  showBorders: boolean;
  roundCorners: boolean;
  // New material system properties
  defaultMaterial: MaterialType;
  surfaceTreatment: SurfaceTreatment;
  reflectionIntensity: number; // 0.0 - 1.0
  textureResolution: 'low' | 'medium' | 'high';
  shadowSoftness: number; // 0.0 - 1.0
  shadowIntensity: number; // 0.0 - 1.0
}

/**
 * Default fidelity settings for each level
 */
export const FIDELITY_PRESETS: Record<FidelityLevel, FidelitySettings> = {
  wireframe: {
    level: 'wireframe',
    showShadows: false,
    showGradients: false,
    showTextures: false,
    showAnimations: false,
    renderQuality: 0.6,
    colorDepth: 'grayscale',
    detailLevel: 0.3,
    showBorders: true,
    roundCorners: false,
    defaultMaterial: 'basic',
    surfaceTreatment: 'none',
    reflectionIntensity: 0,
    textureResolution: 'low',
    shadowSoftness: 0,
    shadowIntensity: 0
  },
  low: {
    level: 'low',
    showShadows: false,
    showGradients: false,
    showTextures: false,
    showAnimations: false,
    renderQuality: 0.7,
    colorDepth: 'limited',
    detailLevel: 0.5,
    showBorders: true,
    roundCorners: true,
    defaultMaterial: 'flat',
    surfaceTreatment: 'smooth',
    reflectionIntensity: 0.1,
    textureResolution: 'low',
    shadowSoftness: 0.3,
    shadowIntensity: 0.2
  },
  medium: {
    level: 'medium',
    showShadows: true,
    showGradients: true,
    showTextures: false,
    showAnimations: true,
    renderQuality: 0.85,
    colorDepth: 'full',
    detailLevel: 0.75,
    showBorders: true,
    roundCorners: true,
    defaultMaterial: 'matte',
    surfaceTreatment: 'smooth',
    reflectionIntensity: 0.3,
    textureResolution: 'medium',
    shadowSoftness: 0.6,
    shadowIntensity: 0.5
  },
  high: {
    level: 'high',
    showShadows: true,
    showGradients: true,
    showTextures: true,
    showAnimations: true,
    renderQuality: 1.0,
    colorDepth: 'full',
    detailLevel: 1.0,
    showBorders: false,
    roundCorners: true,
    defaultMaterial: 'glossy',
    surfaceTreatment: 'smooth',
    reflectionIntensity: 0.7,
    textureResolution: 'high',
    shadowSoftness: 0.8,
    shadowIntensity: 0.7
  }
};

/**
 * Get specific fidelity settings with optional overrides
 */
export function getFidelitySettings(
  level: FidelityLevel, 
  overrides?: Partial<FidelitySettings>
): FidelitySettings {
  return {
    ...FIDELITY_PRESETS[level],
    ...overrides
  };
}

/**
 * Material definitions with properties for rendering
 */
export interface MaterialDefinition {
  name: string;
  type: MaterialType;
  description: string;
  reflectivity: number;
  roughness: number;
  opacity: number;
  specularHighlight: number;
  cssProperties: Record<string, string>;
  compatibleSurfaces: SurfaceTreatment[];
  performanceCost: number; // 1-10 rating of rendering cost
}

/**
 * Predefined materials available in the system
 */
export const MATERIAL_DEFINITIONS: Record<MaterialType, MaterialDefinition> = {
  basic: {
    name: "Basic",
    type: "basic",
    description: "Simple flat color with no effects",
    reflectivity: 0,
    roughness: 1,
    opacity: 1,
    specularHighlight: 0,
    cssProperties: {
      background: "var(--color-fill)",
      boxShadow: "none"
    },
    compatibleSurfaces: ["none", "smooth"],
    performanceCost: 1
  },
  flat: {
    name: "Flat",
    type: "flat",
    description: "Solid color with minimal depth",
    reflectivity: 0.05,
    roughness: 0.9,
    opacity: 1,
    specularHighlight: 0.1,
    cssProperties: {
      background: "var(--color-fill)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    },
    compatibleSurfaces: ["none", "smooth", "rough"],
    performanceCost: 2
  },
  matte: {
    name: "Matte",
    type: "matte",
    description: "Non-reflective surface with soft appearance",
    reflectivity: 0.1,
    roughness: 0.8,
    opacity: 1,
    specularHighlight: 0.2,
    cssProperties: {
      background: "var(--color-fill)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      filter: "saturate(0.95)"
    },
    compatibleSurfaces: ["smooth", "rough", "bumpy"],
    performanceCost: 3
  },
  glossy: {
    name: "Glossy",
    type: "glossy",
    description: "Smooth surface with reflective properties",
    reflectivity: 0.7,
    roughness: 0.2,
    opacity: 1,
    specularHighlight: 0.8,
    cssProperties: {
      background: "linear-gradient(135deg, color-mix(in srgb, var(--color-fill) 80%, white) 0%, var(--color-fill) 50%, color-mix(in srgb, var(--color-fill) 90%, black) 100%)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
      filter: "saturate(1.1)"
    },
    compatibleSurfaces: ["smooth"],
    performanceCost: 6
  },
  metallic: {
    name: "Metallic",
    type: "metallic",
    description: "Reflective metal-like surface",
    reflectivity: 0.9,
    roughness: 0.1,
    opacity: 1,
    specularHighlight: 0.9,
    cssProperties: {
      background: "linear-gradient(135deg, color-mix(in srgb, var(--color-fill) 60%, white) 0%, var(--color-fill) 50%, color-mix(in srgb, var(--color-fill) 70%, black) 100%)",
      boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
      filter: "contrast(1.05) saturate(0.9)"
    },
    compatibleSurfaces: ["smooth", "engraved", "embossed"],
    performanceCost: 7
  },
  glass: {
    name: "Glass",
    type: "glass",
    description: "Transparent with refraction effects",
    reflectivity: 0.5,
    roughness: 0,
    opacity: 0.7,
    specularHighlight: 0.95,
    cssProperties: {
      background: "rgba(var(--color-fill-rgb), 0.3)",
      backdropFilter: "blur(4px)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1), inset 0 0 8px rgba(255,255,255,0.2)"
    },
    compatibleSurfaces: ["smooth"],
    performanceCost: 8
  },
  textured: {
    name: "Textured",
    type: "textured",
    description: "Surface with applied texture pattern",
    reflectivity: 0.3,
    roughness: 0.7,
    opacity: 1,
    specularHighlight: 0.4,
    cssProperties: {
      background: "var(--texture-url, var(--color-fill))",
      backgroundBlendMode: "overlay",
      boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
    },
    compatibleSurfaces: ["rough", "bumpy", "engraved", "embossed"],
    performanceCost: 9
  }
};

/**
 * Surface treatment definitions that can be applied to materials
 */
export interface SurfaceTreatmentDefinition {
  name: string;
  type: SurfaceTreatment;
  description: string;
  cssProperties: Record<string, string>;
  compatibleMaterials: MaterialType[];
  performanceImpact: number; // Additional performance cost (1-10)
}

/**
 * Predefined surface treatments
 */
export const SURFACE_TREATMENTS: Record<SurfaceTreatment, SurfaceTreatmentDefinition> = {
  none: {
    name: "None",
    type: "none",
    description: "No surface treatment applied",
    cssProperties: {},
    compatibleMaterials: ["basic", "flat", "matte", "glossy", "metallic", "glass", "textured"],
    performanceImpact: 0
  },
  smooth: {
    name: "Smooth",
    type: "smooth",
    description: "Perfectly smooth surface",
    cssProperties: {
      borderRadius: "var(--radius)",
      border: "none"
    },
    compatibleMaterials: ["flat", "matte", "glossy", "metallic", "glass"],
    performanceImpact: 1
  },
  rough: {
    name: "Rough",
    type: "rough",
    description: "Slightly textured surface",
    cssProperties: {
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxmaWx0ZXIgaWQ9ImIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjM1IiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsdGVyPSJ1cmwoI2IpIiBvcGFjaXR5PSIwLjA3NSIvPjwvc3ZnPg==')",
      backgroundSize: "100px 100px"
    },
    compatibleMaterials: ["flat", "matte", "textured"],
    performanceImpact: 2
  },
  bumpy: {
    name: "Bumpy",
    type: "bumpy",
    description: "Surface with noticeable bumps",
    cssProperties: {
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGZpbHRlciBpZD0iYSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJidWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjIiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjEiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHJlc3VsdD0idHVyYnVsZW5jZSIvPjxmZURpc3BsYWNlbWVudE1hcCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJ0dXJidWxlbmNlIiBzY2FsZT0iNSIgeENoYW5uZWxTZWxlY3Rvcj0iUiIgeUNoYW5uZWxTZWxlY3Rvcj0iRyIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0idHJhbnNwYXJlbnQiLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wOCIvPjwvc3ZnPg==')",
      backgroundSize: "100px 100px"
    },
    compatibleMaterials: ["matte", "textured"],
    performanceImpact: 3
  },
  engraved: {
    name: "Engraved",
    type: "engraved",
    description: "Surface with engraved effect",
    cssProperties: {
      boxShadow: "inset 0 1px 4px rgba(0,0,0,0.2)",
      border: "1px solid rgba(0,0,0,0.08)"
    },
    compatibleMaterials: ["flat", "matte", "metallic", "textured"],
    performanceImpact: 2
  },
  embossed: {
    name: "Embossed",
    type: "embossed",
    description: "Surface with raised effect",
    cssProperties: {
      boxShadow: "0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
      border: "1px solid rgba(0,0,0,0.1)"
    },
    compatibleMaterials: ["flat", "matte", "metallic", "textured"],
    performanceImpact: 2
  }
};

/**
 * Generate CSS variables for a material and surface treatment combination
 */
export function generateMaterialStyles(
  material: MaterialType,
  surface: SurfaceTreatment,
  color: string = "#4a90e2",
  intensity: number = 1.0
): Record<string, string> {
  const materialDef = MATERIAL_DEFINITIONS[material];
  const surfaceDef = SURFACE_TREATMENTS[surface];
  
  // Calculate RGB values for CSS variables
  const colorValue = color.startsWith('#') ? color : '#4a90e2';
  const r = parseInt(colorValue.slice(1, 3), 16);
  const g = parseInt(colorValue.slice(3, 5), 16);
  const b = parseInt(colorValue.slice(5, 7), 16);
  
  // Combine properties from material and surface treatment
  const combinedStyles = {
    "--color-fill": color,
    "--color-fill-rgb": `${r}, ${g}, ${b}`,
    "--material-intensity": intensity.toString(),
    ...materialDef.cssProperties,
    ...surfaceDef.cssProperties
  };
  
  return combinedStyles;
}
