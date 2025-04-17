
import React, { ReactNode } from 'react';
import { AdaptiveRules, SpaceContext } from './adaptation-types';

/**
 * Apply adaptive rules to children based on container size and context
 */
export function applyAdaptiveRules(
  children: ReactNode,
  containerSize: { width: number; height: number },
  adaptiveState: 'compact' | 'normal' | 'expanded',
  rules: AdaptiveRules
): ReactNode {
  // Skip processing if there are no children
  if (!children) {
    return children;
  }

  // Create space context object for adaptation decisions
  const spaceContext: SpaceContext = {
    containerWidth: containerSize.width,
    containerHeight: containerSize.height,
    availableWidth: containerSize.width,
    availableHeight: containerSize.height,
    adaptiveState
  };

  // Transform each child based on the rules and context
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // Extract adaptive props from the child
    const {
      adaptiveId,
      adaptiveType,
      adaptivePriority,
      hideOnCompact,
      preserveOnCompact,
      stackOnCompact,
      truncateOnCompact,
      compact,
      expanded
    } = child.props;

    // Choose alternative rendering based on adaptive state
    if (adaptiveState === 'compact' && compact) {
      return compact;
    } else if (adaptiveState === 'expanded' && expanded) {
      return expanded;
    }

    // Apply hide/show rules based on adaptive state
    if (adaptiveState === 'compact' && hideOnCompact) {
      return null;
    }

    // Apply transformations based on element type and rules
    let transformations: string[] = [];
    if (
      rules.transformations &&
      adaptiveType &&
      rules.transformations[adaptiveType] &&
      rules.transformations[adaptiveType][adaptiveState]
    ) {
      transformations = rules.transformations[adaptiveType][adaptiveState] || [];
    }

    // Apply the transformations to the child
    let adaptedChild = child;

    // Apply stacking transformation if specified
    if (adaptiveState === 'compact' && stackOnCompact) {
      adaptedChild = React.cloneElement(adaptedChild, {
        className: `${adaptedChild.props.className || ''} flex-col`,
      });
    }

    // Apply truncation if specified (for text content)
    if (adaptiveState === 'compact' && truncateOnCompact) {
      adaptedChild = React.cloneElement(adaptedChild, {
        className: `${adaptedChild.props.className || ''} truncate`,
      });
    }

    // Clone the element with additional adaptive props
    return React.cloneElement(adaptedChild, {
      'data-adaptive-state': adaptiveState,
      ...adaptedChild.props
    });
  });
}

/**
 * Calculate the optimal layout based on container size and content
 */
export function calculateAdaptiveLayout(
  containerWidth: number,
  containerHeight: number,
  children: React.ReactElement[],
  rules: AdaptiveRules
): { layout: 'grid' | 'stack' | 'row'; columns?: number } {
  const count = children.length;
  
  // Default to stack layout for very narrow containers
  if (containerWidth < 300) {
    return { layout: 'stack' };
  }
  
  // Use row layout for few children or wide containers
  if (count <= 3 || containerWidth > 1000) {
    return { layout: 'row' };
  }
  
  // Calculate optimal grid columns based on container width
  let columns = Math.min(
    Math.max(1, Math.floor(containerWidth / 300)), 
    Math.min(4, count)
  );
  
  // Apply any column rules from adaptiveRules
  if (rules.responsive && rules.responsive.mobileLayout && containerWidth < 640) {
    if (rules.responsive.mobileLayout === 'stack') {
      return { layout: 'stack' };
    } else if (rules.responsive.mobileLayout === 'grid') {
      columns = Math.min(2, count);
      return { layout: 'grid', columns };
    }
  }
  
  return { layout: 'grid', columns };
}
