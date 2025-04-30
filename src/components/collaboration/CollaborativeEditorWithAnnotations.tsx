
import React, { useState, useCallback, useEffect } from 'react';
import { CollaborationProvider, useCollaboration } from '@/contexts/CollaborationContext';
import UserPresenceIndicator from './UserPresenceIndicator';
import { AnnotationToolbar } from '../annotations/AnnotationToolbar';
import { AnnotationMarker } from '../annotations/AnnotationMarker';
import { useUser } from '@/hooks/useUser';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import { nanoid } from 'nanoid';

type Priority = 'low' | 'medium' | 'high';

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  userId: string;
  timestamp: string;
  priority: Priority;
  elementId?: string;
}

interface Position {
  x: number;
  y: number;
  elementId?: string;
}

const CollaborativeEditor = ({ documentId }: { documentId: string }) => {
  const userId = useUser();
  const { state, addChange, updatePresence } = useCollaboration();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationPosition, setAnnotationPosition] = useState<Position | null>(null);
  const [annotationPriority, setAnnotationPriority] = useState<Priority>('medium');

  const { users, activeUsers } = useRealTimeCollaboration({
    documentId,
    userId,
    onUserUpdate: (userData) => {
      console.log('User updated:', userData);
    },
    onAnnotationAdded: (annotation) => {
      setAnnotations(prev => [...prev, annotation]);
    }
  });

  // Load existing annotations when component mounts
  useEffect(() => {
    // In a real application, this would fetch from a database
    const loadAnnotations = async () => {
      // Mock data
      const mockAnnotations: Annotation[] = [
        {
          id: 'annotation-1',
          x: 150,
          y: 100,
          text: 'This section needs to be clearer',
          userId: 'user-456',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          priority: 'high',
          elementId: 'section-1'
        },
        {
          id: 'annotation-2',
          x: 300,
          y: 200,
          text: 'Can we make this more visually appealing?',
          userId: 'user-123',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          priority: 'medium'
        }
      ];
      setAnnotations(mockAnnotations);
    };
    
    loadAnnotations();
  }, []);

  // Track mouse position for document
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isAddingAnnotation) return;

    const rect = e.currentTarget.getBoundingClientRect();
    updatePresence({
      cursor: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    });
  }, [isAddingAnnotation, updatePresence]);

  // Handle mouse leaving the document area
  const handleMouseLeave = useCallback(() => {
    updatePresence({
      cursor: null
    });
  }, [updatePresence]);

  // Start adding a new annotation
  const startAddingAnnotation = useCallback(() => {
    setIsAddingAnnotation(true);
    setAnnotationText('');
    setAnnotationPosition(null);
  }, []);

  // Place annotation at the clicked position
  const handleDocumentClick = useCallback((e: React.MouseEvent) => {
    if (!isAddingAnnotation) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setAnnotationPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, [isAddingAnnotation]);

  // Save the new annotation
  const saveAnnotation = useCallback(() => {
    if (!annotationPosition || !annotationText.trim()) return;
    
    const newAnnotation: Annotation = {
      id: nanoid(),
      x: annotationPosition.x,
      y: annotationPosition.y,
      text: annotationText.trim(),
      userId,
      timestamp: new Date().toISOString(),
      priority: annotationPriority,
      elementId: annotationPosition.elementId
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    
    // In a real app, you'd save this to a database
    addChange({
      type: 'add_annotation',
      payload: newAnnotation
    });
    
    // Reset state
    setIsAddingAnnotation(false);
    setAnnotationText('');
    setAnnotationPosition(null);
  }, [annotationPosition, annotationText, annotationPriority, userId, addChange]);

  // Cancel adding annotation
  const cancelAnnotation = useCallback(() => {
    setIsAddingAnnotation(false);
    setAnnotationText('');
    setAnnotationPosition(null);
  }, []);

  const toggleAnnotationToolbar = useCallback(() => {
    setIsAddingAnnotation(prev => !prev);
  }, []);

  return (
    <div className="collaborative-editor relative border rounded-md bg-white">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between border-b p-2 bg-gray-50">
        <h3 className="text-sm font-medium">Document Editor</h3>
        <AnnotationToolbar 
          onAddAnnotation={toggleAnnotationToolbar} 
          isAddingAnnotation={isAddingAnnotation}
          onPriorityChange={setAnnotationPriority}
          selectedPriority={annotationPriority}
        />
      </div>

      {/* Active users indicator */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b">
        <span className="text-xs text-gray-500">Active users:</span>
        <div className="flex -space-x-2">
          {activeUsers.map(id => (
            <div key={id} className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white">
              {users[id]?.name?.substring(0, 1) || '?'}
            </div>
          ))}
        </div>
      </div>

      {/* Document area */}
      <div 
        className="p-4 min-h-[300px]" 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleDocumentClick}
      >
        <div className="prose max-w-none">
          <h1>Project Requirements Document</h1>
          <p>This document outlines the requirements for the new product feature.</p>
          
          <h2 id="section-1">User Authentication</h2>
          <p>The system should support secure login with two-factor authentication.</p>
          
          <h2 id="section-2">Dashboard Interface</h2>
          <p>Users need a clean dashboard showing key metrics and recent activity.</p>
          
          <h2 id="section-3">Reporting Features</h2>
          <p>Generate detailed reports with export options to various formats.</p>
        </div>
        
        {/* Render annotations */}
        {annotations.map(annotation => (
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
        
        {/* User presence indicators */}
        {Object.entries(state.users).map(([uid, user]) => {
          if (!user.presence?.cursor || uid === userId) return null;
          
          return (
            <UserPresenceIndicator
              key={uid}
              x={user.presence.cursor.x}
              y={user.presence.cursor.y}
              name={user.name || 'Unknown'}
            />
          );
        })}
        
        {/* Annotation input form */}
        {isAddingAnnotation && annotationPosition && (
          <div 
            className="absolute bg-white border shadow-lg rounded-md p-3 w-64"
            style={{
              left: `${annotationPosition.x + 20}px`,
              top: `${annotationPosition.y}px`,
            }}
          >
            <textarea
              className="w-full border rounded p-2 mb-2 text-sm"
              placeholder="Add your annotation..."
              rows={3}
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button 
                className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                onClick={cancelAnnotation}
              >
                Cancel
              </button>
              <button 
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={saveAnnotation}
                disabled={!annotationText.trim()}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CollaborativeEditorWithAnnotations = ({ documentId }: { documentId: string }) => {
  const userId = useUser();
  
  return (
    <CollaborationProvider documentId={documentId} userId={userId}>
      <CollaborativeEditor documentId={documentId} />
    </CollaborationProvider>
  );
};

export default CollaborativeEditorWithAnnotations;
