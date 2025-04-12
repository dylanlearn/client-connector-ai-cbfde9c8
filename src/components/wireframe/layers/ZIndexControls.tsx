
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, MoveToTop, MoveToBottom } from 'lucide-react';
import { LayerInfo } from '@/components/wireframe/utils/types';

interface ZIndexControlsProps {
  layer: LayerInfo;
  onBringForward: (layerId: string) => void;
  onSendBackward: (layerId: string) => void;
  onBringToFront: (layerId: string) => void;
  onSendToBack: (layerId: string) => void;
  disabled?: boolean;
}

const ZIndexControls: React.FC<ZIndexControlsProps> = ({
  layer,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-1 z-index-controls">
      <Button
        size="icon"
        variant="ghost"
        title="Bring to front"
        className="h-6 w-6"
        disabled={disabled}
        onClick={() => onBringToFront(layer.id)}
      >
        <MoveToTop className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        title="Bring forward"
        className="h-6 w-6"
        disabled={disabled}
        onClick={() => onBringForward(layer.id)}
      >
        <ArrowUp className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        title="Send backward"
        className="h-6 w-6"
        disabled={disabled}
        onClick={() => onSendBackward(layer.id)}
      >
        <ArrowDown className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        title="Send to back"
        className="h-6 w-6"
        disabled={disabled}
        onClick={() => onSendToBack(layer.id)}
      >
        <MoveToBottom className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ZIndexControls;
