
import { ReactNode } from 'react';

// Context information about available space
export interface SpaceContext {
  containerWidth: number;
  containerHeight: number;
  availableWidth: number;
  availableHeight: number;
  adaptiveState: 'compact' | 'normal' | 'expanded';
}

// Rules for how components should adapt based on context
export interface AdaptiveRules {
  breakpoints?: {
    compact?: number;
    expanded?: number;
  };
  transformations?: {
    [elementType: string]: {
      compact?: string[];
      normal?: string[];
      expanded?: string[];
    };
  };
  responsive?: {
    mobileLayout?: 'stack' | 'grid' | 'row';
    desktopLayout?: 'grid' | 'row';
    tabletColumns?: number;
  };
}

// Props for AdaptiveContainer component
export interface AdaptiveContainerProps {
  children: ReactNode;
  className?: string;
  adaptiveRules?: AdaptiveRules;
  minWidth?: number;
  maxWidth?: number;
  preserveHeight?: boolean;
  debug?: boolean;
  style?: React.CSSProperties;
  id?: string;
}

// Props for AdaptiveLayout component
export interface AdaptiveLayoutProps {
  children: ReactNode;
  className?: string;
  adaptiveRules?: AdaptiveRules;
  minColumns?: number;
  maxColumns?: number;
  gap?: number | string;
  debug?: boolean;
  style?: React.CSSProperties;
}
