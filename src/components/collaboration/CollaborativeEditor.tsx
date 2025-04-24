
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollaboration } from '@/contexts/CollaborationContext';
import UserPresenceOverlay from './UserPresenceOverlay';
import { useUser } from '@/hooks/useUser';
import { nanoid } from 'nanoid';

interface CollaborativeEditorProps {
  documentId: string;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ documentId }) => {
  const { state, addChange, applyChanges, updateUserPresence } = useCollaboration();
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const userId = useUser();
  
  // Setup document and user presence when component mounts
  useEffect(() => {
    // Initial document content could be loaded from a backend
    // For this demo, we'll use a simple default text
    const initialContent = `# Collaborative Document

Start editing this document to see real-time collaboration in action.
Multiple users can edit simultaneously, and changes are synchronized in real-time.

## Features
- Real-time synchronization
- Conflict resolution with operational transforms
- User presence awareness
- Cursor tracking
`;
    setContent(initialContent);
    
    // Update user presence with focus on editor
    if (editorRef.current) {
      updateUserPresence({
        status: 'active',
        focusElement: 'editor',
        cursorPosition: {
          x: 0,
          y: 0,
          elementId: 'collaborative-editor',
        },
        lastActive: new Date().toISOString(),
      });
    }
    
    // Add listeners for user activity and presence
    const handleActivityDetection = () => {
      updateUserPresence({
        status: 'active',
        lastActive: new Date().toISOString(),
      });
    };
    
    window.addEventListener('mousemove', handleActivityDetection);
    window.addEventListener('keydown', handleActivityDetection);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('mousemove', handleActivityDetection);
      window.removeEventListener('keydown', handleActivityDetection);
    };
  }, [documentId, updateUserPresence]);
  
  // Apply incoming changes from other users
  useEffect(() => {
    // Here we would process and merge remote changes
    // using operational transforms to resolve conflicts
    
    // For this demo, we'll simulate applying remote changes
    applyChanges(state.changes);
    
  }, [state.changes, applyChanges]);
  
  // Handle editor content changes
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    // Simple change detection - in a real app would use a diff algorithm
    if (newContent.length > content.length) {
      // Addition
      const addedText = newContent.substring(content.length);
      
      addChange({
        userId: userId || nanoid(), // Use the current user's ID
        documentId: documentId,
        operation: 'insert',
        path: `content.${content.length}`,
        value: addedText,
      });
    } else if (newContent.length < content.length) {
      // Deletion
      const deletedText = content.substring(newContent.length);
      
      addChange({
        userId: userId || nanoid(),
        documentId: documentId,
        operation: 'delete',
        path: `content.${newContent.length}`,
        value: deletedText,
      });
    } else {
      // Update (replacement)
      // In a real app we would compute an actual diff rather than full replacement
      
      addChange({
        userId: userId || nanoid(),
        documentId: documentId,
        operation: 'update',
        path: 'content',
        value: {
          oldText: content,
          newText: newContent
        },
      });
    }
    
    setContent(newContent);
  };
  
  // Track cursor position in the textarea
  const handleCursorPosition = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!editorRef.current) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateUserPresence({
      cursorPosition: {
        x,
        y,
        elementId: 'collaborative-editor',
      },
    });
  };
  
  return (
    <Card className="relative w-full">
      <CardHeader>
        <CardTitle>Collaborative Document Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" id="editor-container">
          <textarea
            id="collaborative-editor"
            ref={editorRef}
            value={content}
            onChange={handleEditorChange}
            onMouseMove={handleCursorPosition}
            className="w-full h-96 p-4 font-mono text-sm resize-none border rounded-md"
            style={{ position: 'relative', zIndex: 1 }}
          />
          
          {/* User presence overlay shows cursors and avatars */}
          <UserPresenceOverlay containerId="editor-container" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborativeEditor;
