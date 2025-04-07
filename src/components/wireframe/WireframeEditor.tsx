
import React, { useState, useEffect } from 'react';
import { useComponentRegistry } from './registry/ComponentRegistration';
import { getAllComponentDefinitions, createSectionInstance } from './registry/component-registry';
import { WireframeService } from '@/services/ai/wireframe/wireframe-service';
import { WireframeSection, WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWireframeStore } from '@/stores/wireframe-store';

interface WireframeEditorProps {
  projectId?: string;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ projectId }) => {
  // Ensure components are registered
  useComponentRegistry();
  const [components, setComponents] = useState<any[]>([]);
  const { toast } = useToast();
  
  // Use the Zustand store for state management
  const {
    wireframe,
    addSection,
    setWireframe,
    activeSection,
    setActiveSection
  } = useWireframeStore();

  useEffect(() => {
    // Get all registered component definitions
    const definitions = getAllComponentDefinitions();
    setComponents(definitions);
  }, []);

  // Function to add a new section from the component library
  const handleAddSection = (componentType: string) => {
    const sectionData = createSectionInstance(componentType);
    addSection(sectionData);
    
    toast({
      title: "Section added",
      description: `Added ${componentType} section to wireframe`
    });
  };

  // Function to save wireframe to database
  const saveWireframe = async () => {
    try {
      if (!projectId) {
        toast({
          title: "Error",
          description: "Project ID is required to save wireframe",
          variant: "destructive",
        });
        return;
      }

      // Create wireframe data with proper type alignment
      const wireframeData: WireframeData = {
        title: wireframe.title || "New Wireframe",
        description: wireframe.description || "Created with the Wireframe Editor",
        sections: wireframe.sections || []
      };

      const result = await WireframeService.createWireframe({
        title: wireframeData.title,
        description: wireframeData.description,
        data: wireframeData,
        sections: wireframeData.sections
      });

      toast({
        title: "Success",
        description: "Wireframe saved successfully",
      });

      return result;
    } catch (error) {
      console.error("Error saving wireframe:", error);
      toast({
        title: "Error",
        description: "Failed to save wireframe. Please ensure you're logged in.",
        variant: "destructive",
      });
    }
  };

  // Handle section selection
  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="wireframe-editor">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Wireframe Editor</h2>
        <Button onClick={saveWireframe} variant="default">Save Wireframe</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Components Panel */}
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Component Library</h3>
          <div className="space-y-2">
            {components.map(component => (
              <Button
                key={component.type}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAddSection(component.type)}
              >
                {component.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Editor Panel */}
        <div className="md:col-span-3 bg-card p-4 rounded-lg shadow min-h-[500px]">
          <h3 className="text-lg font-medium mb-4">Canvas</h3>
          {wireframe.sections.length === 0 ? (
            <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
              <p className="text-muted-foreground">Select components from the library to add to your wireframe</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wireframe.sections.map((section, index) => (
                <div 
                  key={section.id} 
                  className={`border p-4 rounded-lg cursor-pointer transition-colors ${
                    activeSection === section.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => handleSelectSection(section.id)}
                >
                  <h4 className="font-medium">{section.name}</h4>
                  <p className="text-sm text-muted-foreground">Type: {section.sectionType}</p>
                  {section.componentVariant && (
                    <p className="text-sm text-muted-foreground">Variant: {section.componentVariant}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WireframeEditor;
