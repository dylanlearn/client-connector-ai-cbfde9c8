
import React from 'react';
import { WireframeProps } from './types';
import { getSectionComponent, processSectionData } from './utils/section-utils';

interface WireframeVisualizerProps {
  wireframe: WireframeProps;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
}

export const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  darkMode = false,
}) => {
  if (!wireframe || !wireframe.sections || wireframe.sections.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No wireframe data available to display</p>
      </div>
    );
  }

  return (
    <div className={`wireframe-visualizer ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="wireframe-header p-4 border-b">
        <h2 className="text-xl font-bold">{wireframe.title || 'Untitled Wireframe'}</h2>
        {wireframe.description && <p className="text-sm text-gray-500">{wireframe.description}</p>}
        {wireframe.lastUpdated && (
          <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(wireframe.lastUpdated).toLocaleString()}</p>
        )}
      </div>
      
      <div className="wireframe-body">
        {wireframe.sections.map((section, index) => {
          const SectionComponent = getSectionComponent(section);
          
          if (!SectionComponent) {
            // Fallback for unknown section types
            return (
              <div key={`section-${index}`} className="border p-4 m-4">
                <p>Unknown section type: {section.sectionType || 'undefined'}</p>
              </div>
            );
          }
          
          // Process section data for the specific component type
          const processedData = processSectionData(section);
          
          // Render the appropriate section component
          return (
            <div key={`section-${index}`} className="section-wrapper">
              <SectionComponent 
                sectionIndex={index}
                data={processedData}
                viewMode={viewMode}
                darkMode={darkMode}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WireframeVisualizer;
