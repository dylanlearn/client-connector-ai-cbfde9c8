
import React, { useState, useEffect, useCallback } from 'react';
import { WireframeVisualizer } from '.';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Laptop, Smartphone, Tablet, Moon, Sun, Save } from 'lucide-react';
import { WireframeService } from '@/services/ai/wireframe/wireframe-service';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';
import { DeviceType, ViewMode, WireframeState } from './types';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

interface WireframeEditorProps {
  projectId?: string;
  wireframeData?: WireframeData;
  onUpdate?: (wireframe: WireframeData) => void;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({
  projectId,
  wireframeData,
  onUpdate,
}) => {
  const { toast } = useToast();
  
  // State for wireframe editing
  const [wireframe, setWireframe] = useState<WireframeState>({
    id: wireframeData?.id || '',
    title: wireframeData?.title || 'New Wireframe',
    description: wireframeData?.description || '',
    sections: wireframeData?.sections || [],
    styleToken: wireframeData?.styleToken || 'modern',
    colorScheme: wireframeData?.colorScheme || {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f97316',
      background: '#ffffff',
    },
  });
  
  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Update internal state when wireframeData changes
  useEffect(() => {
    if (wireframeData) {
      setWireframe({
        id: wireframeData.id,
        title: wireframeData.title || 'New Wireframe',
        description: wireframeData.description || '',
        sections: wireframeData.sections || [],
        styleToken: wireframeData.styleToken || 'modern',
        colorScheme: wireframeData.colorScheme || {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#f97316',
          background: '#ffffff',
        },
      });
    }
  }, [wireframeData]);

  // Handle save wireframe
  const saveWireframe = useCallback(async () => {
    if (!wireframe.title) {
      toast({
        title: 'Title Required',
        description: 'Please provide a title for your wireframe',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Ensure we have a proper WireframeData object with required fields
      const wireframeToSave: WireframeData = {
        id: wireframe.id || crypto.randomUUID(),
        title: wireframe.title,
        description: wireframe.description || '',
        sections: wireframe.sections,
        colorScheme: wireframe.colorScheme || {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#f97316',
          background: '#ffffff',
        },
        styleToken: wireframe.styleToken,
      };

      // Save wireframe using the service
      const savedWireframe = await WireframeService.createWireframe({
        title: wireframeToSave.title,
        description: wireframeToSave.description || '',
        data: wireframeToSave,
        sections: wireframeToSave.sections,
      });

      if (savedWireframe) {
        toast({
          title: 'Success',
          description: 'Wireframe saved successfully',
        });

        // Update state with saved wireframe
        setWireframe(prev => ({ ...prev, id: savedWireframe.id }));
        
        // Notify parent component if needed
        if (onUpdate) {
          onUpdate(savedWireframe);
        }
      }
    } catch (error) {
      console.error('Error saving wireframe:', error);
      toast({
        title: 'Error',
        description: 'Failed to save wireframe',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [wireframe, toast, onUpdate]);

  // Handle section click
  const handleSectionClick = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
    // Find section details for editing
    const section = wireframe.sections.find((s) => s.id === sectionId);
    if (section) {
      console.log('Selected section:', section);
      // Here you would populate a section editor form
    }
  }, [wireframe.sections]);

  // Export wireframe JSON
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(wireframe, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `wireframe-${wireframe.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exported',
      description: 'Wireframe JSON has been downloaded',
    });
  }, [wireframe, toast]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            value={wireframe.title}
            onChange={(e) => setWireframe({ ...wireframe, title: e.target.value })}
            className="max-w-[300px]"
            placeholder="Wireframe title"
          />
          <Button onClick={saveWireframe} disabled={isSaving} variant="default" size="sm">
            {isSaving ? 'Saving...' : 'Save'}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Toggle pressed={darkMode} onPressedChange={setDarkMode} variant="outline" size="sm">
            {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Toggle>
          <div className="flex border rounded-md">
            <Button
              variant={deviceType === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('desktop')}
              className="rounded-r-none"
            >
              <Laptop className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceType === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('tablet')}
              className="rounded-none"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceType === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceType('mobile')}
              className="rounded-l-none"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="preview" className="flex-grow flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="preview" onClick={() => setViewMode('preview')}>Preview</TabsTrigger>
          <TabsTrigger value="edit" onClick={() => setViewMode('editor')}>Edit</TabsTrigger>
          <TabsTrigger value="code" onClick={() => setViewMode('code')}>Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="flex-grow overflow-auto p-4">
          <div
            className={`mx-auto ${
              deviceType === 'mobile'
                ? 'max-w-sm'
                : deviceType === 'tablet'
                ? 'max-w-2xl'
                : 'max-w-7xl'
            }`}
          >
            {wireframe.sections.length > 0 ? (
              <WireframeVisualizer
                wireframe={wireframe as WireframeData}
                darkMode={darkMode}
                deviceType={deviceType}
                viewMode={viewMode}
                onSectionClick={handleSectionClick}
                selectedSectionId={selectedSectionId || undefined}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 p-12 text-center rounded-lg">
                <p className="text-muted-foreground">No sections added yet. Generate a wireframe or add sections manually.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="edit" className="flex-grow overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Wireframe Settings</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium block mb-1">Title</label>
                    <Input
                      value={wireframe.title}
                      onChange={(e) => setWireframe({ ...wireframe, title: e.target.value })}
                      placeholder="Wireframe title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Description</label>
                    <Input
                      value={wireframe.description || ''}
                      onChange={(e) => setWireframe({ ...wireframe, description: e.target.value })}
                      placeholder="Wireframe description"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Style Token</label>
                    <Input
                      value={wireframe.styleToken || ''}
                      onChange={(e) => setWireframe({ ...wireframe, styleToken: e.target.value })}
                      placeholder="e.g. modern, minimal, etc."
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Color Scheme</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium block mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={wireframe.colorScheme?.primary || '#3b82f6'}
                        onChange={(e) =>
                          setWireframe({
                            ...wireframe,
                            colorScheme: {
                              ...wireframe.colorScheme as any,
                              primary: e.target.value
                            }
                          })
                        }
                        className="w-8 h-8 p-0 border-0"
                      />
                      <Input
                        value={wireframe.colorScheme?.primary || '#3b82f6'}
                        onChange={(e) =>
                          setWireframe({
                            ...wireframe,
                            colorScheme: {
                              ...wireframe.colorScheme as any,
                              primary: e.target.value
                            }
                          })
                        }
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={wireframe.colorScheme?.secondary || '#10b981'}
                        onChange={(e) =>
                          setWireframe({
                            ...wireframe,
                            colorScheme: {
                              ...wireframe.colorScheme as any,
                              secondary: e.target.value
                            }
                          })
                        }
                        className="w-8 h-8 p-0 border-0"
                      />
                      <Input
                        value={wireframe.colorScheme?.secondary || '#10b981'}
                        onChange={(e) =>
                          setWireframe({
                            ...wireframe,
                            colorScheme: {
                              ...wireframe.colorScheme as any,
                              secondary: e.target.value
                            }
                          })
                        }
                        className="font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={wireframe.colorScheme?.accent || '#f97316'}
                        onChange={(e) =>
                          setWireframe({
                            ...wireframe,
                            colorScheme: {
                              ...wireframe.colorScheme as any,
                              accent: e.target.value
                            }
                          })
                        }
                        className="w-8 h-8 p-0 border-0"
                      />
                      <Input
                        value={wireframe.colorScheme?.accent || '#f97316'}
                        onChange={(e) =>
                          setWireframe({
                            ...wireframe,
                            colorScheme: {
                              ...wireframe.colorScheme as any,
                              accent: e.target.value
                            }
                          })
                        }
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="border rounded-lg h-full overflow-auto">
                <div className="p-4 border-b bg-muted/50">
                  <h3 className="font-medium">Wireframe Preview</h3>
                </div>
                <div className="p-4">
                  <WireframeVisualizer
                    wireframe={wireframe as WireframeData}
                    darkMode={darkMode}
                    deviceType={deviceType}
                    viewMode="editor"
                    onSectionClick={handleSectionClick}
                    selectedSectionId={selectedSectionId || undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-grow overflow-auto">
          <div className="p-4">
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-auto max-h-[70vh] whitespace-pre-wrap">
                {JSON.stringify(wireframe, null, 2)}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleExport} variant="outline" size="sm">
                Export JSON
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WireframeEditor;
