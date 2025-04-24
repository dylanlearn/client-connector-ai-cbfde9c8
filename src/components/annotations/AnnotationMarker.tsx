
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mic, Video, PenLine } from 'lucide-react';
import { Annotation } from '@/types/annotations';
import { cn } from '@/lib/utils';

interface AnnotationMarkerProps {
  annotation: Annotation;
  isActive: boolean;
  onClick: () => void;
}

export const AnnotationMarker: React.FC<AnnotationMarkerProps> = ({
  annotation,
  isActive,
  onClick,
}) => {
  // Function to get the appropriate icon based on annotation type
  const getAnnotationIcon = () => {
    switch (annotation.type) {
      case 'text':
        return <MessageSquare className="h-3 w-3" />;
      case 'voice':
        return <Mic className="h-3 w-3" />;
      case 'video':
        return <Video className="h-3 w-3" />;
      case 'sketch':
        return <PenLine className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  // Function to get background color based on status
  const getStatusColor = () => {
    switch (annotation.status) {
      case 'open':
        return 'bg-yellow-500';
      case 'in-review':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getThreadCount = () => {
    // In a real implementation, you would check the thread count
    // For now, we'll just return a placeholder
    return annotation.metadata?.replies || 0;
  };

  const threadCount = getThreadCount();

  return (
    <div
      className={cn(
        'absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all',
        isActive ? 'scale-125 z-50' : 'z-40'
      )}
      style={{
        left: annotation.position.x,
        top: annotation.position.y,
      }}
      onClick={onClick}
    >
      <div className={cn('rounded-full p-2', getStatusColor())}>
        {getAnnotationIcon()}
      </div>
      
      {threadCount > 0 && (
        <Badge
          className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center"
          variant="secondary"
        >
          {threadCount}
        </Badge>
      )}
    </div>
  );
};
