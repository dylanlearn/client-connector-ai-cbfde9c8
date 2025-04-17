
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AdaptiveElementProps } from './adaptation-types';

/**
 * A component that adapts its appearance based on available space
 * and current adaptive context.
 */
const AdaptiveElement: React.FC<AdaptiveElementProps> = ({
  children,
  adaptivePriority = 1,
  adaptiveId,
  adaptiveType,
  compact,
  expanded,
  minWidth,
  preserveOnCompact = false,
  hideOnCompact = false,
  stackOnCompact = false,
  truncateOnCompact = false,
  className,
  style,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "adaptive-element",
        className
      )}
      style={style}
      data-adaptive-id={adaptiveId}
      data-adaptive-type={adaptiveType}
      data-adaptive-priority={adaptivePriority}
      data-preserve-on-compact={preserveOnCompact}
      data-hide-on-compact={hideOnCompact}
      data-stack-on-compact={stackOnCompact}
      data-truncate-on-compact={truncateOnCompact}
      {...rest}
    >
      {children}
    </div>
  );
};

export default AdaptiveElement;
