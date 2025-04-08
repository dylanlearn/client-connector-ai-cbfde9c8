
import React from 'react';
import { Card } from '@/components/ui/card';

interface WireframeVisualizerProps {
  wireframe: any;
  viewMode?: 'flowchart' | 'preview';
  deviceType?: 'desktop' | 'mobile' | 'tablet';
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  viewMode = 'preview',
  deviceType = 'desktop'
}) => {
  if (!wireframe) {
    return <div className="p-4 text-center">No wireframe data available</div>;
  }

  return (
    <div className={`wireframe-visualizer ${deviceType}`}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{wireframe.title || 'Untitled Wireframe'}</h3>
        <p className="text-sm text-muted-foreground">{wireframe.description}</p>
      </div>
      
      <div className="space-y-4">
        {wireframe.sections?.map((section: any, index: number) => (
          <Card key={section.id || index} className="p-4">
            <h4 className="font-medium">{section.name || `Section ${index + 1}`}</h4>
            <p className="text-sm text-muted-foreground my-2">{section.description}</p>
            
            {viewMode === 'preview' && section.imageUrl && (
              <div className="aspect-video bg-muted rounded-md mt-2 overflow-hidden">
                <img 
                  src={section.imageUrl} 
                  alt={section.name || `Section ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            
            {viewMode === 'flowchart' && (
              <div className="mt-2 p-2 bg-muted/50 rounded-md text-sm">
                <div className="flex items-center justify-between">
                  <span>Type: {section.sectionType || 'Generic'}</span>
                  <span>Components: {section.components?.length || 0}</span>
                </div>
                {section.layout && (
                  <div className="mt-1">Layout: {section.layout.type || 'default'}</div>
                )}
              </div>
            )}
            
            {section.components?.length > 0 && viewMode === 'flowchart' && (
              <div className="mt-3 pl-4 border-l-2 border-muted">
                {section.components.map((component: any, compIndex: number) => (
                  <div key={component.id || compIndex} className="py-1 text-xs">
                    {component.type || 'Component'} {component.content ? `- ${component.content.substring(0, 20)}...` : ''}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WireframeVisualizer;
