
import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type Priority = 'low' | 'medium' | 'high';

interface AnnotationMarkerProps {
  x: number;
  y: number;
  text: string;
  userId: string;
  timestamp: string;
  priority: Priority;
}

export const AnnotationMarker = ({
  x,
  y,
  text,
  userId,
  timestamp,
  priority
}: AnnotationMarkerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityIcon = () => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-amber-500 bg-amber-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div
        className={cn(
          'rounded-full border-2 p-1 transition-all',
          getPriorityColor(),
          isExpanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        )}
        onClick={toggleExpanded}
      >
        {getPriorityIcon()}
      </div>

      <div
        className={cn(
          'absolute top-0 left-0 bg-white rounded-md shadow-lg border p-3 w-64 z-20 transition-all',
          isExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        )}
        style={{
          transformOrigin: 'top left',
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-1">
            {getPriorityIcon()}
            <span className="text-sm font-medium capitalize">{priority} priority</span>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={toggleExpanded}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm mb-2">{text}</p>
        
        <div className="text-xs text-gray-500">
          <p>User: {userId}</p>
          <p>{formatDate(timestamp)}</p>
        </div>
      </div>
    </div>
  );
};
