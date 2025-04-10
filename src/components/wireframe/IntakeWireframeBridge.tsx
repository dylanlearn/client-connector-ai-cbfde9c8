
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { AdvancedWireframeGenerator } from '@/components/wireframe';
import { v4 as uuidv4 } from 'uuid';

interface IntakeWireframeBridgeProps {
  intakeData: any;
  onWireframeGenerated?: (wireframe: WireframeData) => void;
  projectId?: string;
}

const IntakeWireframeBridge: React.FC<IntakeWireframeBridgeProps> = ({
  intakeData,
  onWireframeGenerated,
  projectId
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [wireframeData, setWireframeData] = useState<WireframeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [bridgeProjectId] = useState(() => projectId || uuidv4());
  
  // Generate a prompt based on intake data
  useEffect(() => {
    if (!intakeData) return;

    try {
      // Extract relevant information from intake data
      const { 
        businessName, 
        businessType,
        mission,
        vision,
        targetAudience,
        industryType,
        brandPersonality,
        primaryColor,
        designPreferences = {},
      } = intakeData;
      
      // Create a descriptive prompt based on intake data
      let prompt = `Create a ${businessType || 'business'} website`;
      
      if (businessName) {
        prompt += ` for ${businessName}`;
      }
      
      if (industryType) {
        prompt += ` in the ${industryType} industry`;
      }
      
      if (targetAudience) {
        prompt += ` targeting ${targetAudience}`;
      }
      
      if (mission || vision) {
        prompt += `. The brand ${mission ? `has a mission to ${mission}` : ''}${mission && vision ? ' and' : ''}${vision ? ` envisions ${vision}` : ''}`;
      }
      
      if (brandPersonality) {
        prompt += `. The brand personality is ${brandPersonality}`;
      }
      
      if (designPreferences.visualStyle) {
        prompt += `. Use a ${designPreferences.visualStyle} design style`;
      }
      
      setGeneratedPrompt(prompt);
    } catch (err) {
      console.error("Error generating prompt from intake data:", err);
      setError("Failed to process intake data");
    }
  }, [intakeData]);

  // Handler for when a wireframe is generated
  const handleWireframeGenerated = (generatedWireframe: WireframeData) => {
    setWireframeData(generatedWireframe);
    
    if (onWireframeGenerated) {
      onWireframeGenerated(generatedWireframe);
    }
    
    setIsGenerating(false);
  };
  
  // Helper to render status message
  const renderStatus = () => {
    if (isGenerating) {
      return <p className="text-gray-500">Generating wireframe...</p>;
    }
    
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    
    if (wireframeData) {
      return <p className="text-green-500">Wireframe generated successfully!</p>;
    }
    
    return null;
  };

  return (
    <div className="intake-wireframe-bridge p-4">
      <h3 className="text-lg font-medium mb-4">Generate Wireframe from Intake Data</h3>
      
      <div className="mb-4">
        {renderStatus()}
      </div>
      
      {intakeData && (
        <div className="space-y-4">
          <AdvancedWireframeGenerator
            projectId={bridgeProjectId}
            initialPrompt={generatedPrompt}
            onWireframeGenerated={handleWireframeGenerated}
            enhancedCreativity={true}
            intakeData={intakeData}
            viewMode="preview"
          />
        </div>
      )}
    </div>
  );
};

export default IntakeWireframeBridge;
