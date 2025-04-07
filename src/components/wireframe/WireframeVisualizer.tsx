
import React from 'react';
import { WireframeData } from '@/types/wireframe';
import WireframeDataVisualizer from './WireframeDataVisualizer';

interface WireframeVisualizerProps {
  wireframe: {
    id: string;
    title: string;
    description?: string;
    sections: any[];
    imageUrl?: string;
  };
  viewMode?: 'preview' | 'flowchart';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  darkMode?: boolean;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  deviceType = 'desktop',
  darkMode = false
}) => {
  // Convert wireframe to WireframeData format expected by WireframeDataVisualizer
  const wireframeData: WireframeData = {
    id: wireframe.id,
    title: wireframe.title,
    description: wireframe.description,
    sections: wireframe.sections.map(section => {
      // Ensure each section has the required sectionType field
      return {
        ...section,
        sectionType: section.sectionType || 'generic'
      };
    }),
    imageUrl: wireframe.imageUrl
  };

  return (
    <WireframeDataVisualizer
      wireframeData={wireframeData}
      viewMode={viewMode}
      deviceType={deviceType}
      darkMode={darkMode}
    />
  );
};

export default WireframeVisualizer;
