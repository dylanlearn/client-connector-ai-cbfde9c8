
import React, { useState, useEffect } from 'react';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { AnnotationMarker } from '../annotations/AnnotationMarker';
import { AnnotationToolbar } from '../annotations/AnnotationToolbar';
import UserPresenceIndicator from './UserPresenceIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { nanoid } from 'nanoid';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types/collaboration';

interface CollaborativeEditorWithAnnotationsProps {
  documentId: string;
}

type Priority = 'low' | 'medium' | 'high';

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  userId: string;
  timestamp: string;
  priority: Priority;
}

const CollaborativeEditorWithAnnotations: React.FC<CollaborativeEditorWithAnnotationsProps> = ({ documentId }) => {
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [newAnnotationText, setNewAnnotationText] = useState('');
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState(`Collaborative document content for ${documentId}`);
  const { state, applyChanges, updatePresence } = useCollaboration();

  const userId = 'current-user-id'; // In a real app, this would come from auth context

  const { users, activeUsers, isConnected } = useRealTimeCollaboration({
    documentId,
    userId,
    onUserUpdate: (user) => {
      console.log('User updated:', user);
    },
    onAnnotationAdded: (annotation) => {
      // Add the new annotation to our local state
      setAnnotations(prev => [...prev, annotation]);
    }
  });

  // Handle clicking on the document to add annotation
  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingAnnotation) return;
    
    // Get position relative to the document container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setAnnotationPosition({ x, y });
    
    // Show annotation creation form
    setNewAnnotationText('');
    
    // In a real app, you would open a form/modal here to enter annotation content
    // For this demo, we'll use a prompt
    const text = prompt('Enter annotation text:');
    if (text) {
      createAnnotation(x, y, text);
    } else {
      setIsAddingAnnotation(false);
    }
  };
  
  // Create a new annotation
  const createAnnotation = (x: number, y: number, text: string) => {
    const newAnnotation: Annotation = {
      id: nanoid(),
      x,
      y,
      text,
      userId,
      timestamp: new Date().toISOString(),
      priority: selectedPriority
    };
    
    // Add annotation locally
    setAnnotations(prev => [...prev, newAnnotation]);
    
    // Reset state
    setIsAddingAnnotation(false);
    
    // In a real app, we would sync this to the backend
    applyChanges([{
      userId,
      documentId,
      operation: 'insert',
      path: '/annotations',
      value: newAnnotation
    }]);
  };
  
  // Toggle annotation mode
  const toggleAnnotationMode = () => {
    setIsAddingAnnotation(!isAddingAnnotation);
  };
  
  // Change priority for new annotations
  const handlePriorityChange = (priority: Priority) => {
    setSelectedPriority(priority);
  };
  
  // Update cursor position when moving
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isConnected) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updatePresence({
      cursorPosition: { x, y }
    });
  };

  // Update document content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // In a real app, this would be debounced and synced to other users
    applyChanges([{
      userId,
      documentId,
      operation: 'update',
      path: '/content',
      value: e.target.value
    }]);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Document: {documentId}</h2>
        <AnnotationToolbar 
          onAddAnnotation={toggleAnnotationMode}
          isAddingAnnotation={isAddingAnnotation}
          onPriorityChange={handlePriorityChange}
          selectedPriority={selectedPriority}
        />
      </div>
      
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Collaborative Editor</CardTitle>
            <div className="flex gap-2">
              {Object.values(users).map((user) => (
                <UserPresenceIndicator key={user.id} user={user} />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div 
            className="relative border rounded-md p-4 min-h-[400px]"
            onClick={handleDocumentClick}
            onMouseMove={handleMouseMove}
            style={{ cursor: isAddingAnnotation ? 'crosshair' : 'default' }}
          >
            <Textarea
              className="w-full min-h-[350px] focus:outline-none bg-transparent resize-none"
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing..."
              disabled={isAddingAnnotation}
            />
            
            {/* Render annotations */}
            {annotations.map((annotation) => (
              <AnnotationMarker 
                key={annotation.id}
                x={annotation.x}
                y={annotation.y}
                text={annotation.text}
                userId={annotation.userId}
                timestamp={annotation.timestamp}
                priority={annotation.priority}
              />
            ))}
            
            {/* Render user cursors */}
            {Object.values(users).map((user) => {
              if (user.id === userId || !user.presence?.cursor) return null;
              
              return (
                <div
                  key={user.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${user.presence.cursor.x}px`,
                    top: `${user.presence.cursor.y}px`,
                    transition: 'transform 0.1s ease'
                  }}
                >
                  <div 
                    className="w-4 h-4 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ backgroundColor: user.color || '#6366f1' }}
                  />
                  <div 
                    className="absolute top-5 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                  >
                    {user.name || `User ${user.id.substring(0, 4)}`}
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
    </div>
  );
};

export default CollaborativeEditorWithAnnotations;
