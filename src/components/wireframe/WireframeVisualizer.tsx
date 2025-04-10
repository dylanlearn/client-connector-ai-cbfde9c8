
import React from 'react';
import { WireframeVisualizerProps } from './types';
import Wireframe from './Wireframe';
import { Card } from '@/components/ui/card';

/**
 * WireframeVisualizer is a wrapper component that renders a wireframe in various view modes
 * with consistent styling and behavior.
 */
const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  darkMode = false,
  deviceType = 'desktop',
  viewMode = 'preview',
  onSectionClick,
  selectedSectionId,
  onSelect,
  preview = false
}) => {
  if (!wireframe) {
    return (
      <Card className="flex items-center justify-center p-8 h-full">
        <p className="text-muted-foreground">No wireframe data available</p>
      </Card>
    );
  }

  return (
    <div className="wireframe-visualizer">
      <Wireframe
        wireframe={wireframe}
        viewMode={viewMode}
        darkMode={darkMode}
        deviceType={deviceType}
        onSectionClick={onSectionClick}
        activeSection={selectedSectionId}
        onSelect={onSelect}
      />
    </div>
  );
};

export default WireframeVisualizer;
