
import React, { useState, useCallback, useEffect } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useWireframeHistory } from '@/hooks/use-wireframe-history';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedWireframe } from '@/hooks/use-enhanced-wireframe';
import {
  PanelLeft,
  PanelRight,
  Undo2,
  Redo2,
  Save,
  Download,
  Sparkles,
  RotateCcw,
  Braces,
  LayoutGrid,
  Settings,
  MonitorSmartphone,
  EyeIcon,
  EditIcon,
  CodeIcon,
} from 'lucide-react';
import { DeviceType, ViewMode } from './types';
import WireframePreviewSystem from './preview/WireframePreviewSystem';
import WireframeAISuggestions from './ai/WireframeAISuggestions';
import WireframeExportDialog from './export/WireframeExportDialog';
import AdvancedSectionEditDialog from './AdvancedSectionEditDialog';

interface WireframeEditorProps {
  projectId?: string;
  wireframe: WireframeData;
  onUpdate?: (wireframe: WireframeData) => void;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({
  projectId,
  wireframe: initialWireframe,
  onUpdate,
}) => {
  // Initialize wireframe history for undo/redo functionality
  const {
    wireframe,
    updateWireframe,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useWireframeHistory(initialWireframe);

  const { applyFeedback, isGenerating } = useAdvancedWireframe();
  const { toast } = useToast();

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isEditingSectionDialog, setIsEditingSectionDialog] = useState(false);

  // Get the selected section
  const selectedSection = wireframe?.sections?.find(section => section.id === selectedSectionId) || null;

  // Update wireframe metadata
  const updateWireframeMetadata = useCallback((field: string, value: string) => {
    if (!wireframe) return;

    const updatedWireframe = {
      ...wireframe,
      [field]: value,
    };

    updateWireframe(updatedWireframe, `Update ${field}`);
    if (onUpdate) {
      onUpdate(updatedWireframe);
    }
  }, [wireframe, updateWireframe, onUpdate]);

  // Handle section selection
  const handleSectionClick = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
  }, []);

  // Update a section
  const updateSection = useCallback((sectionId: string, updates: Partial<WireframeSection>) => {
    if (!wireframe) return;

    const sectionIndex = wireframe.sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;

    const updatedSections = [...wireframe.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      ...updates,
    };

    const updatedWireframe = {
      ...wireframe,
      sections: updatedSections,
    };

    updateWireframe(updatedWireframe, 'Update section');
    if (onUpdate) {
      onUpdate(updatedWireframe);
    }
  }, [wireframe, updateWireframe, onUpdate]);

  // Handle AI feedback application
  const handleApplyFeedback = useCallback(async (feedback: string) => {
    if (!wireframe) return;

    try {
      const result = await applyFeedback(wireframe, feedback);

      if (result.success && result.wireframe) {
        // Apply the updated wireframe
        updateWireframe(result.wireframe, 'Apply AI feedback');
        if (onUpdate) {
          onUpdate(result.wireframe);
        }

        toast({
          title: 'Feedback Applied',
          description: 'The wireframe has been updated based on your feedback',
        });
      }
    } catch (error) {
      console.error('Error applying feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply feedback',
        variant: 'destructive',
      });
    }
  }, [wireframe, applyFeedback, updateWireframe, onUpdate, toast]);

  // Handle AI suggestion application
  const handleApplySuggestion = useCallback((suggestion: any) => {
    if (!wireframe || !suggestion) return;

    try {
      // If the suggestion targets a specific section
      if (suggestion.sectionId && suggestion.changes) {
        updateSection(suggestion.sectionId, suggestion.changes);
      }
      // If it's a general wireframe suggestion
      else if (suggestion.changes) {
        const updatedWireframe = {
          ...wireframe,
          ...suggestion.changes,
        };

        updateWireframe(updatedWireframe, `Apply suggestion: ${suggestion.title}`);
        if (onUpdate) {
          onUpdate(updatedWireframe);
        }
      }

      toast({
        title: 'Suggestion Applied',
        description: suggestion.title,
      });
    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply suggestion',
        variant: 'destructive',
      });
    }
  }, [wireframe, updateSection, updateWireframe, onUpdate, toast]);

  // Save wireframe
  const handleSave = useCallback(() => {
    if (!wireframe) return;

    // If onUpdate callback is provided, call it
    if (onUpdate) {
      onUpdate(wireframe);
    }

    toast({
      title: 'Wireframe Saved',
      description: 'Your wireframe has been saved successfully',
    });
  }, [wireframe, onUpdate, toast]);

  // Update if the initial wireframe changes (e.g., after a new generation)
  useEffect(() => {
    if (initialWireframe && initialWireframe.id !== wireframe?.id) {
      resetHistory(initialWireframe);
    }
  }, [initialWireframe, wireframe?.id, resetHistory]);

  if (!wireframe) {
    return <div>Loading wireframe...</div>;
  }

  return (
    <div className="wireframe-editor h-full">
      {/* Header with tabs and actions */}
      <div className="flex items-center justify-between p-2 border-b">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
          <TabsList>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <EditIcon className="h-4 w-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-1">
              <CodeIcon className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            title="Toggle Left Panel"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo"
            >
              <Undo2 className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Undo</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo"
            >
              <Redo2 className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Redo</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAISuggestions(true)}
              title="AI Suggestions"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">AI Suggestions</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDialog(true)}
              title="Export"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Export</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowRightPanel(!showRightPanel)}
            title="Toggle Right Panel"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex h-[calc(100%-3rem)]">
        {/* Left panel - Wireframe structure */}
        {showLeftPanel && (
          <div className="w-64 border-r h-full overflow-y-auto p-4 flex flex-col">
            <div className="space-y-4">
              {/* Wireframe metadata */}
              <div>
                <Label htmlFor="title">Wireframe Title</Label>
                <Input
                  id="title"
                  value={wireframe.title}
                  onChange={(e) => updateWireframeMetadata('title', e.target.value)}
                  className="mb-2"
                />

                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={wireframe.description || ''}
                  onChange={(e) => updateWireframeMetadata('description', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Sections list */}
              <div>
                <h3 className="text-sm font-medium mb-2">Sections</h3>
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {wireframe.sections.map((section) => (
                    <div
                      key={section.id}
                      className={`
                        p-2 rounded-md cursor-pointer text-sm
                        ${selectedSectionId === section.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      `}
                      onClick={() => handleSectionClick(section.id)}
                    >
                      {section.name || section.sectionType || 'Unnamed Section'}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mobile actions for small screens */}
              <div className="md:hidden space-y-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAISuggestions(true)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Suggestions
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowExportDialog(true)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Save button */}
              <div className="mt-auto pt-4">
                <Button
                  className="w-full"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Wireframe
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-grow overflow-auto">
          <TabsContent value="preview" className="h-full">
            <WireframePreviewSystem
              wireframe={wireframe}
              onSectionClick={handleSectionClick}
              onExport={() => setShowExportDialog(true)}
              projectId={projectId}
            />
          </TabsContent>

          <TabsContent value="edit" className="h-full p-4">
            <div className="h-full overflow-y-auto">
              {selectedSection ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      Editing: {selectedSection.name || selectedSection.sectionType || 'Section'}
                    </h2>
                    <Button
                      variant="default"
                      onClick={() => setIsEditingSectionDialog(true)}
                    >
                      Advanced Edit
                    </Button>
                  </div>

                  {/* Basic section details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sectionName">Section Name</Label>
                      <Input
                        id="sectionName"
                        value={selectedSection.name || ''}
                        onChange={(e) => updateSection(selectedSection.id, { name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sectionType">Section Type</Label>
                      <Input
                        id="sectionType"
                        value={selectedSection.sectionType || ''}
                        onChange={(e) => updateSection(selectedSection.id, { sectionType: e.target.value })}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Show info to use the advanced editor */}
                  <div className="bg-muted p-4 rounded-md text-sm">
                    <p>Use the Advanced Edit button for complete control over this section.</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <p>Select a section to edit</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="h-full">
            <div className="p-4 h-full overflow-auto">
              <pre className="text-xs bg-muted p-4 rounded whitespace-pre-wrap">
                {JSON.stringify(wireframe, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </div>

        {/* Right panel - Settings and properties */}
        {showRightPanel && (
          <div className="w-64 border-l h-full overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceType">Device Preview</Label>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant={deviceType === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setDeviceType('desktop')}
                      >
                        Desktop
                      </Button>
                      <Button
                        variant={deviceType === 'tablet' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setDeviceType('tablet')}
                      >
                        Tablet
                      </Button>
                      <Button
                        variant={deviceType === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setDeviceType('mobile')}
                      >
                        Mobile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSection && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4" />
                    Selected Section
                  </h3>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Type: {selectedSection.sectionType}</p>
                    <p className="text-sm font-medium">ID: {selectedSection.id.substring(0, 8)}...</p>
                    
                    {selectedSection.componentVariant && (
                      <p className="text-sm font-medium">Variant: {selectedSection.componentVariant}</p>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setIsEditingSectionDialog(true)}
                    >
                      Edit Section
                    </Button>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MonitorSmartphone className="h-4 w-4" />
                  Preview Options
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="highlightSections" 
                      checked={viewMode === 'edit'}
                      onChange={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                    />
                    <Label htmlFor="highlightSections">Highlight Sections</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section edit dialog */}
      {isEditingSectionDialog && selectedSection && (
        <AdvancedSectionEditDialog
          isOpen={isEditingSectionDialog}
          onClose={() => setIsEditingSectionDialog(false)}
          section={selectedSection}
          onUpdate={updateSection}
        />
      )}

      {/* AI Suggestions dialog */}
      {showAISuggestions && (
        <WireframeAISuggestions
          wireframeId={wireframe.id}
          focusedSectionId={selectedSectionId || undefined}
          onClose={() => setShowAISuggestions(false)}
          onApplySuggestion={handleApplySuggestion}
        />
      )}

      {/* Export dialog */}
      <WireframeExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        wireframe={wireframe}
      />
    </div>
  );
};

export default WireframeEditor;
