
import React, { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Annotation } from '@/types/annotations';
import { DocumentChange } from '@/types/collaboration';
import UserPresenceIndicator from './UserPresenceIndicator';
import UserCursor from './UserCursor';

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({ documentId }) => {
  const { state, applyChanges, addChange } = useCollaboration();
  const { activeUsers, isConnected, users } = useRealTimeCollaboration({
    documentId,
    userId: 'current-user-id',
  });

  const [content, setContent] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [newAnnotationText, setNewAnnotationText] = useState('');
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });
  const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null);

  // Update the document content based on changes
  useEffect(() => {
    if (state.changes && state.changes.length > 0) {
      // This simplifies the real implementation which would be more complex
      // For each change, we would apply it to the content
      setContent(`Document content for ${documentId} with ${state.changes.length} changes applied`);
      
      // Extract annotations from changes
      const annotationChanges = state.changes.filter(
        change => change.operation === 'insert' && change.path.startsWith('/annotations/')
      );
      
      if (annotationChanges.length > 0) {
        // Process annotations from changes
        const extractedAnnotations = annotationChanges.map(change => change.value as unknown as Annotation);
        setAnnotations(prev => [...prev, ...extractedAnnotations]);
      }
    } else {
      setContent(`Document content for ${documentId}`);
    }
  }, [state.changes, documentId]);

  // Handle click on editor to add annotation
  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    if (isAddingAnnotation && editorRef) {
      const rect = editorRef.getBoundingClientRect();
      setAnnotationPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [isAddingAnnotation, editorRef]);

  // Handle saving new annotation
  const handleSaveAnnotation = () => {
    if (newAnnotationText.trim() === '') return;
    
    const newAnnotation: Annotation = {
      id: nanoid(),
      documentId,
      userId: 'current-user-id',
      type: 'text',
      content: newAnnotationText,
      position: {
        x: annotationPosition.x,
        y: annotationPosition.y
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'open',
      metadata: {
        priority: 'medium'
      }
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    
    // Add change to context
    const change: DocumentChange = {
      id: nanoid(),
      userId: 'current-user-id',
      documentId,
      operation: 'insert',
      path: `/annotations/${newAnnotation.id}`,
      value: newAnnotation,
      timestamp: new Date().toISOString()
    };
    
    addChange({
      userId: 'current-user-id',
      documentId,
      operation: 'insert',
      path: `/annotations/${newAnnotation.id}`,
      value: newAnnotation
    });
    
    setNewAnnotationText('');
    setIsAddingAnnotation(false);
  };

  // Handle resolving annotation
  const handleResolveAnnotation = (annotationId: string) => {
    // Update annotation status
    setAnnotations(prev =>
      prev.map(ann =>
        ann.id === annotationId
          ? { ...ann, status: 'resolved' as const, updatedAt: new Date().toISOString() }
          : ann
      )
    );
    
    // Add change to context
    const change: DocumentChange = {
      id: nanoid(),
      userId: 'current-user-id',
      documentId,
      operation: 'update',
      path: `/annotations/${annotationId}/status`,
      value: 'resolved',
      timestamp: new Date().toISOString()
    };
    
    addChange({
      userId: 'current-user-id',
      documentId,
      operation: 'update',
      path: `/annotations/${annotationId}/status`,
      value: 'resolved'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Collaborative Document</CardTitle>
          <div className="flex gap-2">
            {activeUsers.map(userId => {
              const user = users[userId];
              if (!user) return null;
              return (
                <UserPresenceIndicator 
                  key={userId} 
                  user={{
                    id: user.id,
                    name: user.name || `User ${user.id.substring(0, 4)}`,
                    color: user.color || '#666',
                    avatar: user.avatar || null,
                    presence: {
                      status: user.presence?.status || 'offline',
                      focusElement: null,
                      cursorPosition: user.presence?.cursorPosition || null,
                      lastActive: new Date().toISOString()
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            variant={isAddingAnnotation ? "secondary" : "outline"}
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
          >
            {isAddingAnnotation ? 'Cancel' : 'Add Annotation'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="relative border rounded-md p-4 min-h-[350px] bg-white"
          ref={setEditorRef}
          onClick={handleEditorClick}
        >
          {isAddingAnnotation && (
            <div 
              className="absolute bg-yellow-100 p-2 rounded shadow-md z-10"
              style={{ 
                left: `${annotationPosition.x}px`, 
                top: `${annotationPosition.y}px`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <textarea
                className="w-full p-2 border rounded mb-2"
                value={newAnnotationText}
                onChange={(e) => setNewAnnotationText(e.target.value)}
                placeholder="Enter annotation"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsAddingAnnotation(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveAnnotation}>
                  Save
                </Button>
              </div>
            </div>
          )}
          
          <textarea 
            className="w-full min-h-[300px] focus:outline-none bg-transparent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            disabled={isAddingAnnotation}
          />

          {/* Annotations */}
          {annotations.map(annotation => (
            <div
              key={annotation.id}
              className={`absolute bg-yellow-100 p-2 rounded shadow-sm z-5 border-l-4 ${
                annotation.status === 'resolved' ? 'border-green-500 bg-green-50' : 'border-yellow-500'
              }`}
              style={{
                left: `${annotation.position.x}px`,
                top: `${annotation.position.y}px`,
                maxWidth: '200px'
              }}
            >
              <p className="text-xs">{annotation.content}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {new Date(annotation.createdAt).toLocaleTimeString()}
                </span>
                {annotation.status !== 'resolved' && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 px-2 text-xs"
                    onClick={() => handleResolveAnnotation(annotation.id)}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* User Cursors */}
          {editorRef && activeUsers.map(userId => {
            const user = users[userId];
            if (userId === 'current-user-id' || !user || !user.presence?.cursorPosition) return null;
            
            return (
              <div 
                key={`cursor-${userId}`} 
                className="absolute pointer-events-none z-50"
                style={{
                  left: `${user.presence.cursorPosition.x}px`,
                  top: `${user.presence.cursorPosition.y}px`
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-white shadow-sm flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: user.color || '#666' }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div 
                  className="absolute top-5 left-0 px-2 py-1 text-xs rounded whitespace-nowrap"
                  style={{ backgroundColor: user.color || '#666', color: 'white' }}
                >
                  {user.name || `User ${userId.substring(0, 4)}`}
                </div>
              </div>
            );
          })}

          {/* Show connection status */}
          <div className="absolute bottom-2 right-2 text-xs">
            {isConnected ? 
              <span className="text-green-500">Connected</span> : 
              <span className="text-red-500">Disconnected</span>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborativeEditorWithAnnotations;
