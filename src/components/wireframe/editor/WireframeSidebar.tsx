
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import SectionEditor from './SectionEditor';
import StyleEditor from './StyleEditor';
import ElementsPanel from './ElementsPanel';

interface WireframeSidebarProps {
  wireframe: WireframeData;
  selectedElement: string | null;
  onWireframeUpdate: (wireframe: WireframeData) => void;
}

const WireframeSidebar: React.FC<WireframeSidebarProps> = ({
  wireframe,
  selectedElement,
  onWireframeUpdate
}) => {
  // Find the selected section if any
  const selectedSection = wireframe.sections.find(
    section => section.id === selectedElement
  );
  
  // Handle section updates
  const handleSectionUpdate = (sectionId: string, updates: Partial<WireframeSection>) => {
    const updatedSections = wireframe.sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    );
    
    onWireframeUpdate({
      ...wireframe,
      sections: updatedSections
    });
  };
  
  // Handle global style updates
  const handleStyleUpdate = (styleUpdates: Partial<WireframeData>) => {
    onWireframeUpdate({
      ...wireframe,
      ...styleUpdates
    });
  };
  
  return (
    <div className="w-72 border-l bg-muted/10">
      <Tabs defaultValue="sections">
        <TabsList className="w-full">
          <TabsTrigger value="sections" className="flex-1">Sections</TabsTrigger>
          <TabsTrigger value="elements" className="flex-1">Elements</TabsTrigger>
          <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <TabsContent value="sections" className="p-4">
            {selectedSection ? (
              <SectionEditor 
                section={selectedSection}
                onUpdate={(updates) => handleSectionUpdate(selectedSection.id, updates)}
              />
            ) : (
              <div className="text-center p-4 text-sm text-muted-foreground">
                <p>Select a section to edit</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="elements" className="p-4">
            <ElementsPanel 
              wireframe={wireframe}
              onAddElement={(sectionId, element) => {
                // Implementation for adding elements
              }}
            />
          </TabsContent>
          
          <TabsContent value="styles" className="p-4">
            <StyleEditor 
              colorScheme={wireframe.colorScheme}
              typography={wireframe.typography}
              onUpdate={handleStyleUpdate}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default WireframeSidebar;
