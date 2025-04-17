
/**
 * Defines the available fidelity levels for wireframe rendering
 */
export type FidelityLevel = 'wireframe' | 'low' | 'medium' | 'high';

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
    roundCorners: false
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
    roundCorners: true
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
    roundCorners: true
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
    roundCorners: true
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
