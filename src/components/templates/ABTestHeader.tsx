
import React from 'react';
import { ABTestCopyExample } from '@/components/ai/ABTestCopyExample';

export const ABTestHeader: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        <ABTestCopyExample 
          contentType="header"
          defaultText="Discover Premium Templates for Your Projects"
        />
      </h1>
      
      <div className="text-lg text-muted-foreground mb-8">
        <ABTestCopyExample 
          contentType="tagline"
          defaultText="Ready-to-use professional templates to jumpstart your next design project"
        />
      </div>
    </div>
  );
};
