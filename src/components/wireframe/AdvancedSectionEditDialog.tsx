
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import SectionEditorFactory from './editors/SectionEditorFactory';

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
  onUpdate,
}) => {
  if (!section) return null;

  const handleUpdate = (updates: Partial<WireframeSection>) => {
    onUpdate(section.id, updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Edit {section.name}</span>
            <span className="text-sm font-normal text-muted-foreground">({section.sectionType})</span>
          </DialogTitle>
          <DialogDescription>
            Use the advanced editor to customize this section's content and appearance
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <SectionEditorFactory section={section} onUpdate={handleUpdate} />
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSectionEditDialog;
