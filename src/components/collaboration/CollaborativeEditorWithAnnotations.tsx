
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CollaborativeEditor from './CollaborativeEditor';
import { AnnotationToolbar } from '../annotations/AnnotationToolbar';
import { AnnotationMarker } from '../annotations/AnnotationMarker';
import { AnnotationPanel } from '../annotations/AnnotationPanel';
import { AnnotationCreator } from '../annotations/AnnotationCreator';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { Annotation, AnnotationType } from '@/types/annotations';
import { nanoid } from 'nanoid';
import { DocumentChange } from '@/types/collaboration';
import { useUser } from '@/hooks/useUser';

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({ documentId }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);
  const [creatingAnnotation, setCreatingAnnotation] = useState<{
    type: AnnotationType;
    position: { x: number; y: number };
  } | null>(null);
  
  const { state, addChange } = useCollaboration();
  const containerRef = useRef<HTMLDivElement>(null);
  const userId = useUser();
  
  // Sync annotations from collaboration state
  useEffect(() => {
    if (state.changes && state.changes.length > 0) {
      // Filter changes related to annotations
      const annotationChanges = state.changes.filter(
        (change) => typeof change !== 'string' && 
          change.path && 
          change.path.startsWith('annotations')
      );
      
      if (annotationChanges.length > 0) {
        // Process annotation changes
        const updatedAnnotations = [...annotations];
        
        annotationChanges.forEach(change => {
          if (typeof change === 'string') return; // Skip string changes
          
          if (change.operation === 'add') {
            if (change.value && typeof change.value !== 'string') {
              updatedAnnotations.push(change.value as Annotation);
            }
          } else if (change.operation === 'update') {
            const annotationId = change.path.split('.')[1];
            const annotationIndex = updatedAnnotations.findIndex(a => a.id === annotationId);
            
            if (annotationIndex !== -1 && change.value && typeof change.value !== 'string') {
              updatedAnnotations[annotationIndex] = {
                ...updatedAnnotations[annotationIndex],
                ...change.value
              };
            }
          } else if (change.operation === 'delete') {
            const annotationId = change.path.split('.')[1];
            const annotationIndex = updatedAnnotations.findIndex(a => a.id === annotationId);
            
            if (annotationIndex !== -1) {
              updatedAnnotations.splice(annotationIndex, 1);
            }
          }
        });
        
        setAnnotations(updatedAnnotations);
      }
    }
  }, [state.changes]);
  
  const handleCreateAnnotation = (type: AnnotationType) => {
    const handleCanvasClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setCreatingAnnotation({
        type,
        position: { x, y }
      });
      
      // Remove event listener after capturing position
      document.removeEventListener('click', handleCanvasClick);
    };
    
    // Add a one-time click listener to capture position
    document.addEventListener('click', handleCanvasClick);
  };
  
  const handleSaveAnnotation = (content: string) => {
    if (!creatingAnnotation || !userId) return;
    
    const newAnnotation: Annotation = {
      id: nanoid(),
      documentId: documentId,
      userId: userId,
      type: creatingAnnotation.type,
      content: content,
      position: creatingAnnotation.position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'open',
      metadata: {
        replies: 0
      }
    };
    
    // Add annotation to local state
    setAnnotations([...annotations, newAnnotation]);
    
    // Add annotation to shared state
    addChange({
      userId: userId,
      documentId: documentId,
      operation: 'add',
      path: `annotations.${newAnnotation.id}`,
      value: newAnnotation,
    } as DocumentChange);
    
    setCreatingAnnotation(null);
  };
  
  const handleUpdateAnnotation = (annotation: Annotation) => {
    // Update annotation in local state
    const updatedAnnotations = annotations.map(a => 
      a.id === annotation.id ? annotation : a
    );
    
    setAnnotations(updatedAnnotations);
    
    // Update annotation in shared state
    addChange({
      userId: userId || '',
      documentId: documentId,
      operation: 'update',
      path: `annotations.${annotation.id}`,
      value: annotation,
    } as DocumentChange);
  };
  
  const handleDeleteAnnotation = (annotationId: string) => {
    // Remove annotation from local state
    const updatedAnnotations = annotations.filter(a => a.id !== annotationId);
    setAnnotations(updatedAnnotations);
    
    // Remove annotation from shared state
    addChange({
      userId: userId || '',
      documentId: documentId,
      operation: 'delete',
      path: `annotations.${annotationId}`,
      value: null,
    } as DocumentChange);
    
    setActiveAnnotationId(null);
  };
  
  const handleAnnotationClick = (annotationId: string) => {
    setActiveAnnotationId(activeAnnotationId === annotationId ? null : annotationId);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Document Editor</h3>
            <AnnotationToolbar 
              onCreateAnnotation={handleCreateAnnotation}
              disabled={creatingAnnotation !== null}
            />
          </div>
          
          <div ref={containerRef} className="relative border rounded-md">
            <CollaborativeEditor documentId={documentId} />
            
            {/* Annotation Markers */}
            {annotations.map(annotation => (
              <AnnotationMarker 
                key={annotation.id}
                annotation={annotation}
                isActive={activeAnnotationId === annotation.id}
                onClick={() => handleAnnotationClick(annotation.id)}
              />
            ))}
            
            {/* Annotation Creator */}
            {creatingAnnotation && (
              <AnnotationCreator
                type={creatingAnnotation.type}
                position={creatingAnnotation.position}
                onSave={handleSaveAnnotation}
                onCancel={() => setCreatingAnnotation(null)}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Annotation Panel for active annotation */}
      {activeAnnotationId && (
        <div className="annotation-panel-container">
          {annotations
            .filter(a => a.id === activeAnnotationId)
            .map(annotation => (
              <AnnotationPanel
                key={annotation.id}
                annotation={annotation}
                onUpdate={handleUpdateAnnotation}
                onDelete={handleDeleteAnnotation}
                onClose={() => setActiveAnnotationId(null)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CollaborativeEditorWithAnnotations;
