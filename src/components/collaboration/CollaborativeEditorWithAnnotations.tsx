
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import UserPresenceIndicator from './UserPresenceIndicator';
import { AnnotationToolbar } from '../annotations/AnnotationToolbar';
import { AnnotationMarker } from '../annotations/AnnotationMarker';
import { useUser } from '@/hooks/useUser';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import { Annotation, AnnotationType } from '@/types/annotations';
import { AnnotationCreator } from '../annotations/AnnotationCreator';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { nanoid } from 'nanoid';
import { toast } from '@/hooks/use-toast';
import WireframeOptimizedDemo from '../canvas/WireframeOptimizedDemo';

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({ documentId }) => {
  const userId = useUser();
  const [activeTab, setActiveTab] = useState('editor');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [creatingAnnotation, setCreatingAnnotation] = useState<{
    type: AnnotationType;
    position: { x: number; y: number; elementId?: string };
  } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Use our collaborative hooks
  const { activeUsers } = useRealTimeCollaboration(documentId);
  const { state } = useCollaboration();
  
  // Mock data for annotations
  useEffect(() => {
    // In a real app, these would come from the database
    const mockAnnotations: Annotation[] = [
      {
        id: '1',
        documentId,
        userId: 'user-456',
        type: 'text',
        content: 'I think we should make this section more prominent',
        position: { x: 150, y: 200 },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        metadata: {
          assignedTo: 'user-789',
          priority: 'high',
          replies: 2
        }
      },
      {
        id: '2',
        documentId,
        userId: 'user-123',
        type: 'sketch',
        content: 'This is a rough sketch of the layout',
        position: { x: 400, y: 300 },
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        status: 'in-review',
        metadata: {
          dimensions: { width: 300, height: 200 },
          fileType: 'image/png',
          thumbnailUrl: '/placeholder-sketch.png',
        }
      }
    ];
    
    setAnnotations(mockAnnotations);
  }, [documentId]);
  
  // Handle clicking on the document to place an annotation
  const handleDocumentClick = (e: React.MouseEvent) => {
    if (!creatingAnnotation) return;
    
    // Get the position relative to the editor
    const editorRect = editorRef.current?.getBoundingClientRect();
    if (!editorRect) return;
    
    const x = e.clientX - editorRect.left;
    const y = e.clientY - editorRect.top;
    
    setCreatingAnnotation({
      ...creatingAnnotation,
      position: {
        ...creatingAnnotation.position,
        x,
        y
      }
    });
  };
  
  // Start creating a new annotation
  const handleCreateAnnotation = (type: AnnotationType) => {
    setSelectedAnnotation(null);
    setCreatingAnnotation({
      type,
      position: { x: 0, y: 0 }  // Will be updated when the user clicks
    });
  };
  
  // Save the annotation content
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
        // For a text annotation, we don't need specific metadata
        // For other types, we would add relevant info here
        priority: 'medium' as 'low' | 'medium' | 'high'
      }
    };
    
    setAnnotations([...annotations, newAnnotation]);
    setCreatingAnnotation(null);
    toast({
      title: "Annotation created",
      description: "Your annotation has been added.",
      variant: "success"
    });
  };
  
  // Handle clicking on an element (for element-specific annotations)
  const handleElementClick = (elementId: string) => {
    if (!creatingAnnotation) return;
    
    // In a real implementation, we would get the element's position
    setCreatingAnnotation({
      ...creatingAnnotation,
      position: {
        x: 200, // Default placeholder position
        y: 200, // Default placeholder position
        elementId
      }
    });
  };
  
  const handleAnnotationClick = (id: string) => {
    setSelectedAnnotation(id === selectedAnnotation ? null : id);
    setCreatingAnnotation(null);
  };
  
  // Get annotation by ID
  const getAnnotation = (id: string) => {
    return annotations.find(a => a.id === id);
  };
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center mb-4 bg-muted p-2 rounded-md">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium">Active users:</h3>
          <div className="flex -space-x-2">
            {activeUsers.map((user) => (
              <UserPresenceIndicator key={user.id} user={user} />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <AnnotationToolbar 
            onCreateAnnotation={handleCreateAnnotation} 
            disabled={!!creatingAnnotation}
          />
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab(activeTab === 'editor' ? 'comments' : 'editor')}
          >
            {activeTab === 'editor' ? 'View Comments' : 'View Editor'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="self-start mb-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="comments">Comments ({annotations.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="flex-1">
          <div
            ref={editorRef}
            className="relative bg-background border rounded-md flex-1 overflow-hidden"
            onClick={handleDocumentClick}
          >
            {/* Editor content */}
            <WireframeOptimizedDemo />
            
            {/* Annotation markers */}
            {annotations.map((annotation) => (
              <AnnotationMarker
                key={annotation.id}
                annotation={annotation}
                isActive={selectedAnnotation === annotation.id}
                onClick={() => handleAnnotationClick(annotation.id)}
              />
            ))}
            
            {/* Annotation creation UI */}
            {creatingAnnotation && creatingAnnotation.position.x > 0 && (
              <AnnotationCreator
                type={creatingAnnotation.type}
                position={creatingAnnotation.position}
                onSave={handleSaveAnnotation}
                onCancel={() => setCreatingAnnotation(null)}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="comments" className="flex-1">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Document Comments</h3>
            
            {annotations.length === 0 ? (
              <p className="text-muted-foreground">No comments yet. Add comments by selecting an annotation tool and clicking on the document.</p>
            ) : (
              <div className="space-y-4">
                {annotations.map((annotation) => (
                  <Card key={annotation.id} className="p-3">
                    <div className="flex justify-between">
                      <span className="font-medium">User {annotation.userId.split('-')[1]}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(annotation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2">{annotation.content}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs capitalize px-2 py-1 bg-muted rounded-full">
                        {annotation.status}
                      </span>
                      {annotation.metadata?.replies && (
                        <span className="text-xs text-muted-foreground">
                          {annotation.metadata.replies} replies
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborativeEditorWithAnnotations;
