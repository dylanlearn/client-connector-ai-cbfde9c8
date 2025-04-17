
import React from 'react';
import { cn } from '@/lib/utils';
import { DistanceIndicator } from '../types/canvas-types';

interface DistanceIndicatorProps {
  indicator: DistanceIndicator;
}

/**
 * Component to visualize the distance between objects on canvas
 */
const DistanceIndicatorComponent: React.FC<DistanceIndicatorProps> = ({
  indicator
}) => {
  // Calculate the midpoint for label positioning
  const midX = (indicator.startPoint.x + indicator.endPoint.x) / 2;
  const midY = (indicator.startPoint.y + indicator.endPoint.y) / 2;
  
  // Format distance for display
  const formattedDistance = `${Math.round(indicator.distance)}px`;
  
  // Style based on orientation
  const isHorizontal = indicator.orientation === 'horizontal';
  
  // Calculate arrow line points
  const arrowPoints = isHorizontal
    ? `M${indicator.startPoint.x},${indicator.startPoint.y} L${indicator.endPoint.x},${indicator.endPoint.y}`
    : `M${indicator.startPoint.x},${indicator.startPoint.y} L${indicator.endPoint.x},${indicator.endPoint.y}`;
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Distance line */}
      <path
        d={arrowPoints}
        stroke={indicator.color || 'rgba(0, 120, 255, 0.7)'}
        strokeWidth={1}
        strokeDasharray="3 2"
        fill="none"
      />
      
      {/* Arrow heads */}
      <path
        d={isHorizontal
          ? `M${indicator.startPoint.x + 3},${indicator.startPoint.y - 3} L${indicator.startPoint.x},${indicator.startPoint.y} L${indicator.startPoint.x + 3},${indicator.startPoint.y + 3}`
          : `M${indicator.startPoint.x - 3},${indicator.startPoint.y + 3} L${indicator.startPoint.x},${indicator.startPoint.y} L${indicator.startPoint.x + 3},${indicator.startPoint.y + 3}`
        }
        stroke={indicator.color || 'rgba(0, 120, 255, 0.7)'}
        strokeWidth={1}
        fill="none"
      />
      
      <path
        d={isHorizontal
          ? `M${indicator.endPoint.x - 3},${indicator.endPoint.y - 3} L${indicator.endPoint.x},${indicator.endPoint.y} L${indicator.endPoint.x - 3},${indicator.endPoint.y + 3}`
          : `M${indicator.endPoint.x - 3},${indicator.endPoint.y - 3} L${indicator.endPoint.x},${indicator.endPoint.y} L${indicator.endPoint.x + 3},${indicator.endPoint.y - 3}`
        }
        stroke={indicator.color || 'rgba(0, 120, 255, 0.7)'}
        strokeWidth={1}
        fill="none"
      />
      
      {/* Distance label */}
      <g transform={`translate(${midX}, ${midY})`}>
        <rect
          x={-15}
          y={-9}
          width={30}
          height={16}
          rx={3}
          fill="rgba(255, 255, 255, 0.9)"
          stroke={indicator.color || 'rgba(0, 120, 255, 0.7)'}
          strokeWidth={1}
        />
        <text
          x={0}
          y={4}
          fontSize={10}
          textAnchor="middle"
          fill={indicator.color || 'rgba(0, 120, 255, 0.7)'}
        >
          {formattedDistance}
        </text>
      </g>
    </svg>
  );
};

export default DistanceIndicatorComponent;
