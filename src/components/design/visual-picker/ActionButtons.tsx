
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ActionButtonsProps {
  handleLike: () => void;
  handleDislike: () => void;
  restartSwiping: () => void;
  currentIndex: number;
  optionsLength: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleLike,
  handleDislike,
  restartSwiping,
  currentIndex,
  optionsLength
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full w-12 h-12 bg-red-100 hover:bg-red-200 border-red-200"
        onClick={handleDislike}
      >
        <ThumbsDown className="h-5 w-5 text-red-500" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full w-10 h-10"
        onClick={restartSwiping}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full w-12 h-12 bg-green-100 hover:bg-green-200 border-green-200"
        onClick={handleLike}
      >
        <ThumbsUp className="h-5 w-5 text-green-500" />
      </Button>
      
      {currentIndex === optionsLength - 1 && (
        <div className="absolute -bottom-8 text-sm text-muted-foreground">
          Last option! Choose or restart.
        </div>
      )}
    </div>
  );
};

export default ActionButtons;
