
import React, { useState, useEffect } from 'react';
import { ErrorResponse } from '@/types/error-types';
import { WireframePreviewSystem } from './preview/WireframePreviewSystem';
import { WireframeControls } from './editor/WireframeControls';
import { AlertMessage } from '@/components/ui/alert-message';
import { Card, CardContent } from '@/components/ui/card';
import { useWireframe } from '@/hooks/useWireframe';

interface AdvancedWireframeGeneratorProps {
  projectId?: string;
  viewMode?: string;
  initialWireframeData?: any;
  onWireframeGenerated?: (result: any) => void;
  onError?: (error: any) => void;
  enhancedCreativity?: boolean;
  intakeData?: any;
}

export function AdvancedWireframeGenerator({
  projectId,
  viewMode = 'preview',
  initialWireframeData,
  onWireframeGenerated,
  onError,
  enhancedCreativity = true,
  intakeData
}: AdvancedWireframeGeneratorProps) {
  const [error, setError] = useState<Error | string | null>(null);
  const [generatedWireframe, setGeneratedWireframe] = useState(initialWireframeData);
  
  const { generateWireframe, isGenerating } = useWireframe({
    projectId,
    showToasts: true,
    enhancedValidation: true
  });

  const handleError = (errorResponse: ErrorResponse) => {
    const error = new Error(errorResponse.message || "Unknown error");
    if (errorResponse.context?.stack) {
      error.stack = String(errorResponse.context.stack);
    }
    setError(error);
    if (onError) {
      onError(error);
    }
  };

  const handleGenerateWireframe = async (params: any) => {
    try {
      setError(null);
      const result = await generateWireframe({
        ...params,
        projectId,
        enhancedCreativity
      });

      if (result.success && result.wireframe) {
        setGeneratedWireframe(result.wireframe);
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
      } else {
        throw new Error(result.message || 'Failed to generate wireframe');
      }
    } catch (err) {
      handleError(err as ErrorResponse);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <AlertMessage 
          type="error" 
          message={error instanceof Error ? error.message : String(error)}
          onClose={() => setError(null)}
        />
      )}

      <Card>
        <CardContent className="p-6">
          <WireframeControls
            projectId={projectId}
            onWireframeCreated={handleGenerateWireframe}
            generateWireframe={handleGenerateWireframe}
            isGenerating={isGenerating}
          />
        </CardContent>
      </Card>

      {generatedWireframe && (
        <Card>
          <CardContent className="p-0">
            <WireframePreviewSystem
              wireframe={generatedWireframe}
              viewMode={viewMode}
              onSectionClick={() => {}}
              projectId={projectId}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdvancedWireframeGenerator;
