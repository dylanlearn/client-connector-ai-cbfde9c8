
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WireframeCanvasEnhanced } from './WireframeCanvasEnhanced';
import { WireframeSection } from '@/types/wireframe';
import { useToast } from '@/hooks/use-toast';

// Mock data type
interface WireframeData {
  id?: string;
  title?: string;
  description?: string;
  sections: WireframeSection[];
}

interface WireframeEditorProps {
  projectId?: string;
  wireframeData?: WireframeData;
  onUpdate?: (updatedData: WireframeData) => void;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({
  projectId,
  wireframeData,
  onUpdate
}) => {
  const [sections, setSections] = useState<WireframeSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<WireframeSection | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(1600);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (wireframeData?.sections) {
      setSections(wireframeData.sections);
    }
  }, [wireframeData]);

  const handleAddSection = () => {
    const newSection: WireframeSection = {
      id: `section-${Date.now()}`,
      name: `Section ${sections.length + 1}`,
      sectionType: 'container',
      position: { x: 100, y: 100 },
      dimensions: { width: 400, height: 200 },
      components: []
    };

    setSections([...sections, newSection]);
    toast({
      title: "Section added",
      description: `Added ${newSection.name}`
    });
  };

  const handleDeleteSection = () => {
    if (!selectedSection) return;

    const updatedSections = sections.filter(section => section.id !== selectedSection.id);
    setSections(updatedSections);
    setSelectedSection(null);
    toast({
      title: "Section deleted",
      description: `Deleted ${selectedSection.name}`
    });
  };

  // Fix the type mismatch by updating to accept a sectionId string
  const handleSectionSelect = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setSelectedSection(section);
    }
  };

  const handleSectionMove = (section: WireframeSection, x: number, y: number) => {
    const updatedSections = sections.map(s => {
      if (s.id === section.id) {
        return {
          ...s,
          position: { x, y }
        };
      }
      return s;
    });
    
    setSections(updatedSections);
  };

  const handleSectionResize = (section: WireframeSection, width: number, height: number) => {
    const updatedSections = sections.map(s => {
      if (s.id === section.id) {
        return {
          ...s,
          dimensions: { width, height }
        };
      }
      return s;
    });
    
    setSections(updatedSections);
  };

  const handleSave = () => {
    if (onUpdate) {
      const updatedWireframe = {
        ...(wireframeData || {}),
        sections,
        lastUpdated: new Date().toISOString()
      };
      onUpdate(updatedWireframe as WireframeData);
    }
    
    toast({
      title: "Changes saved",
      description: "Your wireframe has been updated"
    });
  };

  return (
    <div className="wireframe-editor space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button onClick={handleAddSection} variant="secondary">
            Add Section
          </Button>
          <Button 
            onClick={handleDeleteSection} 
            variant="outline" 
            disabled={!selectedSection}
          >
            Delete Section
          </Button>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
      
      <div className="border rounded-md overflow-auto" style={{ height: '600px' }}>
        <div className="relative" style={{ width: canvasWidth, height: canvasHeight }}>
          <WireframeCanvasEnhanced 
            sections={sections}
            width={canvasWidth}
            height={canvasHeight}
            editable={true}
            showGrid={true}
            snapToGrid={true}
            deviceType="desktop"
            onSectionSelect={handleSectionSelect}
            onSectionMove={handleSectionMove}
            onSectionResize={handleSectionResize}
          />
        </div>
      </div>
      
      {selectedSection && (
        <div className="p-4 border rounded-md bg-muted/30">
          <h3 className="font-medium mb-2">Section Properties: {selectedSection.name}</h3>
          <div className="text-sm">
            <p>Type: {selectedSection.sectionType}</p>
            <p>Position: x={selectedSection.position?.x || 0}, y={selectedSection.position?.y || 0}</p>
            <p>Size: {selectedSection.dimensions?.width || 0}x{selectedSection.dimensions?.height || 0}</p>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default WireframeEditor;
