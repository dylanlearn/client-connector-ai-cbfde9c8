
import React from 'react';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';

export interface WireframeVisualizerProps {
  wireframeData: any;
  preview?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onSelect?: (id: string) => void;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframeData,
  preview = false,
  deviceType = 'desktop',
  onSelect
}) => {
  if (!wireframeData) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-md">
        <p className="text-muted-foreground">No wireframe data available</p>
      </div>
    );
  }

  // Get width based on device type
  const getWidth = () => {
    switch (deviceType) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      case 'desktop': return 1200;
      default: return 1200;
    }
  };

  const width = getWidth();
  const height = 2000; // Default height, could be made responsive too

  const handleSectionSelect = (sectionId: string) => {
    if (onSelect) {
      onSelect(sectionId);
    }
  };

  return (
    <div className={`wireframe-visualizer ${preview ? 'preview-mode' : ''}`}>
      <WireframeCanvasEnhanced
        sections={wireframeData.sections || []}
        width={width}
        height={height}
        editable={false}
        showGrid={false}
        snapToGrid={false}
        deviceType={deviceType}
        responsiveMode={deviceType !== 'desktop'}
        onSectionSelect={onSelect ? handleSectionSelect : undefined}
      />
    </div>
  );
};

export default WireframeVisualizer;
