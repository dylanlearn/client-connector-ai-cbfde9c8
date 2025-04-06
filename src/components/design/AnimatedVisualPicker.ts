
// Type definitions for the animated visual picker
export interface DesignOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  icon?: React.ComponentType;
  preview?: string;
}

// Re-export components from the new locations
export { AnimatedVisualPicker } from './visual-picker/AnimatedVisualPicker';
export { VisualPicker } from './VisualPicker';
