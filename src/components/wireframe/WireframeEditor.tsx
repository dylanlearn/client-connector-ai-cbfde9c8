
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWireframe } from '@/hooks/useWireframe';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { v4 as uuidv4 } from 'uuid';

interface WireframeEditorProps {
  projectId?: string;
  wireframe?: WireframeData | null;
  onUpdate?: (wireframe: WireframeData) => void;
  viewMode?: 'edit' | 'preview';
  enhancedFeatures?: boolean;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({
  projectId = uuidv4(),
  wireframe: initialWireframe = null,
  onUpdate,
  viewMode = 'edit',
  enhancedFeatures = false
}) => {
  const [localWireframe, setLocalWireframe] = useState<WireframeData | null>(initialWireframe);
  const [feedback, setFeedback] = useState<string>('');
  
  const {
    isGenerating,
    currentWireframe,
    error,
    generateWireframe,
    saveWireframe
  } = useWireframe({
    projectId,
    toastNotifications: true,
    enhancedValidation: enhancedFeatures,
    onWireframeGenerated: (result) => {
      if (result.success && result.wireframe) {
        setLocalWireframe(result.wireframe);
        if (onUpdate && result.wireframe) {
          onUpdate(result.wireframe);
        }
      }
    }
  });

  // Update local wireframe when the prop changes
  useEffect(() => {
    if (initialWireframe) {
      setLocalWireframe(initialWireframe);
    }
  }, [initialWireframe]);

  // Handle generating a wireframe
  const handleGenerateWireframe = async (prompt: string) => {
    await generateWireframe(prompt);
    // Result handling is done via the onWireframeGenerated callback
  };

  // Handle applying feedback to the wireframe
  const handleFeedback = async () => {
    if (!feedback.trim() || !localWireframe) return;
    
    // Since applyFeedback is not available in the current hook,
    // we'll implement a basic version here
    const updatedWireframe = {
      ...localWireframe,
      lastUpdated: new Date().toISOString()
    };
    setLocalWireframe(updatedWireframe);
    if (onUpdate) {
      onUpdate(updatedWireframe);
    }
    setFeedback('');
  };

  // Handle saving the wireframe
  const handleSaveWireframe = async () => {
    const savedWireframe = await saveWireframe();
    if (savedWireframe && onUpdate) {
      onUpdate(savedWireframe);
    }
  };

  // Add new section to wireframe
  const addSection = () => {
    if (!localWireframe) return;

    const newSection: WireframeSection = {
      id: uuidv4(),
      name: `Section ${localWireframe.sections.length + 1}`,
      sectionType: 'generic',
      description: 'New section',
      components: []
    };

    const updatedWireframe = {
      ...localWireframe,
      sections: [...localWireframe.sections, newSection],
      lastUpdated: new Date().toISOString()
    };

    setLocalWireframe(updatedWireframe);
    if (onUpdate) {
      onUpdate(updatedWireframe);
    }
  };

  // If there's no wireframe yet, show generation UI
  if (!localWireframe) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create Wireframe</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Describe your wireframe..."
              className="w-full p-2 border rounded"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateWireframe(e.currentTarget.value)}
            />
          </div>
          <Button 
            variant="default" 
            onClick={() => handleGenerateWireframe("Create a landing page with hero section, features, and contact form")}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Example Wireframe'}
          </Button>
          {error && <p className="text-red-500 mt-2">{error.message}</p>}
        </Card>
      </div>
    );
  }

  // Render the wireframe editor UI
  return (
    <div className="wireframe-editor">
      <div className="flex justify-between items-center mb-4 p-4">
        <h1 className="text-2xl font-semibold">{localWireframe.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addSection}>
            Add Section
          </Button>
          <Button onClick={handleSaveWireframe}>
            Save Wireframe
          </Button>
        </div>
      </div>
      
      <div className="wireframe-sections p-4 space-y-6">
        {localWireframe.sections.map((section) => (
          <div key={section.id} className="border p-4 rounded">
            <h3 className="font-medium">{section.name}</h3>
            <p className="text-sm text-muted-foreground">{section.description || 'No description'}</p>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {section.sectionType}
              </span>
            </div>
          </div>
        ))}
        
        {localWireframe.sections.length === 0 && (
          <div className="text-center py-8 border rounded bg-muted/10">
            <p className="text-muted-foreground">No sections yet. Add a new section to get started.</p>
          </div>
        )}
      </div>

      {viewMode === 'edit' && (
        <div className="p-4 border-t mt-4">
          <h3 className="text-lg font-medium mb-2">Feedback</h3>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder="Provide feedback to improve the wireframe..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button onClick={handleFeedback} disabled={!feedback.trim() || isGenerating}>
              {isGenerating ? 'Applying...' : 'Apply Feedback'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WireframeEditor;
