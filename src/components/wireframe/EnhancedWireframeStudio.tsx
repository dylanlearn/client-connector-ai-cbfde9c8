import React, { useState, useEffect, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Settings, Code, Eye, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWireframeStore } from '@/stores/wireframe-store';
import WireframeVisualizer from './WireframeVisualizer';
import WireframeCanvasFabric from './WireframeCanvasFabric';
import WireframeAISuggestions from './WireframeAISuggestions';
import { DeviceType, ViewMode } from './types';

interface EnhancedWireframeStudioProps {
  projectId: string;
  initialData?: WireframeData;
  standalone?: boolean;
  onUpdate?: (data: WireframeData) => void;
  onSave?: (data: WireframeData) => Promise<void>;
  viewMode?: 'edit' | 'preview';
}

// Helper function to ensure complete WireframeData
const ensureCompleteWireframeData = (partialData: Partial<WireframeData>): WireframeData => {
  return {
    id: partialData.id || uuidv4(), // Ensure id is always present
    title: partialData.title || 'New Wireframe',
    description: partialData.description || '',
    sections: partialData.sections || [],
    colorScheme: partialData.colorScheme || {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    },
    typography: partialData.typography || {
      headings: 'sans-serif',
      body: 'sans-serif'
    },
    style: partialData.style || '',
    // Include other required fields with defaults
    ...partialData
  };
};

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({
  projectId,
  initialData,
  standalone = false,
  onUpdate,
  onSave,
  viewMode = 'preview'
}) => {
  const { toast } = useToast();
  const [viewModeState, setViewModeState] = useState<ViewMode>(viewMode);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [showAISuggestions, setShowAISuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  
  const {
    wireframe,
    setWireframe,
    darkMode,
    toggleDarkMode,
    setActiveDevice,
    activeSection,
    setActiveSection
  } = useWireframeStore();
  
  // Initialize wireframe from props or create a new one
  useEffect(() => {
    if (initialData) {
      setWireframe(ensureCompleteWireframeData(initialData));
    } else if (!wireframe) {
      // Create a default wireframe if none exists
      setWireframe(ensureCompleteWireframeData({
        id: uuidv4(),
        title: 'New Wireframe',
        description: 'Start designing your wireframe',
        sections: []
      }));
    }
  }, [initialData, wireframe, setWireframe]);
  
  // Handle section selection
  const handleSectionClick = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
    setActiveSection(sectionId);
  }, [setActiveSection]);
  
  // Handle save action
  const handleSave = useCallback(() => {
    if (!wireframe) return;
    
    setIsLoading(true);
    try {
      if (onSave) {
        onSave(wireframe);
      }
      toast({
        title: "Success",
        description: "Wireframe saved successfully",
      });
    } catch (error) {
      console.error("Error saving wireframe:", error);
      toast({
        title: "Error",
        description: "Failed to save wireframe",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [wireframe, onSave, toast]);
  
  // Handle export action
  const handleExport = useCallback((format: string) => {
    if (!wireframe) return;
    
    setIsLoading(true);
    try {
      if (onExport) {
        onExport(wireframe, format);
      }
      toast({
        title: "Success",
        description: `Wireframe exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Error exporting wireframe:", error);
      toast({
        title: "Error",
        description: "Failed to export wireframe",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [wireframe, onExport, toast]);
  
  // Toggle AI suggestions panel
  const toggleAISuggestions = useCallback(() => {
    setShowAISuggestions(prev => !prev);
  }, []);
  
  return (
    <div className="enhanced-wireframe-studio">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">{wireframe?.title || 'Wireframe Studio'}</h2>
          {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View mode selector */}
          <Tabs value={viewModeState} onValueChange={(value) => setViewModeState(value as ViewMode)}>
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center">
                <Code className="h-4 w-4 mr-1" />
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Device type selector */}
          <div className="flex border rounded-md">
            <Button 
              variant={deviceType === 'desktop' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => {
                setDeviceType('desktop');
                setActiveDevice('desktop');
              }}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              variant={deviceType === 'tablet' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => {
                setDeviceType('tablet');
                setActiveDevice('tablet');
              }}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              variant={deviceType === 'mobile' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => {
                setDeviceType('mobile');
                setActiveDevice('mobile');
              }}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Dark mode toggle */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleDarkMode}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          
          {/* AI Suggestions toggle */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleAISuggestions}
          >
            {showAISuggestions ? 'Hide AI Suggestions' : 'Show AI Suggestions'}
          </Button>
          
          {/* Save button */}
          {!standalone && (
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              Save
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${showAISuggestions ? 'md:col-span-3' : 'md:col-span-4'}`}>
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Wireframe</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {viewModeState === 'preview' && wireframe && (
                <WireframeVisualizer
                  wireframe={wireframe}
                  darkMode={darkMode}
                  deviceType={deviceType}
                  viewMode={viewModeState}
                  onSectionClick={handleSectionClick}
                  selectedSectionId={selectedSectionId}
                  preview={true}
                />
              )}
              
              {viewModeState === 'editor' && (
                <WireframeCanvasFabric
                  projectId={projectId}
                  deviceType={deviceType}
                  onSectionClick={handleSectionClick}
                  editMode={!standalone}
                />
              )}
              
              {viewModeState === 'code' && (
                <div className="p-4">
                  <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[600px]">
                    <code>
                      {JSON.stringify(wireframe, null, 2)}
                    </code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {showAISuggestions && (
          <div className="md:col-span-1">
            <WireframeAISuggestions onClose={toggleAISuggestions} />
          </div>
        )}
      </div>
    </div>
  );
};

export { EnhancedWireframeStudio, ensureCompleteWireframeData };
export default EnhancedWireframeStudio;
