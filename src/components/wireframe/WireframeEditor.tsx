
import React, { useState, useEffect } from 'react';
import { useComponentRegistry } from './registry/ComponentRegistration';
import { getAllComponentDefinitions, createSectionInstance } from './registry/component-registry';
import { WireframeService } from '@/services/ai/wireframe/wireframe-service';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { useWireframeStore } from '@/stores/wireframe-store';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import WireframeToolbar from './WireframeToolbar';
import WireframeCanvas from './WireframeCanvas';
import SectionControls from './SectionControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Columns, EyeIcon } from 'lucide-react';
import AdvancedSectionEditDialog from './AdvancedSectionEditDialog';
import SideBySidePreview from './SideBySidePreview';

interface WireframeEditorProps {
  projectId?: string;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ projectId }) => {
  // Ensure components are registered
  useComponentRegistry();
  const [components, setComponents] = useState<any[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdvancedEditDialogOpen, setIsAdvancedEditDialogOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState('');
  const [editingSectionDescription, setEditingSectionDescription] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast: uiToast } = useToast();
  
  // Use the Zustand store for state management
  const {
    wireframe,
    addSection,
    updateSection,
    removeSection,
    setWireframe,
    activeSection,
    setActiveSection,
    reorderSections,
    hiddenSections,
    toggleSectionVisibility
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
    
    toast.success("Section added", {
      description: `Added ${componentType} section to wireframe`
    });
  };

  // Function to save wireframe to database
  const saveWireframe = async () => {
    try {
      if (!projectId) {
        uiToast({
          title: "Error",
          description: "Project ID is required to save wireframe",
          variant: "destructive",
        });
        return;
      }

      setIsSaving(true);
      console.log("Saving wireframe with ID:", wireframe.id);

      // Create wireframe data with proper type alignment
      const wireframeData = {
        id: wireframe.id, // Include ID if it exists for updates
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

      // Update wireframe ID if it was a new wireframe
      if (result && result.id && (!wireframe.id || wireframe.id !== result.id)) {
        setWireframe({
          ...wireframe,
          id: result.id
        });
        console.log("Wireframe saved with new ID:", result.id);
      }

      setLastSaved(new Date());
      toast.success("Success", {
        description: "Wireframe saved successfully",
        duration: 3000
      });

      return result;
    } catch (error) {
      console.error("Error saving wireframe:", error);
      toast.error("Error", {
        description: "Failed to save wireframe. Please ensure you're logged in.",
        duration: 5000
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle section selection
  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };
  
  // Handle edit section dialog
  const openEditDialog = (sectionId: string) => {
    const section = wireframe.sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSectionId(sectionId);
      setEditingSectionName(section.name);
      setEditingSectionDescription(section.description || '');
      setIsEditDialogOpen(true);
    }
  };
  
  // Handle advanced edit dialog
  const openAdvancedEditDialog = (sectionId: string) => {
    setEditingSectionId(sectionId);
    setIsAdvancedEditDialogOpen(true);
  };
  
  const saveEditSection = () => {
    if (editingSectionId) {
      updateSection(editingSectionId, {
        name: editingSectionName,
        description: editingSectionDescription
      });
      
      setIsEditDialogOpen(false);
      
      toast.success("Section updated", {
        description: "Section details have been updated"
      });
    }
  };

  const handleAdvancedSectionUpdate = (sectionId: string, updates: Partial<WireframeSection>) => {
    updateSection(sectionId, updates);
    
    toast.success("Section updated", {
      description: "Section content has been updated"
    });
  };

  // Handle section deletion
  const handleDeleteSection = (sectionId: string) => {
    removeSection(sectionId);
    
    toast.success("Section removed", {
      description: "Section has been removed from wireframe"
    });
  };

  // Handle drag end event for section list
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderSections(result.source.index, result.destination.index);
    
    toast.success("Sections reordered", {
      description: "The wireframe sections have been reordered"
    });
  };
  
  // Get the current editing section for advanced editor
  const getEditingSection = () => {
    if (!editingSectionId) return null;
    return wireframe.sections.find(s => s.id === editingSectionId) || null;
  };
  
  // Handle Copy JSON
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(wireframe, null, 2));
    toast.success("Wireframe JSON copied to clipboard");
  };
  
  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // Main editor content that will be wrapped by SideBySidePreview
  const editorContent = (
    <div className="wireframe-editor">
      <WireframeToolbar onSave={saveWireframe} />
      
      <div className="flex justify-between my-4">
        <div>
          {lastSaved && (
            <p className="text-sm text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button 
          onClick={togglePreviewMode} 
          variant="outline" 
          className="gap-2"
        >
          {previewMode ? <Columns className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          {previewMode ? "Split View" : "Preview Mode"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Tabs defaultValue="components" className="md:col-span-1">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="components" className="bg-card p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Component Library</h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {components.map(component => (
                  <Button
                    key={component.type}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => handleAddSection(component.type)}
                  >
                    {component.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="sections" className="bg-card p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Section Manager</h3>
            <ScrollArea className="h-[500px]">
              {wireframe.sections.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  No sections added yet. Add components from the Components tab.
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="section-list">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {wireframe.sections.map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                              <SectionControls
                                section={section}
                                sectionIndex={index}
                                totalSections={wireframe.sections.length}
                                isVisible={!hiddenSections.includes(section.id)}
                                provided={provided}
                                onEdit={() => openEditDialog(section.id)}
                                onAdvancedEdit={() => openAdvancedEditDialog(section.id)}
                                onDelete={() => handleDeleteSection(section.id)}
                                onMoveUp={() => reorderSections(index, index - 1)}
                                onMoveDown={() => reorderSections(index, index + 1)}
                                onToggleVisibility={() => toggleSectionVisibility(section.id)}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Canvas Area */}
        <div className="md:col-span-3">
          <WireframeCanvas projectId={projectId} className="min-h-[600px]" onSectionClick={handleSelectSection} />
        </div>
      </div>
      
      {/* Basic Edit Section Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update section details and properties
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sectionName">Section Name</Label>
              <Input
                id="sectionName"
                value={editingSectionName}
                onChange={(e) => setEditingSectionName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sectionDescription">Description</Label>
              <Textarea
                id="sectionDescription"
                value={editingSectionDescription}
                onChange={(e) => setEditingSectionDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <Button onClick={saveEditSection} className="w-full">Save Changes</Button>
        </DialogContent>
      </Dialog>
      
      {/* Advanced Section Edit Dialog */}
      <AdvancedSectionEditDialog
        isOpen={isAdvancedEditDialogOpen}
        onClose={() => setIsAdvancedEditDialogOpen(false)}
        section={getEditingSection()}
        onUpdate={handleAdvancedSectionUpdate}
      />
    </div>
  );

  // Wrap editor content with SideBySidePreview if needed
  return (
    <SideBySidePreview previewMode={previewMode} togglePreviewMode={togglePreviewMode}>
      {editorContent}
    </SideBySidePreview>
  );
};

export default WireframeEditor;
