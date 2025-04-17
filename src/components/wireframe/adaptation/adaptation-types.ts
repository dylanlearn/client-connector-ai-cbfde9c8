
import { ReactNode } from 'react';

/**
 * Size range thresholds for adaptive components
 */
export interface SizeThresholds {
  compact: number; // Maximum width for compact mode
  normal: number;  // Width between compact and expanded mode
  expanded: number; // Minimum width for expanded mode
}

/**
 * Available adaptive transformations
 */
export type AdaptiveTransformation = 
  | 'hide'          // Hide the element completely
  | 'collapse'      // Collapse to minimal representation
  | 'truncate'      // Truncate text content
  | 'stack'         // Stack elements vertically
  | 'resize'        // Resize element proportionally
  | 'reposition'    // Change position/alignment
  | 'simplify'      // Remove non-essential content
  | 'combine'       // Combine related elements
  | 'prioritize';   // Show only high-priority elements

/**
 * Space context information for adaptive decisions
 */
export interface SpaceContext {
  containerWidth: number;
  containerHeight: number;
  availableWidth: number;
  availableHeight: number;
  adaptiveState: 'compact' | 'normal' | 'expanded';
  siblingCount?: number;
  containerType?: string;
  isOverflowing?: boolean;
}

/**
 * Rules for adaptive behavior
 */
export interface AdaptiveRules {
  // When to apply transformations based on available space
  thresholds?: {
    compact: number;  // px threshold for compact mode
    expanded: number; // px threshold for expanded mode
  };
  
  // Element-specific transformations
  transformations?: {
    [key: string]: {
      compact?: AdaptiveTransformation[];
      normal?: AdaptiveTransformation[];
      expanded?: AdaptiveTransformation[];
    };
  };
  
  // Custom priorities for elements (higher = more important)
  priorities?: {
    [key: string]: number;
  };

  // Space allocation rules
  spaceAllocation?: {
    minSpacing?: number;        // Minimum spacing between elements
    growthDistribution?: 'even' | 'proportional' | 'priority';
    preserveAspectRatio?: boolean;
  };
  
  // Responsive behavior
  responsive?: {
    mobileLayout?: 'stack' | 'grid' | 'hidden';
    tabletLayout?: 'stack' | 'grid' | 'default';
    reorderElements?: boolean;
  };

  // Content adaptation
  content?: {
    truncateText?: boolean;
    maxLines?: number;
    imageScaling?: 'contain' | 'cover' | 'none';
    iconBehavior?: 'keep' | 'hideWithText' | 'replaceText';
  };
}

/**
 * Props for adaptive elements
 */
export interface AdaptiveElementProps {
  children: ReactNode;
  adaptivePriority?: number; // Higher = more important
  adaptiveId?: string;       // ID for specific rules targeting
  adaptiveType?: string;     // Element type for rule application
  compact?: ReactNode;       // Alternative compact rendering
  expanded?: ReactNode;      // Alternative expanded rendering
  minWidth?: number;         // Minimum width before adapting
  preserveOnCompact?: boolean; // Whether to preserve this element in compact mode
  hideOnCompact?: boolean;    // Whether to hide in compact mode
  stackOnCompact?: boolean;   // Whether to stack vertically in compact mode
  truncateOnCompact?: boolean; // Whether to truncate text in compact mode
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Adaptation context provided to child components
 */
export interface AdaptationContext {
  containerSize: { width: number; height: number };
  adaptiveState: 'compact' | 'normal' | 'expanded';
  availableSpace: { width: number; height: number };
  siblingCount: number;
  registerElement: (id: string, priority: number) => void;
  unregisterElement: (id: string) => void;
  updateElementPriority: (id: string, priority: number) => void;
}
