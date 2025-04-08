
import React, { useState, useEffect } from 'react';
import { useComponentRegistry } from './registry/ComponentRegistration';
import { getAllComponentDefinitions } from './registry/component-registry';
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
import { GripVertical, Columns, EyeIcon, Save } from 'lucide-react';
import AdvancedSectionEditDialog from './AdvancedSectionEditDialog';
import SideBySidePreview from './SideBySidePreview';
import { useAuth } from '@/hooks/use-auth';
import { useWireframeEditor } from '@/hooks/wireframe/use-wireframe-editor';

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
  const [saveAttempted, setSaveAttempted] = useState(false);
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  
  // Use the Zustand store for section state management
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
    toggleSectionVisibility,
    updateCanvasSettings,
    canvasSettings
  } = useWireframeStore();
  
  // Use our new wireframe editor hook
  const {
    isLoading,
    error,
    project,
    canvas,
    initializeEditor,
  } = useWireframeEditor(projectId);

  useEffect(() => {
    // Get all registered component definitions
    const definitions = getAllComponentDefinitions();
    setComponents(definitions);
  }, []);

  // Initialize editor when component mounts
  useEffect(() => {
    if (projectId) {
      initializeEditor(projectId);
    }
  }, [projectId, initializeEditor]);

  // Function to add a new section from the component library
  const handleAddSection = (componentType: string) => {
    const sectionName = componentType.charAt(0).toUpperCase() + componentType.slice(1);
    
    addSection({
      name: sectionName,
      sectionType: componentType,
      layoutType: 'default',
      description: `A ${componentType} section`,
    });
    
    toast.success("Section added", {
      description: `Added ${componentType} section to wireframe`,
      duration: 3000
    });
  };

  // Function to save wireframe to database
  const saveWireframe = async () => {
    try {
      setSaveAttempted(true);
      
      // Check if user is authenticated
      if (!user && projectId) {
        uiToast({
          title: "Authentication Required",
          description: "You need to be logged in to save wireframes.",
          variant: "destructive",
          duration: 5000
        });
        return null;
      }

      if (!projectId) {
        uiToast({
          title: "Error",
          description: "Project ID is required to save wireframe",
          variant: "destructive",
          duration: 5000
        });
        return null;
      }

      setIsSaving(true);
      console.log("Saving wireframe with ID:", wireframe.id || "new wireframe");

      // TODO: Implement saving to database via WireframeMemoryService
      // This is a placeholder for now
      
      setLastSaved(new Date());
      toast.success("Wireframe saved", {
        description: "Wireframe saved successfully",
        duration: 5000
      });

    } catch (error: any) {
      console.error("Error saving wireframe:", error);
      toast.error("Error saving wireframe", {
        description: error.message || "Failed to save wireframe. Please ensure you're logged in.",
        duration: 8000
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
        description: "Section details have been updated",
        duration: 3000
      });
    }
  };

  const handleAdvancedSectionUpdate = (sectionId: string, updates: any) => {
    updateSection(sectionId, updates);
    
    toast.success("Section updated", {
      description: "Section content has been updated",
      duration: 3000
    });
  };

  // Handle section deletion
  const handleDeleteSection = (sectionId: string) => {
    removeSection(sectionId);
    
    toast.success("Section removed", {
      description: "Section has been removed from wireframe",
      duration: 3000
    });
  };

  // Handle drag end event for section list
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderSections(result.source.index, result.destination.index);
    
    toast.success("Sections reordered", {
      description: "The wireframe sections have been reordered",
      duration: 3000
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
    toast.success("Wireframe JSON copied to clipboard", {
      duration: 3000
    });
  };
  
  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // Update canvas settings (zoom, grid, etc.)
  const handleUpdateCanvasSettings = (updates: any) => {
    updateCanvasSettings(updates);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg text-red-800">
        <h3 className="text-lg font-medium">Error loading wireframe editor</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Main editor content that will be wrapped by SideBySidePreview
  const editorContent = (
    <div className="wireframe-editor">
      <WireframeToolbar onSave={saveWireframe} />
      
      <div className="flex justify-between my-4">
        <div className="flex items-center">
          {lastSaved && (
            <p className="text-sm text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
          {!lastSaved && saveAttempted && (
            <p className="text-sm text-amber-500">
              Not saved yet
            </p>
          )}
          {isSaving && (
            <p className="text-sm text-blue-500 ml-4">
              Saving...
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={saveWireframe} 
            variant="outline"
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button 
            onClick={togglePreviewMode} 
            variant="outline" 
            className="gap-2"
          >
            {previewMode ? <Columns className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            {previewMode ? "Split View" : "Preview Mode"}
          </Button>
        </div>
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
          <WireframeCanvas 
            projectId={projectId} 
            className="min-h-[600px]" 
            onSectionClick={handleSelectSection}
            canvasSettings={canvasSettings}
            onUpdateCanvasSettings={handleUpdateCanvasSettings}
          />
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
