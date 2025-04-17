
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DeviceType } from './types';
import WireframeVisualizer from './WireframeVisualizer';

interface WireframePreviewProps {
  wireframe: any;
  deviceType?: DeviceType;
  darkMode?: boolean;
  viewMode?: 'preview' | 'edit' | 'code';
  onSectionClick?: (sectionId: string) => void;
}

const WireframePreview: React.FC<WireframePreviewProps> = ({
  wireframe,
  deviceType = 'desktop',
  darkMode = false,
  viewMode = 'preview',
  onSectionClick
}) => {
  if (!wireframe) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No wireframe available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="wireframe-preview">
      <WireframeVisualizer 
        wireframe={wireframe}
        darkMode={darkMode}
        deviceType={deviceType}
        viewMode={viewMode}
        onSectionClick={onSectionClick}
      />
    </div>
  );
};

export default WireframePreview;
