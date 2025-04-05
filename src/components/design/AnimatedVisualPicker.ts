
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

// Re-export VisualPicker from the new location
export { default } from './VisualPicker';
