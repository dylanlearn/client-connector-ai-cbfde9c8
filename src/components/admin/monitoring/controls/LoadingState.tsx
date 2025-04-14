
import React from 'react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mb-4"></div>
        <p className="text-muted-foreground">Loading configuration...</p>
      </div>
    </div>
  );
}
