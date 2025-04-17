
import React from 'react';
import { Card } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import Wireframe from './Wireframe';

interface WireframeVisualizerProps {
  wireframe: WireframeData;
  viewMode?: 'edit' | 'preview' | 'code';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
  showControls?: boolean;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  onSectionClick,
  activeSection = null,
  showControls = false
}) => {
  if (!wireframe) {
    return (
      <Card className="p-4 text-center">
        <p className="text-muted-foreground">No wireframe data available</p>
      </Card>
    );
  }

  return (
    <div className="wireframe-visualizer">
      <Wireframe 
        wireframe={wireframe} 
        viewMode={viewMode} 
        onSectionClick={onSectionClick}
        activeSection={activeSection}
      />
    </div>
  );
};

export default WireframeVisualizer;
