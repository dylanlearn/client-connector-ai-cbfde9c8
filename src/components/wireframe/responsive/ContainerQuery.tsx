
import React, { ReactNode } from 'react';
import { useContainerQuery } from '@/hooks/use-container-query';
import { cn } from '@/lib/utils';

export type ContainerQueryCondition = 
  | 'xs-only' 
  | 'sm-only' 
  | 'md-only' 
  | 'lg-only' 
  | 'xl-only'
  | 'sm-and-up' 
  | 'md-and-up' 
  | 'lg-and-up' 
  | 'xl-and-up'
  | 'xs-to-sm' 
  | 'sm-to-md' 
  | 'md-to-lg' 
  | 'wide' 
  | 'narrow';

interface ContainerQueryProps {
  children: ReactNode;
  condition: ContainerQueryCondition;
  fallback?: ReactNode;
  className?: string;
  debug?: boolean;
}

/**
 * A component that conditionally renders its children based on container size
 */
export function ContainerQuery({
  children,
  condition,
  fallback = null,
  className,
  debug = false
}: ContainerQueryProps) {
  const [containerRef, containerInfo] = useContainerQuery();
  
  const { isExtraSmall, isSmall, isMedium, isLarge, isExtraLarge, aspectRatio } = containerInfo;
  
  // Evaluate the condition
  let conditionMet = false;
  
  switch (condition) {
    case 'xs-only':
      conditionMet = isExtraSmall;
      break;
    case 'sm-only':
      conditionMet = isSmall;
      break;
    case 'md-only':
      conditionMet = isMedium;
      break;
    case 'lg-only':
      conditionMet = isLarge;
      break;
    case 'xl-only':
      conditionMet = isExtraLarge;
      break;
    case 'sm-and-up':
      conditionMet = isSmall || isMedium || isLarge || isExtraLarge;
      break;
    case 'md-and-up':
      conditionMet = isMedium || isLarge || isExtraLarge;
      break;
    case 'lg-and-up':
      conditionMet = isLarge || isExtraLarge;
      break;
    case 'xl-and-up':
      conditionMet = isExtraLarge;
      break;
    case 'xs-to-sm':
      conditionMet = isExtraSmall || isSmall;
      break;
    case 'sm-to-md':
      conditionMet = isSmall || isMedium;
      break;
    case 'md-to-lg':
      conditionMet = isMedium || isLarge;
      break;
    case 'wide':
      conditionMet = containerInfo.aspectRatio > 1.5;
      break;
    case 'narrow':
      conditionMet = containerInfo.aspectRatio < 1;
      break;
    default:
      conditionMet = false;
  }
  
  return (
    <div
      ref={containerRef}
      className={cn('container-query', className)}
    >
      {debug && (
        <div className="absolute top-0 right-0 text-xs bg-black/70 text-white px-1 py-0.5 z-50">
          {containerInfo.size.width}x{containerInfo.size.height} • {containerInfo.breakpoint}
          <br />({condition}: {conditionMet ? 'true' : 'false'})
        </div>
      )}
      
      {conditionMet ? children : fallback}
    </div>
  );
}

export default ContainerQuery;
