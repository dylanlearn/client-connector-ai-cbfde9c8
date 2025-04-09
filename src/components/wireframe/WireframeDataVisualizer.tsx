
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { WireframeData } from '@/types/wireframe';

export interface WireframeDataVisualizerProps {
  wireframeData: WireframeData;
  title?: string;
  showSections?: boolean;
  showColorScheme?: boolean;
  showTypography?: boolean;
}

const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  title,
  showSections = true,
  showColorScheme = true,
  showTypography = true
}) => {
  if (!wireframeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Wireframe Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No wireframe data is available to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || wireframeData.title || 'Wireframe Data'}</CardTitle>
        {wireframeData.description && (
          <p className="text-muted-foreground">{wireframeData.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {showColorScheme && wireframeData.colorScheme && (
            <div>
              <h3 className="font-medium mb-2">Color Scheme</h3>
              <Separator className="mb-3" />
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 h-12 rounded-md mb-1" 
                    style={{ backgroundColor: wireframeData.colorScheme.primary }}
                  />
                  <span className="text-xs">Primary</span>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 h-12 rounded-md mb-1" 
                    style={{ backgroundColor: wireframeData.colorScheme.secondary }}
                  />
                  <span className="text-xs">Secondary</span>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 h-12 rounded-md mb-1" 
                    style={{ backgroundColor: wireframeData.colorScheme.accent }}
                  />
                  <span className="text-xs">Accent</span>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 h-12 rounded-md mb-1 border" 
                    style={{ backgroundColor: wireframeData.colorScheme.background }}
                  />
                  <span className="text-xs">Background</span>
                </div>
              </div>
            </div>
          )}
          
          {showTypography && wireframeData.typography && (
            <div>
              <h3 className="font-medium mb-2">Typography</h3>
              <Separator className="mb-3" />
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Headings:</span>
                  <p className="font-medium" style={{ fontFamily: wireframeData.typography.headings }}>
                    {wireframeData.typography.headings}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Body:</span>
                  <p style={{ fontFamily: wireframeData.typography.body }}>
                    {wireframeData.typography.body}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {showSections && wireframeData.sections && wireframeData.sections.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Sections ({wireframeData.sections.length})</h3>
              <Separator className="mb-3" />
              <div className="space-y-2">
                {wireframeData.sections.map((section, index) => (
                  <div key={section.id || index} className="border rounded-md p-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{section.name || `Section ${index + 1}`}</p>
                      <Badge variant="outline">{section.sectionType}</Badge>
                    </div>
                    {section.description && (
                      <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                    )}
                    {section.components && (
                      <p className="text-xs mt-2">
                        Components: {section.components.length}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {wireframeData.styleToken && (
            <div>
              <h3 className="font-medium mb-2">Style</h3>
              <Badge>{wireframeData.styleToken}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WireframeDataVisualizer;
