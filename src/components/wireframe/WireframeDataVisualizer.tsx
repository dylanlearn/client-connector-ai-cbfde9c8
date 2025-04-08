
import React from 'react';

export interface WireframeDataVisualizerProps {
  wireframeData: any;
  darkMode?: boolean;
  viewMode?: 'preview' | 'flowchart';
  deviceType?: 'desktop' | 'tablet' | 'mobile';
}

const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  darkMode = false,
  viewMode = 'preview',
  deviceType = 'desktop'
}) => {
  if (!wireframeData) {
    return <div className="p-4 text-center">No wireframe data available</div>;
  }

  return (
    <div className={`wireframe-data-visualizer ${darkMode ? 'dark' : ''} ${deviceType}`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold">{wireframeData.title || 'Untitled Wireframe'}</h2>
        <p className="text-sm text-muted-foreground">{wireframeData.description}</p>
      </div>
      
      <div className="space-y-4">
        {wireframeData.sections?.map((section: any, index: number) => (
          <div key={section.id || index} className="border rounded-md p-4">
            <h3 className="font-medium">{section.name || `Section ${index + 1}`}</h3>
            <p className="text-sm">{section.description}</p>
            
            {viewMode === 'preview' && section.imageUrl && (
              <img 
                src={section.imageUrl} 
                alt={section.name || `Section ${index + 1}`} 
                className="mt-2 w-full h-auto" 
              />
            )}
            
            {viewMode === 'flowchart' && (
              <div className="mt-2 bg-muted/50 p-2 rounded text-sm">
                <div>Type: {section.sectionType}</div>
                {section.componentVariant && <div>Variant: {section.componentVariant}</div>}
                <div>Components: {section.components?.length || 0}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WireframeDataVisualizer;
