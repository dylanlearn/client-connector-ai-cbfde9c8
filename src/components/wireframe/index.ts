
// Main components
export { default as WireframeEditor } from './WireframeEditor';
export { default as Wireframe } from './Wireframe';
export { default as WireframeCanvas } from './editor/WireframeCanvas';
export { default as WireframeVisualizer } from './WireframeVisualizer';

// Editor components
export { default as WireframeToolbar } from './editor/WireframeToolbar';
export { default as WireframeControls } from './editor/WireframeControls';
export { default as WireframeSidebar } from './editor/WireframeSidebar';

// Specialized components
export { default as EnhancedWireframeStudio } from './EnhancedWireframeStudio';
export { default as AdvancedWireframeGenerator } from './AdvancedWireframeGenerator';

// Common UI
export { default as ErrorDisplay } from './common/ErrorDisplay';

// Export types from hooks for better integration
export type { UseWireframeOptions } from '@/hooks/useWireframe';
