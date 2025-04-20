
import React, { ReactNode } from 'react';
import { useContainerQuery } from '@/hooks/use-container-query';
import { cn } from '@/lib/utils';

interface ResponsiveComponentProps {
  children: ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  stackOnMobile?: boolean;
  mobileClasses?: string;
  tabletClasses?: string;
  desktopClasses?: string;
  transformOnBreakpoint?: {
    sm?: (node: ReactNode) => ReactNode;
    md?: (node: ReactNode) => ReactNode;
    lg?: (node: ReactNode) => ReactNode;
  };
  debug?: boolean;
  style?: React.CSSProperties;
}

/**
 * A component wrapper that handles responsive behavior automatically
 */
export function ResponsiveComponent({
  children,
  className,
  hideOnMobile,
  hideOnTablet,
  hideOnDesktop,
  stackOnMobile,
  mobileClasses = '',
  tabletClasses = '',
  desktopClasses = '',
  transformOnBreakpoint,
  debug = false,
  style,
}: ResponsiveComponentProps) {
  // Use container query to detect the container size
  const [containerRef, containerInfo] = useContainerQuery();
  
  const shouldHide =
    (hideOnMobile && containerInfo.isSmall) ||
    (hideOnTablet && containerInfo.isMedium) ||
    (hideOnDesktop && containerInfo.isLarge);
  
  const shouldStack = stackOnMobile && containerInfo.isSmall;
  
  let responsiveClasses = '';
  
  if (containerInfo.isSmall) {
    responsiveClasses = mobileClasses;
  } else if (containerInfo.isMedium) {
    responsiveClasses = tabletClasses;
  } else {
    responsiveClasses = desktopClasses;
  }
  
  // Apply transformation if needed
  let content: ReactNode = children;
  if (transformOnBreakpoint) {
    if (containerInfo.isExtraSmall && transformOnBreakpoint.sm) {
      content = transformOnBreakpoint.sm(children);
    } else if (containerInfo.isMedium && transformOnBreakpoint.md) {
      content = transformOnBreakpoint.md(children);
    } else if ((containerInfo.isLarge || containerInfo.isExtraLarge) && transformOnBreakpoint.lg) {
      content = transformOnBreakpoint.lg(children);
    }
  }
  
  if (shouldHide) {
    return null;
  }
  
  return (
    <div
      ref={containerRef}
      className={cn(
        className,
        responsiveClasses,
        shouldStack && 'flex flex-col',
        debug && 'border border-dashed border-red-400'
      )}
      style={style}
    >
      {content}
      
      {debug && (
        <div className="absolute top-0 right-0 text-xs bg-black/70 text-white px-1 py-0.5">
          {containerInfo.size.width}x{containerInfo.size.height} • {containerInfo.breakpoint}
        </div>
      )}
    </div>
  );
}

export default ResponsiveComponent;
