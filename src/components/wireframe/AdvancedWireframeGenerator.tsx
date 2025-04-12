
import React, { useState, useEffect } from 'react';
import { useWireframeGeneration } from '@/hooks/use-wireframe-generation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { WireframeGenerationParams, WireframeGenerationResult } from '@/services/ai/wireframe/wireframe-types';
import Wireframe from './Wireframe';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdvancedWireframeGeneratorProps {
  projectId: string;
  viewMode?: 'edit' | 'preview' | 'code';
  onWireframeGenerated?: (wireframe: WireframeGenerationResult) => void;
  onError?: (error: Error) => void;
  enhancedCreativity?: boolean;
  intakeData?: any;
}

export const AdvancedWireframeGenerator: React.FC<AdvancedWireframeGeneratorProps> = ({
  projectId,
  viewMode = 'edit',
  onWireframeGenerated,
  onError,
  enhancedCreativity = true,
  intakeData,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const {
    isGenerating,
    currentWireframe,
    error,
    generateWireframe,
  } = useWireframeGeneration();

  // If intakeData is provided, use it to get a better prompt
  useEffect(() => {
    if (intakeData && Object.keys(intakeData).length > 0) {
      // Build a prompt from the intake data if we have it
      try {
        const { 
          businessName, 
          businessType,
          mission,
          vision,
          targetAudience,
          industryType,
          brandPersonality,
          designPreferences = {},
        } = intakeData;
        
        // Create a descriptive prompt based on intake data
        let generatedPrompt = `Create a ${businessType || 'business'} website`;
        
        if (businessName) {
          generatedPrompt += ` for ${businessName}`;
        }
        
        if (industryType) {
          generatedPrompt += ` in the ${industryType} industry`;
        }
        
        if (targetAudience) {
          generatedPrompt += ` targeting ${targetAudience}`;
        }
        
        if (mission || vision) {
          generatedPrompt += `. The brand ${mission ? `has a mission to ${mission}` : ''}${mission && vision ? ' and' : ''}${vision ? ` envisions ${vision}` : ''}`;
        }
        
        if (brandPersonality) {
          generatedPrompt += `. The brand personality is ${brandPersonality}`;
        }
        
        if (designPreferences.visualStyle) {
          generatedPrompt += `. Use a ${designPreferences.visualStyle} design style`;
        }
        
        setPrompt(generatedPrompt);
      } catch (err) {
        console.error("Error generating prompt from intake data in AdvancedWireframeGenerator:", err);
      }
    }
  }, [intakeData]);

  const handleGenerateWireframe = async () => {
    if (!prompt.trim()) return;
    
    try {
      console.log('Submitting wireframe generation with prompt:', prompt);
      const params: WireframeGenerationParams = {
        description: prompt,
        projectId: projectId,
        enhancedCreativity: enhancedCreativity,
        intakeData: intakeData
      };
      
      const result = await generateWireframe(params);
      
      if (result && result.wireframe) {
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
      } else if (onError) {
        onError(new Error('No wireframe was generated'));
      }
    } catch (err) {
      console.error('Error in wireframe generation:', err);
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Textarea
          placeholder="Describe your wireframe in detail. Include sections, layout structure, and responsive behavior..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          className="w-full resize-y"
        />
        <Button 
          onClick={handleGenerateWireframe} 
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Wireframe...
            </>
          ) : (
            'Generate Wireframe'
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentWireframe && currentWireframe.wireframe && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-2">{currentWireframe.wireframe.title}</h3>
            <div className="border rounded-md overflow-hidden">
              <Wireframe
                wireframe={currentWireframe.wireframe}
                viewMode="preview"
                deviceType="desktop"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedWireframeGenerator;
