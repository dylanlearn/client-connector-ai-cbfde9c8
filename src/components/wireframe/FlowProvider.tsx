
import React from 'react';
import { ReactFlowProvider } from 'reactflow';

/**
 * Provider component for React Flow
 * This ensures that ReactFlow context is available to all components
 */
export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactFlowProvider>
      {children}
    </ReactFlowProvider>
  );
};

export default FlowProvider;
