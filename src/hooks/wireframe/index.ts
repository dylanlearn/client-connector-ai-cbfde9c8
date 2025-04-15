// Core hook exports
export { useConsolidatedWireframe } from '../use-consolidated-wireframe';

// Utility hooks (keeping for backward compatibility)
export { useWireframeGenerator } from './use-wireframe-generator';
export { useWireframeVariations } from './use-wireframe-variations';

// Hook types
export type { UseConsolidatedWireframeOptions } from '../use-consolidated-wireframe';

// Export our main wireframe hook
export { useWireframe, type UseWireframeOptions } from '@/hooks/useWireframe';

// Export legacy hooks for backward compatibility
export { useAdvancedWireframe } from '@/hooks/use-enhanced-wireframe';

// Export other wireframe-related hooks that are still useful
export { default as useCanvasHistory } from './use-canvas-history';
export { useEnhancedCanvasEngine } from './use-enhanced-canvas-engine';
export { useWireframeEditor } from './use-wireframe-editor';
export { useWireframeHistory } from './use-wireframe-history';
export { useWireframeSections } from './use-wireframe-sections';
