
import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, Code } from 'lucide-react';
import SectionEditorFactory from './editors/SectionEditorFactory';
import SectionEditorPreview from './SectionEditorPreview';

interface AdvancedSectionEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  section: WireframeSection | null;
  onUpdate: (sectionId: string, updates: Partial<WireframeSection>) => void;
}

const AdvancedSectionEditDialog: React.FC<AdvancedSectionEditDialogProps> = ({
  isOpen,
  onClose,
  section,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState('editor');
  
  const handleUpdate = useCallback((updates: Partial<WireframeSection>) => {
    if (section) {
      onUpdate(section.id, updates);
    }
  }, [section, onUpdate]);

  const handleSectionUpdate = useCallback((sectionId: string, updates: Partial<WireframeSection>) => {
    onUpdate(sectionId, updates);
  }, [onUpdate]);
  
  if (!section) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {section.name}</DialogTitle>
          <DialogDescription>
            Customize this {section.sectionType} section
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Side-by-Side
            </TabsTrigger>
            <TabsTrigger value="json" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              JSON
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="py-4">
            <SectionEditorFactory 
              section={section}
              onUpdate={handleUpdate}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="py-4">
            <SectionEditorPreview
              section={section}
              onUpdate={handleSectionUpdate}
            />
          </TabsContent>
          
          <TabsContent value="json" className="py-4">
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-xs overflow-auto max-h-[400px]">
                {JSON.stringify(section, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(AdvancedSectionEditDialog);
