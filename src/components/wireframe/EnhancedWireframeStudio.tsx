
// Fix for missing onExport and projectId prop in WireframeCanvasFabric
// This assumes the component has an export function that needs to be updated

import React, { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeviceType, ViewMode } from './types';
import WireframeVisualizer from './WireframeVisualizer';
import WireframeAISuggestions from './WireframeAISuggestions';
import WireframeCanvasFabric from './WireframeCanvasFabric';

interface EnhancedWireframeStudioProps {
  projectId: string;
  initialData?: any;
  standalone?: boolean;
  onUpdate?: (wireframe: any) => void;
  onExport?: (format: string) => void; // Added onExport prop
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({
  projectId,
  initialData,
  standalone = false,
  onUpdate,
  onExport, // Add onExport to props
}) => {
  const [wireframeData, setWireframeData] = useState(initialData || {
    id: 'new-wireframe',
    title: 'New Wireframe',
    sections: [],
  });
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleDeviceChange = (device: DeviceType) => {
    setDeviceType(device);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  return (
    <div className="enhanced-wireframe-studio">
      <div className="flex justify-between mb-4">
        <Tabs value={viewMode} onValueChange={(value) => handleViewModeChange(value as ViewMode)}>
          <TabsList>
            <TabsTrigger value="edit">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAISuggestions(true)}
          >
            AI Suggestions
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onExport) {
                onExport('pdf');
              }
            }}
          >
            Export PDF
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onExport) {
                onExport('html');
              }
            }}
          >
            Export HTML
          </Button>
        </div>
      </div>

      <div className="device-selector mb-4">
        {/* Device Type Selection */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Device:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={deviceType}
            onChange={(e) => handleDeviceChange(e.target.value as DeviceType)}
          >
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      </div>

      <div className="wireframe-content">
        {viewMode === 'edit' && (
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-4 h-[70vh]">
                <div className="col-span-3 border-r">
                  <WireframeCanvasFabric
                    wireframeData={wireframeData}
                    editable={true}
                    width={1200}
                    height={800}
                    onSectionClick={handleSectionClick}
                    deviceType={deviceType}
                    projectId={projectId}
                    onSectionUpdate={(section) => {
                      setWireframeData((prevData) => {
                        const updatedSections = prevData.sections.map((s) =>
                          s.id === section.id ? section : s
                        );
                        return { ...prevData, sections: updatedSections };
                      });
                      if (onUpdate) {
                        onUpdate(wireframeData);
                      }
                    }}
                  />
                </div>
                <div className="col-span-1 p-4 overflow-y-auto">
                  {selectedSection ? (
                    <div>
                      <h4 className="text-sm font-bold mb-2">Section Details</h4>
                      <p className="text-xs text-muted-foreground">
                        Section ID: {selectedSection}
                      </p>
                      {/* Add more section details here */}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a section to view details.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === 'preview' && (
          <Card>
            <CardContent className="p-0">
              <WireframeVisualizer
                wireframe={wireframeData}
                darkMode={false}
                deviceType={deviceType}
                viewMode="preview"
                onSectionClick={handleSectionClick}
                selectedSectionId={selectedSection}
              />
            </CardContent>
          </Card>
        )}

        {viewMode === 'code' && (
          <Card>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
                {JSON.stringify(wireframeData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      {showAISuggestions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <WireframeAISuggestions
            wireframe={wireframeData}
            onClose={() => setShowAISuggestions(false)}
            onApplySuggestion={(suggestion) => {
              setWireframeData((prevData) => {
                // Apply the AI suggestion to the wireframe data
                const updatedSections = prevData.sections.map((section) => {
                  // Example: If the suggestion is to update a section's background color
                  if (suggestion.sectionId === section.id) {
                    return { ...section, ...suggestion.changes };
                  }
                  return section;
                });
                return { ...prevData, sections: updatedSections };
              });
              setShowAISuggestions(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedWireframeStudio;
