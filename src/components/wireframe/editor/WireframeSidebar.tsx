
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paintbrush, Layers, Settings } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

import SectionEditor from './sidebar/SectionEditor';
import StyleEditor from './sidebar/StyleEditor';
import SettingsEditor from './sidebar/SettingsEditor';

interface WireframeSidebarProps {
  wireframe: WireframeData;
  selectedElement: string | null;
  onWireframeUpdate: (updatedWireframe: WireframeData) => void;
}

const WireframeSidebar: React.FC<WireframeSidebarProps> = ({
  wireframe,
  selectedElement,
  onWireframeUpdate
}) => {
  const [activeTab, setActiveTab] = useState<string>('sections');

  // Handle styles change (colors, typography)
  const handleStylesChange = (updatedStyles: Partial<WireframeData>) => {
    onWireframeUpdate({
      ...wireframe,
      ...updatedStyles
    });
  };

  // Find selected section if any
  const selectedSection = selectedElement 
    ? wireframe.sections.find(section => section.id === selectedElement)
    : null;

  return (
    <div className="wireframe-sidebar w-80 border-l bg-background flex flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="sections" className="flex-1 flex items-center justify-center gap-1">
            <Layers className="h-4 w-4" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="styles" className="flex-1 flex items-center justify-center gap-1">
            <Paintbrush className="h-4 w-4" />
            Styles
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 flex items-center justify-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 px-4 py-2 h-[calc(100vh-8rem)]">
          <TabsContent value="sections" className="mt-0">
            <SectionEditor 
              wireframe={wireframe} 
              selectedSection={selectedSection}
              onWireframeUpdate={onWireframeUpdate}
            />
          </TabsContent>
          
          <TabsContent value="styles" className="mt-0">
            <StyleEditor 
              colorScheme={wireframe.colorScheme}
              typography={wireframe.typography}
              onChange={handleStylesChange}
            />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <SettingsEditor 
              wireframe={wireframe}
              onWireframeUpdate={onWireframeUpdate}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default WireframeSidebar;
