import React, { useState, useEffect } from 'react';
import { useCollaboration, CollaborationProvider } from '@/contexts/CollaborationContext';
import UserPresenceIndicator from './UserPresenceIndicator';
import AnnotationToolbar from '../annotations/AnnotationToolbar';
import AnnotationMarker from '../annotations/AnnotationMarker';
import { useUser } from '@/hooks/useUser';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import { Annotation } from '@/types/annotations';
import { AnnotationService } from '@/services/collaboration/annotationService';
import { User } from '@/types/collaboration';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { Card } from '@/components/ui/card';

interface CollaborativeEditorContentProps {
  documentId: string;
}

const CollaborativeEditorContent: React.FC<CollaborativeEditorContentProps> = ({ documentId }) => {
  const { state, addChange } = useCollaboration();
  const userId = useUser();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotationType, setSelectedAnnotationType] = useState<string | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
  const [newAnnotationContent, setNewAnnotationContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real-time collaboration setup
  const { isConnected, activeUsers, error: collaborationError } = useRealTimeCollaboration(documentId);
  
  // Load annotations on mount
  useEffect(() => {
    const loadAnnotations = async () => {
      setIsLoading(true);
      try {
        const loadedAnnotations = await AnnotationService.getAnnotations(documentId);
        setAnnotations(loadedAnnotations);
      } catch (err: any) {
        setError(err.message || 'Failed to load annotations');
        toast.error(`Error loading annotations: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnnotations();
  }, [documentId]);
  
  // Subscribe to annotation changes
  useEffect(() => {
    const unsubscribe = AnnotationService.subscribeToAnnotations(documentId, (updatedAnnotations) => {
      setAnnotations(updatedAnnotations);
    });
    
    return () => {
      unsubscribe();
    };
  }, [documentId]);
  
  // Generic function to handle annotation creation
  const handleCreateAnnotation = async (x: number, y: number) => {
    if (!selectedAnnotationType) {
      toast.error('Please select an annotation type.');
      return;
    }
    
    try {
      const newAnnotation = await AnnotationService.createAnnotation(
        documentId,
        userId,
        selectedAnnotationType as any,
        newAnnotationContent,
        { x, y }
      );
      
      setAnnotations(prevAnnotations => [...prevAnnotations, newAnnotation]);
      toast.success(`Annotation created: ${selectedAnnotationType}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create annotation');
      toast.error(`Error creating annotation: ${err.message}`);
    } finally {
      setIsToolbarVisible(false);
      setNewAnnotationContent('');
      setSelectedAnnotationType(null);
    }
  };
  
  // Handle annotation updates
  const handleUpdateAnnotation = async (annotationId: string, updates: Partial<Annotation>) => {
    try {
      await AnnotationService.updateAnnotation(annotationId, updates);
      setAnnotations(prevAnnotations =>
        prevAnnotations.map(ann => (ann.id === annotationId ? { ...ann, ...updates } : ann))
      );
      toast.success('Annotation updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update annotation');
      toast.error(`Error updating annotation: ${err.message}`);
    }
  };
  
  // Handle annotation deletion
  const handleDeleteAnnotation = async (annotationId: string) => {
    try {
      await AnnotationService.deleteAnnotation(annotationId);
      setAnnotations(prevAnnotations => prevAnnotations.filter(ann => ann.id !== annotationId));
      toast.success('Annotation deleted successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to delete annotation');
      toast.error(`Error deleting annotation: ${err.message}`);
    }
  };
  
  // Handle canvas click to create annotation
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const x = event.clientX;
    const y = event.clientY;
    
    setIsToolbarVisible(true);
    setToolbarPosition({ x, y });
  };
  
  // Handle annotation type selection
  const handleAnnotationTypeSelect = (type: string) => {
    setSelectedAnnotationType(type);
    handleCreateAnnotation(toolbarPosition.x, toolbarPosition.y);
  };
  
  // Handle input change for new annotation content
  const handleAnnotationContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAnnotationContent(event.target.value);
  };
  
  // Handle annotation status change
  const handleAnnotationStatusChange = (annotationId: string, status: string) => {
    handleUpdateAnnotation(annotationId, { status: status as any });
  };
  
  // Handle annotation replies
  const handleAddAnnotationReply = async (parentId: string, content: string) => {
    try {
      const newAnnotation = await AnnotationService.createAnnotation(
        documentId,
        userId,
        'text', // Assuming replies are always text-based
        content,
        { x: 0, y: 0 }, // Position doesn't matter for replies
        parentId
      );
      
      setAnnotations(prevAnnotations => [...prevAnnotations, newAnnotation]);
      toast.success('Reply added successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to add reply');
      toast.error(`Error adding reply: ${err.message}`);
    }
  };
  
  // Handle annotation assignment
  const handleAssignAnnotation = (annotationId: string, assignedTo: string) => {
    handleUpdateAnnotation(annotationId, { metadata: { assignedTo } });
  };
  
  // Handle annotation priority
  const handleSetAnnotationPriority = (annotationId: string, priority: string) => {
    handleUpdateAnnotation(annotationId, { metadata: { priority } });
  };
  
  // Handle annotation label color
  const handleSetAnnotationLabelColor = (annotationId: string, labelColor: string) => {
    handleUpdateAnnotation(annotationId, { metadata: { labelColor } });
  };
  
  // Handle annotation linking to element
  const handleLinkAnnotationToElement = (annotationId: string, elementId: string) => {
    handleUpdateAnnotation(annotationId, { position: { elementId } });
  };
  
  if (isLoading) {
    return <div>Loading annotations...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="collaborative-editor relative" onClick={handleCanvasClick}>
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Document Editor</h2>
        <p className="text-gray-600">Document ID: {documentId}</p>
        
        <div className="flex items-center space-x-4 mb-4">
          {activeUsers.map((user: User) => (
            <UserPresenceIndicator key={user.id} user={user} />
          ))}
        </div>
        
        <div className="relative">
          {/* Mock Document Content - Replace with actual editor */}
          <div className="prose max-w-none">
            <p>
              This is a collaborative document. Click anywhere to add annotations.
            </p>
            <p>
              Annotations can be used to highlight text, add comments, or provide feedback.
            </p>
            <p>
              Use the toolbar to select the type of annotation you want to add.
            </p>
          </div>
          
          {/* Render Annotations */}
          {annotations.map(annotation => (
            <AnnotationMarker
              key={annotation.id}
              annotation={annotation}
              onUpdate={handleUpdateAnnotation}
              onDelete={handleDeleteAnnotation}
            />
          ))}
          
          {/* Annotation Toolbar */}
          {isToolbarVisible && (
            <AnnotationToolbar
              x={toolbarPosition.x}
              y={toolbarPosition.y}
              onSelect={handleAnnotationTypeSelect}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({ 
  documentId 
}) => {
  const userId = useUser();

  return (
    <CollaborationProvider documentId={documentId} userId={userId}>
      <CollaborativeEditorContent documentId={documentId} />
    </CollaborationProvider>
  );
};

export default CollaborativeEditorWithAnnotations;
