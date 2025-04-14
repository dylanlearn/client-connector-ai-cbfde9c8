
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
