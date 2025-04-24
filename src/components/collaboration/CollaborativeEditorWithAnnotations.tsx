
import React, { useState, useEffect } from 'react';
import CollaborativeEditor from './CollaborativeEditor';
import { AnnotationToolbar } from '@/components/annotations/AnnotationToolbar';
import { AnnotationCreator } from '@/components/annotations/AnnotationCreator';
import { AnnotationMarker } from '@/components/annotations/AnnotationMarker';
import { AnnotationPanel } from '@/components/annotations/AnnotationPanel';
import { Annotation, AnnotationType } from '@/types/annotations';
import { useUser } from '@/hooks/useUser';
import { AnnotationService } from '@/services/collaboration/annotationService';

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({
  documentId
}) => {
  const userId = useUser();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [creatingAnnotation, setCreatingAnnotation] = useState<{
    type: AnnotationType;
    position: { x: number; y: number; elementId?: string };
  } | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  // Fetch annotations when component mounts
  useEffect(() => {
    AnnotationService.getAnnotations(documentId)
      .then(fetchedAnnotations => {
        setAnnotations(fetchedAnnotations);
      })
      .catch(error => {
        console.error('Error fetching annotations:', error);
      });
      
    // Subscribe to annotation changes
    const unsubscribe = AnnotationService.subscribeToAnnotations(
      documentId,
      (updatedAnnotations) => {
        setAnnotations(updatedAnnotations);
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [documentId]);

  // Start creating a new annotation
  const handleCreateAnnotation = (type: AnnotationType) => {
    // When toolbar button is clicked, enable annotation creation mode
    const handleDocumentClick = (e: MouseEvent) => {
      // Get position relative to the document
      const x = e.clientX;
      const y = e.clientY;

      // Set the creating annotation state with position
      setCreatingAnnotation({
        type,
        position: { x, y },
      });

      // Remove event listener after creating annotation
      document.removeEventListener('click', handleDocumentClick);
    };

    // Add click listener to get position
    document.addEventListener('click', handleDocumentClick);
  };

  // Save a new annotation
  const handleSaveAnnotation = (content: string) => {
    if (!creatingAnnotation) return;

    AnnotationService.createAnnotation(
      documentId,
      userId,
      creatingAnnotation.type,
      content,
      creatingAnnotation.position
    )
      .then(newAnnotation => {
        setAnnotations([...annotations, newAnnotation]);
        setCreatingAnnotation(null);
      })
      .catch(error => {
        console.error('Error creating annotation:', error);
        setCreatingAnnotation(null);
      });
  };

  // Update an existing annotation
  const handleUpdateAnnotation = (updatedAnnotation: Annotation) => {
    AnnotationService.updateAnnotation(updatedAnnotation.id, updatedAnnotation)
      .then(() => {
        setAnnotations(annotations.map(ann => 
          ann.id === updatedAnnotation.id ? updatedAnnotation : ann
        ));
        setSelectedAnnotation(updatedAnnotation);
      })
      .catch(error => {
        console.error('Error updating annotation:', error);
      });
  };

  // Delete an annotation
  const handleDeleteAnnotation = (annotationId: string) => {
    AnnotationService.deleteAnnotation(annotationId)
      .then(() => {
        setAnnotations(annotations.filter(ann => ann.id !== annotationId));
        setSelectedAnnotation(null);
      })
      .catch(error => {
        console.error('Error deleting annotation:', error);
      });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Collaborative Document</h2>
        <AnnotationToolbar 
          onCreateAnnotation={handleCreateAnnotation}
        />
      </div>
      
      <div className="relative">
        <CollaborativeEditor documentId={documentId} />
        
        {/* Annotation markers */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {annotations.map(annotation => (
            <AnnotationMarker
              key={annotation.id}
              annotation={annotation}
              isActive={selectedAnnotation?.id === annotation.id}
              onClick={() => setSelectedAnnotation(
                selectedAnnotation?.id === annotation.id ? null : annotation
              )}
            />
          ))}
        </div>
        
        {/* Annotation creation UI */}
        {creatingAnnotation && (
          <AnnotationCreator
            type={creatingAnnotation.type}
            position={creatingAnnotation.position}
            onSave={handleSaveAnnotation}
            onCancel={() => setCreatingAnnotation(null)}
          />
        )}
      </div>
      
      {/* Annotation panel for viewing/editing */}
      {selectedAnnotation && (
        <AnnotationPanel
          annotation={selectedAnnotation}
          onUpdate={handleUpdateAnnotation}
          onDelete={handleDeleteAnnotation}
          onClose={() => setSelectedAnnotation(null)}
        />
      )}
    </div>
  );
};

export default CollaborativeEditorWithAnnotations;
