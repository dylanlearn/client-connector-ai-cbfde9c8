import React, { ReactNode, Children, isValidElement, cloneElement } from 'react';
import { AdaptiveRules, AdaptiveElementProps } from './adaptation-types';

/**
 * Apply adaptive rules to child elements based on container size and context
 */
export function applyAdaptiveRules(
  children: ReactNode,
  containerSize: { width: number; height: number },
  adaptiveState: 'compact' | 'normal' | 'expanded',
  rules: AdaptiveRules
): ReactNode {
  // If no children or container not measured yet, return as is
  if (!children || containerSize.width === 0) {
    return children;
  }

  // Apply rules to each child
  return Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }

    // Get adaptive props if they exist
    const adaptiveProps = child.props as AdaptiveElementProps;
    const adaptiveId = adaptiveProps.adaptiveId;
    const adaptivePriority = adaptiveProps.adaptivePriority || 0;
    
    // Check if we have specific rules for this element
    const transformations = rules.transformations?.[adaptiveId || ''] || {};
    const currentTransformations = transformations[adaptiveState] || [];

    // Apply transformations based on current state and rules
    let adaptedChild = child;

    // Use compact/expanded alternative if provided and appropriate
    if (adaptiveState === 'compact' && adaptiveProps.compact) {
      return adaptiveProps.compact;
    } else if (adaptiveState === 'expanded' && adaptiveProps.expanded) {
      return adaptiveProps.expanded;
    }

    // Apply hide transformation
    if (
      currentTransformations.includes('hide') ||
      (adaptiveState === 'compact' && adaptiveProps.hideOnCompact)
    ) {
      return null;
    }

    // Apply additional class names based on adaptive state
    const adaptiveClassNames = [
      adaptiveState === 'compact' && 'adaptive-compact',
      adaptiveState === 'normal' && 'adaptive-normal',
      adaptiveState === 'expanded' && 'adaptive-expanded',
      adaptiveProps.stackOnCompact && adaptiveState === 'compact' && 'flex flex-col',
      adaptiveProps.truncateOnCompact && adaptiveState === 'compact' && 'truncate'
    ].filter(Boolean).join(' ');
    
    // Apply adaptive styles
    let adaptiveStyles: React.CSSProperties = {};
    
    // Apply min-width if specified
    if (adaptiveProps.minWidth) {
      adaptiveStyles.minWidth = adaptiveProps.minWidth;
    }

    // Create props for adapted child
    const adaptedProps = {
      ...adaptiveProps,
      className: `${adaptiveProps.className || ''} ${adaptiveClassNames}`.trim(),
      style: { ...adaptiveProps.style, ...adaptiveStyles },
      'data-adaptive-state': adaptiveState,
      'data-adaptive-priority': adaptivePriority
    };

    // Apply props to child
    adaptedChild = cloneElement(child, adaptedProps);

    // If the child has children, recursively apply rules to them
    if (child.props.children) {
      const adaptedGrandchildren = applyAdaptiveRules(
        child.props.children,
        containerSize,
        adaptiveState,
        rules
      );

      // Clone child again with adapted grandchildren
      adaptedChild = cloneElement(adaptedChild, {
        ...adaptedChild.props,
        children: adaptedGrandchildren
      });
    }

    return adaptedChild;
  });
}

/**
 * Calculate space distribution based on priorities
 */
export function calculateSpaceDistribution(
  totalSpace: number,
  elements: Array<{ id: string; priority: number; minSpace: number }>,
  rules: AdaptiveRules
): Record<string, number> {
  const distribution: Record<string, number> = {};
  const distributionMode = rules.spaceAllocation?.growthDistribution || 'even';
  const totalElements = elements.length;
  
  // Calculate total priority value
  const totalPriority = elements.reduce((acc, elem) => acc + elem.priority, 0);
  
  // Calculate total minimum space required
  const totalMinSpace = elements.reduce((acc, elem) => acc + elem.minSpace, 0);
  
  // Calculate remaining space after minimum allocation
  const remainingSpace = Math.max(0, totalSpace - totalMinSpace);
  
  elements.forEach(element => {
    let allocatedSpace = element.minSpace;
    
    // Distribute remaining space based on distribution mode
    if (remainingSpace > 0) {
      switch (distributionMode) {
        case 'even':
          allocatedSpace += remainingSpace / totalElements;
          break;
        case 'proportional':
          allocatedSpace += element.minSpace / totalMinSpace * remainingSpace;
          break;
        case 'priority':
          allocatedSpace += (totalPriority > 0 ? 
            (element.priority / totalPriority) * remainingSpace : 
            remainingSpace / totalElements);
          break;
      }
    }
    
    distribution[element.id] = Math.floor(allocatedSpace);
  });
  
  return distribution;
}

/**
 * Calculate adaptive layout for elements based on container size
 */
export function calculateAdaptiveLayout(
  containerWidth: number,
  containerHeight: number,
  elements: React.ReactElement[],
  rules: AdaptiveRules
): { layout: 'grid' | 'stack' | 'row'; columns?: number } {
  // Default to row layout
  let layout: 'grid' | 'stack' | 'row' = 'row';
  let columns = 1;
  
  // Determine optimal layout based on container width and element count
  const elementCount = elements.length;
  
  if (containerWidth < 400) {
    // For small containers, stack elements vertically
    layout = 'stack';
  } else if (containerWidth < 768) {
    // For medium containers, use grid if there are many elements
    if (elementCount > 3) {
      layout = 'grid';
      columns = 2;
    } else {
      // Otherwise use row layout
      layout = 'row';
    }
  } else {
    // For large containers, use grid for many elements
    if (elementCount > 6) {
      layout = 'grid';
      columns = 3;
    } else if (elementCount > 3) {
      layout = 'grid';
      columns = 2;
    } else {
      layout = 'row';
    }
  }
  
  // Apply custom responsive rules if provided
  if (containerWidth < 480 && rules.responsive?.mobileLayout) {
    if (rules.responsive.mobileLayout === 'stack') layout = 'stack';
    else if (rules.responsive.mobileLayout === 'grid') {
      layout = 'grid';
      columns = 2;
    }
    else if (rules.responsive.mobileLayout === 'hidden') {
      // Return special case for hidden layout
      return { layout: 'stack', columns: 0 };
    }
  } else if (containerWidth < 768 && rules.responsive?.tabletLayout) {
    if (rules.responsive.tabletLayout === 'stack') layout = 'stack';
    else if (rules.responsive.tabletLayout === 'grid') {
      layout = 'grid';
      columns = 2;
    }
  }
  
  return { layout, columns };
}
