
import React from 'react';
import { RoleViewControls } from './RoleViewControls';
import { FeedbackManagementPanel } from './FeedbackManagementPanel';

export function FeedbackManagementContainer({ wireframeId }: { wireframeId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <RoleViewControls />
      </div>
      <div className="md:col-span-3">
        <FeedbackManagementPanel wireframeId={wireframeId} />
      </div>
    </div>
  );
}
