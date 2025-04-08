
import React from 'react';
import { WireframeVisualizerProps } from './types';

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  onSectionClick,
  activeSection,
  onSelect
}) => {
  if (!wireframe || !wireframe.sections) {
    return <div className="p-4 text-center">No wireframe data available</div>;
  }

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  const handleSelect = () => {
    if (onSelect && wireframe.id) {
      onSelect(wireframe.id);
    }
  };

  return (
    <div 
      className={`wireframe-visualizer ${darkMode ? 'dark' : ''} ${deviceType}`}
      onClick={handleSelect}
    >
      <div className="wireframe-title text-xl font-bold mb-4">
        {wireframe.title || 'Untitled Wireframe'}
      </div>
      
      <div className="wireframe-sections space-y-4">
        {wireframe.sections.map((section, index) => (
          <div 
            key={section.id || `section-${index}`} 
            className={`wireframe-section p-4 border rounded-md ${
              activeSection === section.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
            }`}
            onClick={() => handleSectionClick(section.id || `section-${index}`)}
          >
            <h3 className="text-lg font-medium">{section.name || `Section ${index + 1}`}</h3>
            <p className="text-sm text-gray-500">{section.description || section.sectionType}</p>
            {viewMode === 'preview' && section.imageUrl && (
              <img 
                src={section.imageUrl} 
                alt={section.name || `Section ${index + 1}`} 
                className="mt-2 w-full rounded-sm" 
              />
            )}
            {section.componentVariant && (
              <div className="mt-2 text-xs bg-muted inline-block px-2 py-1 rounded">
                {section.componentVariant}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WireframeVisualizer;
