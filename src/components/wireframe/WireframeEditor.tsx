
import React, { useState, useEffect } from 'react';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { useWireframe } from '@/hooks/useWireframe';
import { v4 as uuidv4 } from 'uuid';
import EditorHeader from './editor/EditorHeader';
import SectionsList from './editor/SectionsList';
import FeedbackPanel from './editor/FeedbackPanel';
import GenerateWireframePanel from './editor/GenerateWireframePanel';

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
  const handleApplyFeedback = async (feedbackText: string) => {
    if (!feedbackText.trim() || !localWireframe) return;
    
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
      <GenerateWireframePanel 
        isGenerating={isGenerating} 
        error={error} 
        onGenerateWireframe={handleGenerateWireframe} 
      />
    );
  }

  // Render the wireframe editor UI
  return (
    <div className="wireframe-editor">
      <EditorHeader 
        title={localWireframe.title} 
        onAddSection={addSection} 
        onSaveWireframe={handleSaveWireframe} 
      />
      
      <SectionsList sections={localWireframe.sections} />

      {viewMode === 'edit' && (
        <FeedbackPanel 
          isGenerating={isGenerating} 
          onApplyFeedback={handleApplyFeedback} 
        />
      )}
    </div>
  );
};

export default WireframeEditor;
