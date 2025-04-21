
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertMessage } from '@/components/ui/alert-message';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useWireframe } from '@/hooks/useWireframe';
import { AdvancedWireframeGenerator } from '@/components/wireframe';
import { v4 as uuidv4 } from 'uuid';

interface DesignWireframeBridgeProps {
  designData: any;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  projectId?: string;
}

const DesignWireframeBridge: React.FC<DesignWireframeBridgeProps> = ({
  designData,
  onWireframeGenerated,
  projectId
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wireframeData, setWireframeData] = useState<WireframeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [bridgeProjectId] = useState(() => projectId || uuidv4());
  
  const { generateWireframe } = useWireframe({
    projectId: bridgeProjectId,
    showToasts: true
  });
  
  // Generate a prompt based on design data
  useEffect(() => {
    if (!designData) return;

    try {
      // Extract relevant information from design data
      const { 
        businessName, 
        businessType,
        brandStyle,
        colorScheme,
        typography,
        layoutPreferences,
        designElements = {},
      } = designData;
      
      // Create a descriptive prompt based on design data
      let prompt = `Create a ${businessType || 'business'} website`;
      
      if (businessName) {
        prompt += ` for ${businessName}`;
      }
      
      if (brandStyle) {
        prompt += ` with a ${brandStyle} style`;
      }
      
      if (colorScheme && colorScheme.primary) {
        prompt += `. Use ${colorScheme.primary} as the primary color`;
        if (colorScheme.secondary) {
          prompt += ` and ${colorScheme.secondary} as the secondary color`;
        }
      }
      
      if (typography && typography.headings) {
        prompt += `. Use ${typography.headings} for headings`;
        if (typography.body) {
          prompt += ` and ${typography.body} for body text`;
        }
      }
      
      if (layoutPreferences) {
        prompt += `. The layout should be ${layoutPreferences}`;
      }
      
      setGeneratedPrompt(prompt);
    } catch (err) {
      console.error("Error generating prompt from design data:", err);
      setError("Failed to process design data");
    }
  }, [designData]);

  // Handle wireframe generation
  const handleGenerateWireframe = async () => {
    if (!generatedPrompt) {
      toast.error('Cannot generate wireframe: No design data available');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateWireframe({
        description: generatedPrompt,
        projectId: bridgeProjectId
      });
      
      if (result.success && result.wireframe) {
        setWireframeData(result.wireframe);
        
        if (onWireframeGenerated) {
          onWireframeGenerated(result.wireframe);
        }
        
        toast.success('Wireframe generated successfully!');
      } else {
        throw new Error(result.message || 'Failed to generate wireframe');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error('Error generating wireframe: ' + errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper to render status message
  const renderStatus = () => {
    if (error) {
      return (
        <AlertMessage type="error" title="Error">
          {error}
        </AlertMessage>
      );
    }
    
    if (wireframeData) {
      return (
        <AlertMessage type="success" title="Success">
          Wireframe generated successfully!
        </AlertMessage>
      );
    }
    
    return null;
  };

  return (
    <div className="design-wireframe-bridge p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-medium mb-4">Generate Wireframe from Design</h3>
      
      {renderStatus()}
      
      {designData && (
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-muted rounded-md">
            <h4 className="text-sm font-medium mb-2">Generated Prompt</h4>
            <p className="text-sm text-muted-foreground">{generatedPrompt}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <Button 
              onClick={handleGenerateWireframe}
              disabled={isGenerating || !generatedPrompt}
            >
              {isGenerating ? 'Generating...' : 'Generate Wireframe'}
            </Button>
            
            {wireframeData && (
              <Button 
                variant="outline"
                onClick={() => setWireframeData(null)}
              >
                Reset
              </Button>
            )}
          </div>
          
          {wireframeData && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <AdvancedWireframeGenerator
                projectId={bridgeProjectId}
                initialWireframeData={wireframeData}
                viewMode="preview"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignWireframeBridge;
