
// Type definitions for the animated visual picker
export interface DesignOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  icon?: React.ComponentType;
  preview?: string;
  // Add optional properties to fix type errors
  colorScheme?: Record<string, string>;
  typography?: {
    headings: string;
    body: string;
  };
  layoutStyle?: string;
  toneDescriptor?: string;
}

// Re-export components from the new locations
export { default as AnimatedVisualPicker } from './visual-picker/AnimatedVisualPicker';
export { VisualPicker } from './VisualPicker';
