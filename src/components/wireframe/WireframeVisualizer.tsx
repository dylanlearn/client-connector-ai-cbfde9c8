
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export interface WireframeSection {
  id: string;
  name: string;
  description?: string;
  sectionType?: string;
}

export interface WireframeProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  sections?: WireframeSection[];
  version?: string;
  lastUpdated?: string;
}

interface WireframeVisualizerProps {
  wireframe: WireframeProps;
  onSelect?: (id: string) => void;
  viewMode?: 'flowchart' | 'preview';
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  darkMode?: boolean;
}

const WireframeVisualizer: React.FC<WireframeVisualizerProps> = ({
  wireframe,
  onSelect,
  viewMode = 'flowchart',
  deviceType = 'desktop',
  darkMode = false
}) => {
  // Ensure we have default values for sections
  const sections = wireframe?.sections || [];
  
  // Handle selection
  const handleSelect = () => {
    if (onSelect) {
      onSelect(wireframe.id);
    }
  };
  
  // Render a preview of the wireframe
  if (viewMode === 'preview') {
    return (
      <div 
        className={`wireframe-preview p-4 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}
        onClick={handleSelect}
      >
        {wireframe.imageUrl ? (
          <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
            <img 
              src={wireframe.imageUrl} 
              alt={wireframe.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
            <p className="text-muted-foreground">No preview image</p>
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-2">{wireframe.title}</h3>
        {wireframe.description && (
          <p className="text-muted-foreground mb-4">{wireframe.description}</p>
        )}
        
        {/* Sections preview */}
        {sections.length > 0 && (
          <div className="space-y-2">
            {sections.map((section) => (
              <div 
                key={section.id}
                className={`p-3 border rounded-md ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <h4 className="font-medium">{section.name}</h4>
                {section.description && (
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Render flowchart view (default)
  return (
    <div 
      className={`wireframe-flowchart ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white'}`}
      onClick={handleSelect}
    >
      {/* Main wireframe card */}
      <Card className={`cursor-pointer transition-all duration-200 ${onSelect ? 'hover:shadow-md' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{wireframe.title}</CardTitle>
            {wireframe.version && (
              <Badge variant="outline">v{wireframe.version}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {wireframe.description && (
            <p className="text-sm text-muted-foreground mb-4">{wireframe.description}</p>
          )}
          
          {/* Wireframe image if available */}
          {wireframe.imageUrl && (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
              <img 
                src={wireframe.imageUrl} 
                alt={wireframe.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          {/* Sections list */}
          {sections.length > 0 && (
            <div className="space-y-3 mt-4">
              <h4 className="font-medium text-sm">Sections</h4>
              <div className="grid gap-2">
                {sections.map((section) => (
                  <div 
                    key={section.id}
                    className={`p-3 border rounded-md ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">{section.name}</h5>
                      {section.sectionType && (
                        <Badge variant="secondary" className="text-xs">
                          {section.sectionType}
                        </Badge>
                      )}
                    </div>
                    {section.description && (
                      <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Last updated info */}
          {wireframe.lastUpdated && (
            <p className="text-xs text-muted-foreground mt-4">
              Last updated: {new Date(wireframe.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WireframeVisualizer;
