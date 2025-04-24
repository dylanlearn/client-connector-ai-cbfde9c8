
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MessageSquare, Mic, Video, PenLine } from 'lucide-react';
import { AnnotationType } from '@/types/annotations';

interface AnnotationToolbarProps {
  onCreateAnnotation: (type: AnnotationType) => void;
  disabled?: boolean;
}

export const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({ 
  onCreateAnnotation,
  disabled = false
}) => {
  return (
    <div className="flex space-x-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCreateAnnotation('text')}
              disabled={disabled}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Text Comment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCreateAnnotation('voice')}
              disabled={disabled}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice Annotation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCreateAnnotation('video')}
              disabled={disabled}
            >
              <Video className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Video Annotation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCreateAnnotation('sketch')}
              disabled={disabled}
            >
              <PenLine className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sketch Annotation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
