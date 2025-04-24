
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollaboration } from '@/contexts/CollaborationContext';
import UserPresenceOverlay from './UserPresenceOverlay';
import { useUser } from '@/hooks/useUser';
import { nanoid } from 'nanoid';
import { AnnotationProvider } from '@/contexts/AnnotationContext';
import { useAnnotations } from '@/contexts/AnnotationContext';
import { AnnotationMarker } from '@/components/annotations/AnnotationMarker';
import { AnnotationPanel } from '@/components/annotations/AnnotationPanel';
import { AnnotationToolbar } from '@/components/annotations/AnnotationToolbar';
import { AnnotationCreator } from '@/components/annotations/AnnotationCreator';
import { AnnotationType } from '@/types/annotations';

interface CollaborativeEditorProps {
  documentId: string;
}

// Inner component that has access to the annotation context
const EditorWithAnnotations = ({ documentId }: { documentId: string }) => {
  const { state, addChange, applyChanges, updateUserPresence } = useCollaboration();
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const userId = useUser();
  
  const { 
    state: annotationState, 
    addAnnotation,
    updateAnnotation,
    setActiveAnnotation,
    setCreatingAnnotation
  } = useAnnotations();
  
  const [creatingAnnotationType, setCreatingAnnotationType] = useState<AnnotationType | null>(null);
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });
  
  // Setup document and user presence when component mounts
  useEffect(() => {
    // Initial document content could be loaded from a backend
    // For this demo, we'll use a simple default text
    const initialContent = `# Collaborative Document

Start editing this document to see real-time collaboration in action.
Multiple users can edit simultaneously, and changes are synchronized in real-time.

## Features
- Real-time synchronization
- Conflict resolution with operational transforms
- User presence awareness
- Cursor tracking
- Comprehensive annotation system
`;
    setContent(initialContent);
    
    // Update user presence with focus on editor
    if (editorRef.current) {
      updateUserPresence({
        status: 'active',
        focusElement: 'editor',
        cursorPosition: {
          x: 0,
          y: 0,
          elementId: 'collaborative-editor',
        },
        lastActive: new Date().toISOString(),
      });
    }
    
    // Add listeners for user activity and presence
    const handleActivityDetection = () => {
      updateUserPresence({
        status: 'active',
        lastActive: new Date().toISOString(),
      });
    };
    
    window.addEventListener('mousemove', handleActivityDetection);
    window.addEventListener('keydown', handleActivityDetection);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('mousemove', handleActivityDetection);
      window.removeEventListener('keydown', handleActivityDetection);
    };
  }, [documentId, updateUserPresence]);
  
  // Apply incoming changes from other users
  useEffect(() => {
    // Here we would process and merge remote changes
    // using operational transforms to resolve conflicts
    
    // For this demo, we'll simulate applying remote changes
    // Fix: Pass the changes directly without type conversion
    applyChanges(state.changes);
    
  }, [state.changes, applyChanges]);
  
  // Handle editor content changes
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    // Simple change detection - in a real app would use a diff algorithm
    if (newContent.length > content.length) {
      // Addition
      const addedText = newContent.substring(content.length);
      
      addChange({
        id: nanoid(),
        userId: userId,
        documentId: documentId,
        operation: 'insert',
        path: `content.${content.length}`,
        value: addedText,
        timestamp: new Date().toISOString(),
      });
    } else if (newContent.length < content.length) {
      // Deletion
      const deletedText = content.substring(newContent.length);
      
      addChange({
        id: nanoid(),
        userId: userId,
        documentId: documentId,
        operation: 'delete',
        path: `content.${newContent.length}`,
        value: deletedText,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Update (replacement)
      // In a real app we would compute an actual diff rather than full replacement
      
      addChange({
        id: nanoid(),
        userId: userId,
        documentId: documentId,
        operation: 'update',
        path: 'content',
        value: {
          oldText: content,
          newText: newContent
        },
        timestamp: new Date().toISOString(),
      });
    }
    
    setContent(newContent);
  };
  
  // Track cursor position in the textarea
  const handleCursorPosition = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!editorRef.current) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateUserPresence({
      cursorPosition: {
        x,
        y,
        elementId: 'collaborative-editor',
      },
    });
  };
  
  // Handle editor click for annotation creation
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (creatingAnnotationType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setAnnotationPosition({ x, y });
    }
  };
  
  const handleCreateAnnotation = (type: AnnotationType) => {
    setCreatingAnnotationType(type);
    setCreatingAnnotation(true);
    setActiveAnnotation(null);
  };
  
  const handleSaveAnnotation = (content: string) => {
    addAnnotation({
      documentId,
      userId,
      type: creatingAnnotationType as AnnotationType,
      content,
      position: {
        ...annotationPosition,
        elementId: 'collaborative-editor',
      },
      status: 'open',
    });
    
    setCreatingAnnotationType(null);
    setCreatingAnnotation(false);
  };
  
  const handleCancelAnnotation = () => {
    setCreatingAnnotationType(null);
    setCreatingAnnotation(false);
  };
  
  const handleAnnotationClick = (annotationId: string) => {
    setActiveAnnotation(annotationId);
    setCreatingAnnotation(false);
  };
  
  const handleCloseAnnotationPanel = () => {
    setActiveAnnotation(null);
  };
  
  return (
    <Card className="relative w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Collaborative Document Editor</CardTitle>
        <AnnotationToolbar 
          onCreateAnnotation={handleCreateAnnotation} 
          disabled={!!creatingAnnotationType}
        />
      </CardHeader>
      <CardContent>
        <div 
          className="relative" 
          id="editor-container"
          onClick={handleEditorClick}
        >
          <textarea
            id="collaborative-editor"
            ref={editorRef}
            value={content}
            onChange={handleEditorChange}
            onMouseMove={handleCursorPosition}
            className="w-full h-96 p-4 font-mono text-sm resize-none border rounded-md"
            style={{ position: 'relative', zIndex: 1 }}
          />
          
          {/* User presence overlay shows cursors and avatars */}
          <UserPresenceOverlay containerId="editor-container" />
          
          {/* Annotation markers */}
          {Object.values(annotationState.annotations).map((annotation) => (
            <AnnotationMarker 
              key={annotation.id}
              annotation={annotation}
              isActive={annotation.id === annotationState.activeAnnotationId}
              onClick={() => handleAnnotationClick(annotation.id)}
            />
          ))}
          
          {/* Annotation creator */}
          {creatingAnnotationType && (
            <AnnotationCreator 
              type={creatingAnnotationType}
              position={annotationPosition}
              onSave={handleSaveAnnotation}
              onCancel={handleCancelAnnotation}
            />
          )}
        </div>
        
        {/* Annotation panel */}
        {annotationState.activeAnnotationId && (
          <div className="absolute top-4 right-4">
            <AnnotationPanel onClose={handleCloseAnnotationPanel} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Wrapper component that provides the annotation context
const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorProps> = ({ documentId }) => {
  return (
    <AnnotationProvider documentId={documentId}>
      <EditorWithAnnotations documentId={documentId} />
    </AnnotationProvider>
  );
};

export default CollaborativeEditorWithAnnotations;
