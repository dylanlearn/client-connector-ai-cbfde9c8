
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useUser } from '@/hooks/useUser';
import { nanoid } from 'nanoid';
import { Annotation, AnnotationType } from '@/types/annotations';
import { DocumentChange } from '@/types/collaboration';
import CollaborativeEditor from './CollaborativeEditor';
import { AnnotationToolbar } from '../annotations/AnnotationToolbar';
import { AnnotationMarker } from '../annotations/AnnotationMarker';
import { AnnotationPanel } from '../annotations/AnnotationPanel';
import { AnnotationCreator } from '../annotations/AnnotationCreator';

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({ documentId }) => {
  const { state, addChange, applyChanges } = useCollaboration();
  const userId = useUser();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);
  const [creatingAnnotation, setCreatingAnnotation] = useState<{ type: AnnotationType; position: { x: number; y: number } } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract annotations from document changes
  useEffect(() => {
    // Filter changes to find annotation-related operations
    const annotationChanges = state.changes.filter(change => {
      // Check if the change is related to annotations
      return change.path.startsWith('annotations');
    });

    if (annotationChanges.length > 0) {
      // Process annotation changes
      const updatedAnnotations = [...annotations];

      annotationChanges.forEach(change => {
        if (change.operation === 'insert') {
          // Add new annotation
          updatedAnnotations.push(change.value as Annotation);
        } else if (change.operation === 'update') {
          // Update existing annotation
          const index = updatedAnnotations.findIndex(a => a.id === (change.value as Annotation).id);
          if (index !== -1) {
            updatedAnnotations[index] = change.value as Annotation;
          }
        } else if (change.operation === 'delete') {
          // Remove annotation
          const index = updatedAnnotations.findIndex(a => a.id === change.value);
          if (index !== -1) {
            updatedAnnotations.splice(index, 1);
          }
        }
      });

      setAnnotations(updatedAnnotations);
    }
  }, [state.changes]);

  const handleCreateAnnotation = (type: AnnotationType) => {
    setCreatingAnnotation({ type, position: { x: 0, y: 0 } });
  };

  const handleDocumentClick = (e: React.MouseEvent) => {
    if (creatingAnnotation && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setCreatingAnnotation({
        ...creatingAnnotation,
        position: { x, y }
      });
    }
  };

  const handleSaveAnnotation = (content: string) => {
    if (!creatingAnnotation) return;

    const newAnnotation: Annotation = {
      id: nanoid(),
      documentId,
      userId,
      type: creatingAnnotation.type,
      content,
      position: creatingAnnotation.position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'open',
      metadata: {
        replies: 0
      }
    };

    // Add the annotation to the collaboration system
    addChange({
      userId,
      documentId,
      operation: 'insert',
      path: `annotations.${newAnnotation.id}`,
      value: newAnnotation,
      id: nanoid(), // Add missing id property
      timestamp: new Date().toISOString() // Add missing timestamp property
    });

    setAnnotations([...annotations, newAnnotation]);
    setCreatingAnnotation(null);
  };

  const handleCancelAnnotation = () => {
    setCreatingAnnotation(null);
  };

  const handleAnnotationClick = (id: string) => {
    setActiveAnnotationId(id === activeAnnotationId ? null : id);
  };

  const handleUpdateAnnotation = (updatedAnnotation: Annotation) => {
    addChange({
      userId,
      documentId,
      operation: 'update',
      path: `annotations.${updatedAnnotation.id}`,
      value: updatedAnnotation,
      id: nanoid(), // Add missing id property
      timestamp: new Date().toISOString() // Add missing timestamp property
    });

    setAnnotations(annotations.map(a => a.id === updatedAnnotation.id ? updatedAnnotation : a));
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    addChange({
      userId,
      documentId,
      operation: 'delete',
      path: `annotations.${annotationId}`,
      value: annotationId,
      id: nanoid(), // Add missing id property
      timestamp: new Date().toISOString() // Add missing timestamp property
    });

    setAnnotations(annotations.filter(a => a.id !== annotationId));
    setActiveAnnotationId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AnnotationToolbar 
          onCreateAnnotation={handleCreateAnnotation} 
          disabled={Boolean(creatingAnnotation)}
        />
      </div>
      
      <div 
        ref={containerRef} 
        className="relative"
        onClick={creatingAnnotation ? handleDocumentClick : undefined}
      >
        <Card>
          <CardContent className="p-0">
            <CollaborativeEditor documentId={documentId} />
          </CardContent>
        </Card>
        
        {/* Annotation Markers */}
        {annotations.map(annotation => (
          <AnnotationMarker
            key={annotation.id}
            annotation={annotation}
            isActive={annotation.id === activeAnnotationId}
            onClick={() => handleAnnotationClick(annotation.id)}
          />
        ))}
        
        {/* Annotation Creator */}
        {creatingAnnotation && creatingAnnotation.position.x > 0 && (
          <AnnotationCreator
            type={creatingAnnotation.type}
            position={creatingAnnotation.position}
            onSave={handleSaveAnnotation}
            onCancel={handleCancelAnnotation}
          />
        )}
      </div>
      
      {/* Active Annotation Panel */}
      {activeAnnotationId && (
        <div>
          {(() => {
            const activeAnnotation = annotations.find(a => a.id === activeAnnotationId);
            return activeAnnotation ? (
              <AnnotationPanel
                annotation={activeAnnotation}
                onUpdate={handleUpdateAnnotation}
                onDelete={handleDeleteAnnotation}
                onClose={() => setActiveAnnotationId(null)}
              />
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
};

export default CollaborativeEditorWithAnnotations;
