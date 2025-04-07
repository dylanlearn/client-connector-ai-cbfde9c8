
import React from 'react';
import { WireframeData } from '@/types/wireframe';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import HeroSectionRenderer from './renderers/HeroSectionRenderer';

interface WireframeDataVisualizerProps {
  wireframeData: WireframeData;
  viewMode: 'preview' | 'flowchart';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  darkMode?: boolean;
  showGrid?: boolean;
  highlightSections?: boolean;
  activeSection?: string | null;
}

export const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  viewMode = 'preview',
  deviceType = 'desktop',
  darkMode = false,
  showGrid = false,
  highlightSections = false,
  activeSection = null,
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
              className={`wireframe-section relative ${
                showGrid ? 'col-span-12' : ''
              } ${
                isActive ? 'ring-2 ring-primary' : ''
              } ${
                highlightSections ? 'hover:ring-2 hover:ring-primary/50' : ''
              }`}
            >
              {renderSection(section, viewMode, darkMode)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to render the appropriate section based on section type
const renderSection = (
  section: WireframeSection, 
  viewMode: 'preview' | 'flowchart',
  darkMode: boolean
) => {
  switch (section.sectionType) {
    case 'hero':
      return (
        <HeroSectionRenderer 
          section={section}
          viewMode={viewMode}
          darkMode={darkMode}
        />
      );
    // Add cases for other section types as you implement them
    
    default:
      return (
        <div className="border p-4 rounded-md">
          <h3 className="font-medium">{section.name || section.sectionType}</h3>
          <p className="text-sm text-muted-foreground">
            {section.description || `Section type: ${section.sectionType}`}
          </p>
        </div>
      );
  }
};

export default WireframeDataVisualizer;
