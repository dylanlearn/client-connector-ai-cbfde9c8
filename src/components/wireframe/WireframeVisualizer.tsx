
import React from 'react';
import { Card } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import Wireframe from './Wireframe';
import { DeviceType } from './types';

interface WireframeVisualizerProps {
  wireframe: WireframeData;
  viewMode?: 'edit' | 'preview' | 'code' | 'editor';
  onSectionClick?: (sectionId: string) => void;
  activeSection?: string | null;
  showControls?: boolean;
  darkMode?: boolean;
  deviceType?: DeviceType | 'desktop' | 'tablet' | 'mobile';
  selectedSectionId?: string | null;
  onSelect?: (sectionId: string) => void;
  preview?: boolean;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  onSectionClick,
  activeSection = null,
  showControls = false,
  darkMode = false,
  deviceType = 'desktop',
  selectedSectionId,
  onSelect,
  preview = false
}) => {
  if (!wireframe) {
    return (
      <Card className="p-4 text-center">
        <p className="text-muted-foreground">No wireframe data available</p>
      </Card>
    );
  }

  // Normalize viewMode values for consistency
  const normalizedViewMode = viewMode === 'editor' ? 'edit' : viewMode;

  // Use the proper active section ID (handle different prop names)
  const activeSectionId = selectedSectionId || activeSection;

  // Consolidate click handlers
  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) onSectionClick(sectionId);
    if (onSelect) onSelect(sectionId);
  };

  return (
    <div className="wireframe-visualizer">
      <Wireframe 
        wireframe={wireframe} 
        viewMode={normalizedViewMode}
        darkMode={darkMode}
        deviceType={deviceType as any}
        onSectionClick={handleSectionClick}
        activeSection={activeSectionId}
      />
    </div>
  );
};

export default WireframeVisualizer;
