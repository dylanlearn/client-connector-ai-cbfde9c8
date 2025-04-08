
import React, { useState, useEffect } from 'react';
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
  // Ensure we always have a valid UUID by checking and generating one if needed
  const [validProjectId, setValidProjectId] = useState<string>(() => {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    // If projectId is not a valid UUID, generate a new one
    const isValid = projectId && uuidRegex.test(projectId);
    
    if (!isValid) {
      console.warn(`Invalid UUID format for project ID: ${projectId}. Generating new UUID.`);
      return uuidv4();
    }
    
    return projectId;
  });
  
  // Log the UUID being used for debugging purposes
  useEffect(() => {
    console.log(`AdvancedWireframeGenerator initialized with project ID: ${validProjectId}`);
  }, [validProjectId]);
  
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
