
import React from 'react';

interface CanvasErrorDisplayProps {
  error: Error | null;
}

const CanvasErrorDisplay: React.FC<CanvasErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm">
      <div className="bg-card p-4 rounded-md shadow-lg">
        <h3 className="font-semibold text-destructive">Rendering Error</h3>
        <p className="text-sm">{error.message}</p>
      </div>
    </div>
  );
};

export default CanvasErrorDisplay;
