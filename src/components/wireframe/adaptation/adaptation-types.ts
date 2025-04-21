
import { ReactNode } from 'react';

/**
 * Properties for adaptive elements that can change their appearance based on container size
 */
export interface AdaptiveElementProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content to render
   */
  children: ReactNode;
  
  /**
   * Priority level for adaptive decisions (higher priority elements maintain their size longer)
   */
  adaptivePriority?: number;
  
  /**
   * Unique identifier for the adaptive element
   */
  adaptiveId?: string;
  
  /**
   * Type of adaptive element for classification purposes
   */
  adaptiveType?: 'text' | 'image' | 'button' | 'container' | 'form' | string;
  
  /**
   * Compact version of the element to render in small containers
   */
  compact?: ReactNode;
  
  /**
   * Expanded version of the element to render in larger containers
   */
  expanded?: ReactNode;
  
  /**
   * Minimum width before switching to compact mode
   */
  minWidth?: number;
  
  /**
   * If true, element should be preserved even in compact views
   */
  preserveOnCompact?: boolean;
  
  /**
   * If true, element will be hidden in compact views
   */
  hideOnCompact?: boolean;
  
  /**
   * If true, element will change from horizontal to vertical layout in compact views
   */
  stackOnCompact?: boolean;
  
  /**
   * If true, text content will be truncated in compact views
   */
  truncateOnCompact?: boolean;
}

/**
 * Configuration for the adaptive container system
 */
export interface AdaptiveContainerConfig {
  /**
   * Breakpoint thresholds in pixels
   */
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  
  /**
   * Default adaptive behavior
   */
  defaultBehavior: {
    hideNonEssential: boolean;
    stackItems: boolean;
    reduceSpacing: boolean;
    truncateText: boolean;
  };
  
  /**
   * Types of elements to prioritize in compact views
   */
  priorityElements: string[];
}
