
import React from 'react';
import { AccessibilityGuidelinesEditor } from './AccessibilityGuidelinesEditor';

interface AccessibilityImplementationProps {
  wireframeId: string;
  elementId?: string;
}

export const AccessibilityImplementation: React.FC<AccessibilityImplementationProps> = ({ 
  wireframeId,
  elementId 
}) => {
  return (
    <div className="space-y-6">
      <AccessibilityGuidelinesEditor 
        wireframeId={wireframeId}
        elementId={elementId}
      />
    </div>
  );
};
