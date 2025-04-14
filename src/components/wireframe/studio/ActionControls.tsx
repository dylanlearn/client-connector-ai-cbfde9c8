
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionControlsProps {
  onAISuggestionsToggle: () => void;
  onExport: (format: string) => void;
}

const ActionControls: React.FC<ActionControlsProps> = ({ 
  onAISuggestionsToggle, 
  onExport 
}) => {
  return (
    <div className="actions flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onAISuggestionsToggle}
      >
        AI Suggestions
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onExport('png')}
      >
        Export
      </Button>
    </div>
  );
};

export default ActionControls;
