
import React from 'react';
import { WireframeData } from '@/types/wireframe';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Skeleton } from '@/components/ui/skeleton';
import WireframeSectionRenderer from './WireframeSectionRenderer';

interface WireframeDataVisualizerProps {
  wireframeData: WireframeData;
  viewMode: 'preview' | 'flowchart';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  darkMode?: boolean;
  showGrid?: boolean;
  highlightSections?: boolean;
  activeSection?: string | null;
  onSectionClick?: (sectionId: string) => void;
}

export const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  viewMode = 'preview',
  deviceType = 'desktop',
  darkMode = false,
  showGrid = false,
  highlightSections = false,
  activeSection = null,
  onSectionClick,
}) => {
  if (!wireframeData || !wireframeData.sections) {
    return (
      <div className="p-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div 
      className={`wireframe-visualizer ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white'}`}
      style={{ 
        maxWidth: deviceType === 'mobile' ? '375px' : deviceType === 'tablet' ? '768px' : '100%',
        margin: '0 auto'
      }}
    >
      <div className={`wireframe-sections ${showGrid ? 'grid grid-cols-12 gap-4' : ''}`}>
        {wireframeData.sections.map((section: WireframeSection) => {
          const isActive = activeSection === section.id;
          
          return (
            <div 
              key={section.id} 
              className={`wireframe-section-wrapper relative ${
                showGrid ? 'col-span-12' : ''
              } ${
                isActive ? 'ring-2 ring-primary' : ''
              } ${
                highlightSections ? 'hover:ring-2 hover:ring-primary/50' : ''
              }`}
            >
              <WireframeSectionRenderer 
                section={section}
                viewMode={viewMode}
                darkMode={darkMode}
                onSectionClick={onSectionClick ? () => onSectionClick(section.id!) : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WireframeDataVisualizer;
