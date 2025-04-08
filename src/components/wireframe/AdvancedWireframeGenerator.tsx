
import React from 'react';
import WireframeGeneratorComponent from '@/components/project-detail/components/AI/WireframeGenerator';
import { v4 as uuidv4 } from 'uuid';
import { AIWireframe } from '@/services/ai/wireframe/wireframe-types';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
  onWireframeGenerated?: (wireframe: AIWireframe) => void;
  onWireframeSaved?: (wireframe: AIWireframe) => void;
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
    <WireframeGeneratorComponent 
      projectId={validProjectId}
      darkMode={darkMode}
      onWireframeGenerated={onWireframeGenerated}
      onWireframeSaved={onWireframeSaved}
    />
  );
};

export default AdvancedWireframeGenerator;
