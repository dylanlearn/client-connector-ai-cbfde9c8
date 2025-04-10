import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedWireframe } from '@/hooks/use-advanced-wireframe';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { DeviceType, ViewMode } from './types';
import { v4 as uuidv4 } from 'uuid';
import WireframeVisualizer from './WireframeVisualizer';

interface AdvancedWireframeGeneratorProps {
  projectId?: string;
  viewMode?: ViewMode;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  initialPrompt?: string;
  enhancedCreativity?: boolean;
  intakeData?: any;
}

const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId = uuidv4(),
  viewMode = 'preview',
  onWireframeGenerated,
  initialPrompt = '',
  enhancedCreativity = false,
  intakeData
}) => {
  const { toast } = useToast();
  const { 
    isGenerating, 
    currentWireframe, 
    generationResults, 
    intentData, 
    blueprint, 
    generateWireframe, 
    saveWireframe, 
    error 
  } = useAdvancedWireframe();
  
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isEnhancedCreativity, setIsEnhancedCreativity] = useState<boolean>(enhancedCreativity);
  const [wireframeTitle, setWireframeTitle] = useState<string>('New Wireframe');
  const [wireframeDescription, setWireframeDescription] = useState<string>('Describe your wireframe');

  // Function to handle section click
  const handleSectionClick = useCallback((sectionId: string) => {
    // Set the selected section ID
    setSelectedSectionId(sectionId);
  }, []);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleGenerateWireframe = async () => {
    if (!projectId) {
      toast({
        title: "Project ID is required",
        description: "Please provide a valid project ID.",
        variant: "destructive"
      });
      return;
    }

    const params = {
      projectId: projectId,
      prompt: prompt,
      enhancedCreativity: isEnhancedCreativity,
      intakeData: intakeData
    };

    const result = await generateWireframe(params);

    if (result && result.success && onWireframeGenerated && result.wireframe) {
      onWireframeGenerated(result.wireframe);
    }
  };

  const handleSaveWireframe = async () => {
    if (!projectId) {
      toast({
        title: "Project ID is required",
        description: "Please provide a valid project ID.",
        variant: "destructive"
      });
      return;
    }

    if (!currentWireframe) {
      toast({
        title: "No wireframe to save",
        description: "Please generate a wireframe before saving.",
        variant: "destructive"
      });
      return;
    }

    await saveWireframe(projectId, wireframeDescription);
  };

  return (
    <div className="advanced-wireframe-generator">
      <div className="prompt-input-area space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Wireframe Generator</h3>
          <div className="creativity-toggle">
            <label htmlFor="creativity" className="text-sm text-muted-foreground mr-2">
              Enhanced Creativity
            </label>
            <input
              type="checkbox"
              id="creativity"
              checked={isEnhancedCreativity}
              onChange={(e) => setIsEnhancedCreativity(e.target.checked)}
              className="border rounded-sm h-4 w-4 text-primary focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter wireframe title"
            value={wireframeTitle}
            onChange={(e) => setWireframeTitle(e.target.value)}
            className="border rounded-md px-3 py-2 w-1/3"
          />
          <input
            type="text"
            placeholder="Describe your wireframe"
            value={wireframeDescription}
            onChange={(e) => setWireframeDescription(e.target.value)}
            className="border rounded-md px-3 py-2 w-2/3"
          />
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />
          <Button
            onClick={handleGenerateWireframe}
            disabled={isGenerating}
            className="ml-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Wireframe"
            )}
          </Button>
        </div>
      </div>

      {currentWireframe && (
        <div className="wireframe-preview mt-4">
          <WireframeVisualizer
            wireframe={currentWireframe}
            darkMode={false}
            deviceType={deviceType}
            onSectionClick={handleSectionClick}
            selectedSectionId={selectedSectionId}
          />
        </div>
      )}

      <div className="actions mt-4">
        <Button
          onClick={handleSaveWireframe}
          disabled={isGenerating || !currentWireframe}
        >
          Save Wireframe
        </Button>
      </div>
    </div>
  );
};

export default AdvancedWireframeGenerator;
