
import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}

const HistoryControls: React.FC<HistoryControlsProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  className
}) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default HistoryControls;
