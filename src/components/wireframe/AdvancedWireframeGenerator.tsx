
import React from 'react';
import AdvancedWireframeGeneratorComponent from '@/components/project-detail/components/AI/WireframeGenerator';
import { v4 as uuidv4 } from 'uuid';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  onWireframeGenerated?: (wireframe: any) => void;
  onWireframeSaved?: (wireframe: any) => void;
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  viewMode = 'preview',
  darkMode = false,
  onWireframeGenerated,
  onWireframeSaved
}) => {
  // Ensure we always have a valid UUID
  const validProjectId = projectId || uuidv4();
  
  return (
    <AdvancedWireframeGeneratorComponent 
      projectId={validProjectId}
      darkMode={darkMode}
      onWireframeGenerated={onWireframeGenerated}
      onWireframeSaved={onWireframeSaved}
    />
  );
};

export default AdvancedWireframeGenerator;
