
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useUser } from '@/hooks/useUser';
import { Annotation, AnnotationType } from '@/types/annotations';
import { DocumentChange } from '@/types/collaboration';
import CollaborativeEditor from './CollaborativeEditor';
import { AnnotationToolbar } from '../annotations/AnnotationToolbar';
import { AnnotationMarker } from '../annotations/AnnotationMarker';
import { AnnotationCreator } from '../annotations/AnnotationCreator';
import { AnnotationPanel } from '../annotations/AnnotationPanel';

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({ 
  documentId 
}) => {
  const { state, addChange, applyChanges } = useCollaboration();
  const userId = useUser();
  
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [annotationType, setAnnotationType] = useState<AnnotationType>('text');
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });
  
  // Apply incoming annotation changes
  useEffect(() => {
    // Filter changes related to annotations
    const annotationChanges = state.changes.filter(
      change => change.path?.startsWith('annotations')
    );
    
    if (annotationChanges.length > 0) {
      // Process changes
      annotationChanges.forEach(change => {
        switch (change.operation) {
          case 'insert':
            if (typeof change.value === 'object') {
              setAnnotations(prev => [...prev, change.value as Annotation]);
            }
            break;
          case 'update':
            if (typeof change.value === 'object') {
              setAnnotations(prev => 
                prev.map(ann => 
                  ann.id === change.path.split('.')[1] ? { ...ann, ...change.value } : ann
                )
              );
            }
            break;
          case 'delete':
            const annotationId = change.path.split('.')[1];
            setAnnotations(prev => prev.filter(ann => ann.id !== annotationId));
            break;
        }
      });
      
      // Mark changes as applied
      applyChanges(annotationChanges.map(change => change.id));
    }
  }, [state.changes, applyChanges]);
  
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingAnnotation) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setAnnotationPosition({ x, y });
  };
  
  const handleCreateAnnotation = (type: AnnotationType) => {
    setIsAddingAnnotation(true);
    setAnnotationType(type);
  };
  
  const handleSaveAnnotation = (content: string) => {
    const newAnnotation: Annotation = {
      id: nanoid(),
      documentId,
      userId,
      type: annotationType,
      content,
      position: annotationPosition,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'open',
      metadata: {}
    };
    
    // Add to local state
    setAnnotations(prev => [...prev, newAnnotation]);
    
    // Broadcast to collaborators
    addChange({
      userId,
      documentId,
      operation: 'insert',
      path: `annotations.${newAnnotation.id}`,
      value: newAnnotation,
    });
    
    setIsAddingAnnotation(false);
    setActiveAnnotation(newAnnotation.id);
  };
  
  const handleUpdateAnnotation = (annotation: Annotation) => {
    // Update local state
    setAnnotations(prev => 
      prev.map(ann => ann.id === annotation.id ? annotation : ann)
    );
    
    // Broadcast to collaborators
    addChange({
      userId,
      documentId,
      operation: 'update',
      path: `annotations.${annotation.id}`,
      value: annotation,
    });
  };
  
  const handleDeleteAnnotation = (annotationId: string) => {
    // Update local state
    setAnnotations(prev => prev.filter(ann => ann.id !== annotationId));
    
    // Broadcast to collaborators
    addChange({
      userId,
      documentId,
      operation: 'delete',
      path: `annotations.${annotationId}`,
      value: annotationId,
    });
    
    if (activeAnnotation === annotationId) {
      setActiveAnnotation(null);
    }
  };
  
  return (
    <div className="relative">
      <div className="mb-2 flex justify-end">
        <AnnotationToolbar 
          onCreateAnnotation={handleCreateAnnotation} 
          disabled={isAddingAnnotation}
        />
      </div>
      
      <div 
        className="relative border rounded-md" 
        onClick={handleEditorClick}
      >
        <CollaborativeEditor documentId={documentId} />
        
        {/* Annotation markers */}
        {annotations.map(annotation => (
          <AnnotationMarker 
            key={annotation.id}
            annotation={annotation}
            isActive={activeAnnotation === annotation.id}
            onClick={() => setActiveAnnotation(
              activeAnnotation === annotation.id ? null : annotation.id
            )}
          />
        ))}
        
        {/* Annotation creator */}
        {isAddingAnnotation && (
          <AnnotationCreator 
            type={annotationType}
            position={annotationPosition}
            onSave={handleSaveAnnotation}
            onCancel={() => setIsAddingAnnotation(false)}
          />
        )}
      </div>
      
      {/* Annotation panel */}
      {activeAnnotation && (
        <AnnotationPanel 
          annotation={annotations.find(ann => ann.id === activeAnnotation)!}
          onUpdate={handleUpdateAnnotation}
          onDelete={handleDeleteAnnotation}
          onClose={() => setActiveAnnotation(null)}
        />
      )}
    </div>
  );
};

export default CollaborativeEditorWithAnnotations;
