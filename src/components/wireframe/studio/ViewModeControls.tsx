
import React from 'react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '../types';

interface ViewModeControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeControls: React.FC<ViewModeControlsProps> = ({ 
  viewMode, 
  onViewModeChange 
}) => {
  return (
    <div className="view-controls flex space-x-2">
      <Button
        size="sm"
        variant={viewMode === 'edit' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('edit')}
      >
        Edit
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'preview' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('preview')}
      >
        Preview
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'code' ? 'default' : 'outline'}
        onClick={() => onViewModeChange('code')}
      >
        Code
      </Button>
    </div>
  );
};

export default ViewModeControls;
