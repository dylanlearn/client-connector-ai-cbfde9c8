
import React from 'react';
import { Loader2 } from 'lucide-react';

interface CanvasLoadingIndicatorProps {
  isLoading: boolean;
}

const CanvasLoadingIndicator: React.FC<CanvasLoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default CanvasLoadingIndicator;
