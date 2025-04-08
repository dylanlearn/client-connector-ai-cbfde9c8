
import React from 'react';
import { AdvancedWireframeGenerator as ProjectAdvancedWireframeGenerator } from '@/components/project-detail/components/AI/WireframeGenerator';
import { v4 as uuidv4 } from 'uuid';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  viewMode = 'preview',
  darkMode = false
}) => {
  // Ensure we always have a valid UUID
  const validProjectId = projectId || uuidv4();
  
  return (
    <ProjectAdvancedWireframeGenerator 
      projectId={validProjectId}
      darkMode={darkMode}
    />
  );
};

export default AdvancedWireframeGenerator;
