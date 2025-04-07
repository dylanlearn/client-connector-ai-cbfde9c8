
import React, { useState, useEffect } from 'react';
import { useComponentRegistry } from './registry/ComponentRegistration';
import { getAllComponentDefinitions } from './registry/component-registry';
import { WireframeService } from '@/services/ai/wireframe/wireframe-service';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WireframeEditorProps {
  projectId?: string;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ projectId }) => {
  // Ensure components are registered
  useComponentRegistry();
  const [components, setComponents] = useState<any[]>([]);
  const [sections, setSections] = useState<WireframeSection[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Get all registered component definitions
    const definitions = getAllComponentDefinitions();
    setComponents(definitions);
  }, []);

  // Function to add a new section
  const addSection = (componentType: string) => {
    const definition = components.find(c => c.type === componentType);
    if (!definition) return;

    const newSection: WireframeSection = {
      id: crypto.randomUUID(),
      name: definition.name,
      sectionType: componentType,
      layoutType: 'default',
      components: definition.defaultData.components || [],
      styleProperties: definition.defaultData.styleProperties || {},
      componentVariant: definition.variants[0]?.id || 'default'
    };

    setSections(prev => [...prev, newSection]);
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

      // Create wireframe data
      const wireframeData = {
        title: "New Wireframe",
        description: "Created with the Wireframe Editor",
        data: {
          title: "New Wireframe",
          sections: sections
        },
        sections: sections
      };

      const result = await WireframeService.createWireframe(wireframeData);

      toast({
        title: "Success",
        description: "Wireframe saved successfully",
      });

      return result;
    } catch (error) {
      console.error("Error saving wireframe:", error);
      toast({
        title: "Error",
        description: "Failed to save wireframe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="wireframe-editor">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Wireframe Editor</h2>
        <Button onClick={saveWireframe}>Save Wireframe</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Components Panel */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Component Library</h3>
          <div className="space-y-2">
            {components.map(component => (
              <Button
                key={component.type}
                variant="outline"
                className="w-full justify-start"
                onClick={() => addSection(component.type)}
              >
                {component.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Editor Panel */}
        <div className="md:col-span-3 bg-white p-4 rounded-lg shadow min-h-[500px]">
          <h3 className="text-lg font-medium mb-4">Canvas</h3>
          {sections.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-500">Select components from the library to add to your wireframe</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={section.id || index} className="border p-4 rounded-lg">
                  <h4 className="font-medium">{section.name}</h4>
                  <p className="text-sm text-gray-500">Type: {section.sectionType}</p>
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
