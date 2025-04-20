
import React from 'react';

interface WebsiteAnalyzerHeaderProps {
  isLoggedIn: boolean;
}

export default function WebsiteAnalyzerHeader({ isLoggedIn }: WebsiteAnalyzerHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">Website Design Analyzer</h1>
      <p className="text-muted-foreground mt-2">
        Analyze websites to discover effective design patterns and implementation details
      </p>
      
      {!isLoggedIn && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mt-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <span className="font-medium">Pro tip:</span> Log in to save your analysis results and access more features.
          </p>
        </div>
      )}
    </div>
  );
}
