
import React, { useState } from 'react';
import { ErrorResponse } from '@/types/error-types';
import { AlertMessage } from '@/components/ui/alert-message';
import { Card, CardContent } from '@/components/ui/card';
import { useWireframe } from '@/hooks/useWireframe';
import { useWireframeState } from '@/hooks/use-wireframe-state';
import WireframePreviewSystem from './preview/WireframePreviewSystem';
import WireframeControls from './editor/WireframeControls';
import HistoryControls from './canvas/HistoryControls';
import { useWireframeHistory } from '@/hooks/wireframe/use-wireframe-history';

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
  const { error, setError, updateWireframe, isGenerating, setGenerating } = useWireframeState();
  const [generatedWireframe, setGeneratedWireframe] = useState(initialWireframeData);
  
  const { generateWireframe } = useWireframe({
    projectId,
    showToasts: true,
    enhancedValidation: true
  });
  
  const {
    currentData,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useWireframeHistory(initialWireframeData);

  const handleError = (errorResponse: ErrorResponse) => {
    const error = new Error(errorResponse.message || "Unknown error occurred");
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
      setGenerating(true);
      
      const result = await generateWireframe({
        ...params,
        projectId,
        enhancedCreativity,
        intakeData
      });

      if (result.success && result.wireframe) {
        updateWireframe(result.wireframe);
        setGeneratedWireframe(result.wireframe);
        if (onWireframeGenerated) {
          onWireframeGenerated(result);
        }
      } else {
        throw new Error(result.message || 'Failed to generate wireframe');
      }
    } catch (err) {
      handleError(err as ErrorResponse);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <AlertMessage 
          type="error" 
          title="Error"
          className="mb-4"
        >
          {error instanceof Error ? error.message : String(error)}
        </AlertMessage>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-end mb-4">
            <HistoryControls
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
            />
          </div>
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
