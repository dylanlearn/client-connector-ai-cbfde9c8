
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
  // If projectId is not a valid UUID, generate a new one
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };
  
  const validProjectId = isValidUUID(projectId) ? projectId : uuidv4();
  
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
