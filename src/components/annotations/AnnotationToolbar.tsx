
import React from 'react';
import { MessageSquarePlus, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Priority = 'low' | 'medium' | 'high';

interface AnnotationToolbarProps {
  onAddAnnotation: () => void;
  isAddingAnnotation: boolean;
  onPriorityChange: (priority: Priority) => void;
  selectedPriority: Priority;
}

export const AnnotationToolbar = ({
  onAddAnnotation,
  isAddingAnnotation,
  onPriorityChange,
  selectedPriority
}: AnnotationToolbarProps) => {
  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isAddingAnnotation}>
        <PopoverTrigger asChild>
          <Button
            variant={isAddingAnnotation ? "secondary" : "outline"}
            size="sm"
            onClick={onAddAnnotation}
            className="flex items-center gap-1"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>Annotate</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="end">
          <div className="space-y-2">
            <p className="text-sm font-medium">Select priority</p>
            <div className="flex space-x-1">
              <Button 
                variant={selectedPriority === 'low' ? "secondary" : "outline"}
                size="sm"
                onClick={() => onPriorityChange('low')}
                className="flex items-center gap-1"
              >
                <Info className="h-4 w-4 text-blue-500" />
                <span>Low</span>
              </Button>
              <Button 
                variant={selectedPriority === 'medium' ? "secondary" : "outline"}
                size="sm"
                onClick={() => onPriorityChange('medium')}
                className="flex items-center gap-1"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Medium</span>
              </Button>
              <Button 
                variant={selectedPriority === 'high' ? "secondary" : "outline"}
                size="sm"
                onClick={() => onPriorityChange('high')}
                className="flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>High</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {isAddingAnnotation && (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          {getPriorityIcon(selectedPriority)}
          <span className="capitalize">{selectedPriority} priority</span>
        </div>
      )}
    </div>
  );
};
