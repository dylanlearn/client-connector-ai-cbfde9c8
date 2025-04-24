
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useCollaboration } from '@/contexts/CollaborationContext';
import CollaborativeEditor from './CollaborativeEditor';
import { AnnotationMarker } from '@/components/annotations/AnnotationMarker';
import { AnnotationPanel } from '@/components/annotations/AnnotationPanel';
import { Annotation } from '@/types/annotations';
import { MessageSquare, Mic, Video, PenLine, Plus } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { nanoid } from 'nanoid';

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({ documentId }) => {
  const { state, addChange } = useCollaboration();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [annotationType, setAnnotationType] = useState<'text' | 'voice' | 'video' | 'sketch'>('text');
  const userId = useUser();

  // Load annotations from collaborative state
  useEffect(() => {
    // Filter changes for annotation operations
    const annotationChanges = state.changes.filter(change => 
      change.path === 'annotations' && 
      (change.operation === 'insert' || change.operation === 'update' || change.operation === 'delete')
    );
    
    // Build annotation list from changes
    // (In a real app, would need more sophisticated merging logic)
    if (annotationChanges.length > 0) {
      const newAnnotations: Annotation[] = [];
      
      annotationChanges.forEach(change => {
        if (change.operation === 'insert') {
          newAnnotations.push(change.value as Annotation);
        } else if (change.operation === 'delete') {
          // Remove annotation with matching ID
          const idToRemove = (change.value as { id: string }).id;
          const index = newAnnotations.findIndex(a => a.id === idToRemove);
          if (index !== -1) {
            newAnnotations.splice(index, 1);
          }
        } else if (change.operation === 'update') {
          // Update annotation with matching ID
          const updatedAnnotation = change.value as Annotation;
          const index = newAnnotations.findIndex(a => a.id === updatedAnnotation.id);
          if (index !== -1) {
            newAnnotations[index] = updatedAnnotation;
          } else {
            newAnnotations.push(updatedAnnotation);
          }
        }
      });
      
      setAnnotations(newAnnotations);
    }
  }, [state.changes]);
  
  // Handle document click to place annotation
  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingAnnotation) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create a new annotation
    const newAnnotation: Annotation = {
      id: nanoid(),
      documentId,
      userId,
      type: annotationType,
      content: '',
      position: { x, y },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'open',
      metadata: {
        replies: 0
      }
    };
    
    // Add annotation to collaborative state
    addChange({
      userId,
      documentId,
      operation: 'insert',
      path: 'annotations',
      value: newAnnotation
    });
    
    // Update local state
    setAnnotations(prevAnnotations => [...prevAnnotations, newAnnotation]);
    setSelectedAnnotation(newAnnotation);
    setIsAddingAnnotation(false);
  };
  
  // Handle annotation update
  const handleAnnotationUpdate = (updatedAnnotation: Annotation) => {
    // Add update to collaborative state
    addChange({
      userId,
      documentId,
      operation: 'update',
      path: 'annotations',
      value: updatedAnnotation
    });
    
    // Update local state
    setAnnotations(prevAnnotations => 
      prevAnnotations.map(a => a.id === updatedAnnotation.id ? updatedAnnotation : a)
    );
    setSelectedAnnotation(updatedAnnotation);
  };
  
  // Handle annotation delete
  const handleAnnotationDelete = (annotationId: string) => {
    // Add delete to collaborative state
    addChange({
      userId,
      documentId,
      operation: 'delete',
      path: 'annotations',
      value: { id: annotationId }
    });
    
    // Update local state
    setAnnotations(prevAnnotations => prevAnnotations.filter(a => a.id !== annotationId));
    setSelectedAnnotation(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <Tabs defaultValue="document" className="w-full">
          <TabsList>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="annotations">Annotations ({annotations.length})</TabsTrigger>
          </TabsList>
          
          <div className="absolute right-6 top-4 flex gap-2">
            <Button 
              size="sm" 
              variant={isAddingAnnotation && annotationType === 'text' ? 'default' : 'outline'}
              onClick={() => {
                setAnnotationType('text');
                setIsAddingAnnotation(prev => !prev);
              }}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Text
            </Button>
            
            <Button 
              size="sm" 
              variant={isAddingAnnotation && annotationType === 'voice' ? 'default' : 'outline'}
              onClick={() => {
                setAnnotationType('voice');
                setIsAddingAnnotation(prev => !prev);
              }}
            >
              <Mic className="h-4 w-4 mr-1" />
              Voice
            </Button>
            
            <Button 
              size="sm" 
              variant={isAddingAnnotation && annotationType === 'video' ? 'default' : 'outline'}
              onClick={() => {
                setAnnotationType('video');
                setIsAddingAnnotation(prev => !prev);
              }}
            >
              <Video className="h-4 w-4 mr-1" />
              Video
            </Button>
            
            <Button 
              size="sm" 
              variant={isAddingAnnotation && annotationType === 'sketch' ? 'default' : 'outline'}
              onClick={() => {
                setAnnotationType('sketch');
                setIsAddingAnnotation(prev => !prev);
              }}
            >
              <PenLine className="h-4 w-4 mr-1" />
              Sketch
            </Button>
          </div>
          
          <TabsContent value="document" className="mt-6">
            <div 
              className="relative" 
              onClick={handleDocumentClick}
            >
              <CollaborativeEditor documentId={documentId} />
              
              {/* Annotation markers */}
              {annotations.map(annotation => (
                <AnnotationMarker 
                  key={annotation.id}
                  annotation={annotation}
                  isActive={selectedAnnotation?.id === annotation.id}
                  onClick={() => setSelectedAnnotation(annotation)}
                />
              ))}
              
              {isAddingAnnotation && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-md p-4 shadow-lg z-50">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Click anywhere on the document to place a new {annotationType} annotation</span>
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingAnnotation(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected annotation panel */}
            {selectedAnnotation && (
              <AnnotationPanel
                annotation={selectedAnnotation}
                onUpdate={handleAnnotationUpdate}
                onDelete={handleAnnotationDelete}
                onClose={() => setSelectedAnnotation(null)}
              />
            )}
          </TabsContent>
          
          <TabsContent value="annotations" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">All Annotations ({annotations.length})</h3>
              
              {annotations.length === 0 ? (
                <p className="text-muted-foreground">No annotations yet. Add annotations to collaborate.</p>
              ) : (
                <div className="space-y-4">
                  {annotations.map(annotation => (
                    <Card key={annotation.id} className="p-4 cursor-pointer hover:bg-muted/50" onClick={() => setSelectedAnnotation(annotation)}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {annotation.type === 'text' && <MessageSquare className="h-4 w-4" />}
                          {annotation.type === 'voice' && <Mic className="h-4 w-4" />}
                          {annotation.type === 'video' && <Video className="h-4 w-4" />}
                          {annotation.type === 'sketch' && <PenLine className="h-4 w-4" />}
                          <span className="font-medium">{annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1)} Annotation</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(annotation.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-2 text-sm line-clamp-2">{annotation.content || 'No content yet'}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        {/* Content moved to Tabs */}
      </CardContent>
    </Card>
  );
};

export default CollaborativeEditorWithAnnotations;
