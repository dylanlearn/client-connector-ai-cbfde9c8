
import React from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { WireframeRendererProps } from './types';
import WireframeSectionRenderer from './WireframeSectionRenderer';
import { Separator } from '@/components/ui/separator';

const WireframeRenderer: React.FC<WireframeRendererProps> = ({
  wireframeData,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  onSectionClick,
  activeSection = null
}) => {
  if (!wireframeData || !wireframeData.sections || wireframeData.sections.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg font-medium mb-2">No wireframe data available</div>
        <p className="text-muted-foreground">Please generate a wireframe first</p>
      </div>
    );
  }

  return (
    <div 
      className={`wireframe-renderer ${darkMode ? 'dark' : ''}`}
      style={{ 
        maxWidth: deviceType === 'mobile' ? '375px' : deviceType === 'tablet' ? '768px' : '100%',
        margin: deviceType !== 'desktop' ? '0 auto' : undefined
      }}
    >
      <div className="wireframe-header p-4 border-b">
        <h1 className="text-xl font-bold">{wireframeData.title}</h1>
        {wireframeData.description && (
          <p className="text-muted-foreground mt-1">{wireframeData.description}</p>
        )}
      </div>
      
      <div className="wireframe-sections">
        {wireframeData.sections.map((section, index) => (
          <React.Fragment key={section.id || `section-${index}`}>
            <div
              className={`wireframe-section relative ${
                activeSection === section.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <WireframeSectionRenderer 
                section={section}
                viewMode={viewMode}
                darkMode={darkMode}
                sectionIndex={index}
                onSectionClick={onSectionClick}
              />
            </div>
            {index < wireframeData.sections.length - 1 && <Separator className="my-2" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WireframeRenderer;
