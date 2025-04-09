
import { WireframeSection } from '@/types/wireframe';
import { DeviceType } from './responsive-utils';

// Define the ResponsiveLayoutSettings type
export interface ResponsiveLayoutSettings {
  layout: 'flex' | 'grid' | 'stack' | 'columns';
  alignItems: 'start' | 'center' | 'end' | 'stretch';
  justifyContent: 'start' | 'center' | 'end' | 'between' | 'around';
  columns?: number;
  gap?: number;
  wrap?: boolean;
  autoRows?: boolean;
  rowHeight?: number | string;
}

// Define the AdaptiveWireframeSection type
export interface AdaptiveWireframeSection extends WireframeSection {
  responsive?: {
    [key in DeviceType]?: {
      layout?: Partial<ResponsiveLayoutSettings>;
      visible?: boolean;
      content?: any;
      styles?: Record<string, any>;
    };
  };
}
