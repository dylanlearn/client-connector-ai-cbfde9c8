
import React, { useEffect, useRef, useState } from 'react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import UserPresenceOverlay from './UserPresenceOverlay';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { trackPerformance } from '@/utils/monitoring/performance-monitoring';

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  documentId,
  initialContent = ''
}) => {
  const { 
    state, 
    initDocument, 
    leaveDocument,
    addChange,
    updateCursorPosition,
    updateUserPresence
  } = useCollaboration();
  
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerId = `editor-container-${documentId}`;
  
  // Connect to the document on mount
  useEffect(() => {
    const cleanup = trackPerformance('initDocument', () => initDocument(documentId));
    
    return () => {
      cleanup;
      leaveDocument();
    };
  }, [documentId, initDocument, leaveDocument]);
  
  // Track cursor movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editorRef.current) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    updateCursorPosition({ x, y });
  };
  
  // Track focus changes
  const handleFocus = () => {
    updateUserPresence({
      status: 'active',
      focusElement: 'editor'
    });
  };
  
  const handleBlur = () => {
    updateUserPresence({
      status: 'idle',
      focusElement: null
    });
  };
  
  // Handle text changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const oldContent = content;
    
    // Basic diff to determine what changed
    // In a real implementation, would use a proper diff algorithm
    if (newContent.length > oldContent.length) {
      // Text was added
      // Find where the insertion happened
      let i = 0;
      while (i < oldContent.length && oldContent[i] === newContent[i]) i++;
      
      // The inserted text
      const insertedText = newContent.slice(i, i + (newContent.length - oldContent.length));
      
      // Add a change
      addChange({
        operation: 'insert',
        path: `text:content:${i}`,
        value: insertedText
      });
    } else if (newContent.length < oldContent.length) {
      // Text was deleted
      // Find where the deletion happened
      let i = 0;
      while (i < newContent.length && oldContent[i] === newContent[i]) i++;
      
      // The deleted text
      const deletedText = oldContent.slice(i, i + (oldContent.length - newContent.length));
      
      // Add a change
      addChange({
        operation: 'delete',
        path: `text:content:${i}`,
        value: deletedText
      });
    } else {
      // Text was replaced
      // This is a simple approach - a real implementation would use a more sophisticated diff
      let i = 0;
      while (i < newContent.length && oldContent[i] === newContent[i]) i++;
      
      let j = 1;
      while (j <= newContent.length && 
             oldContent[oldContent.length - j] === newContent[newContent.length - j]) j++;
      
      j = j - 1;
      
      if (i < oldContent.length - j) {
        const oldText = oldContent.slice(i, oldContent.length - j);
        const newText = newContent.slice(i, newContent.length - j);
        
        addChange({
          operation: 'update',
          path: `text:content:${i}`,
          value: { oldText, newText }
        });
      }
    }
    
    setContent(newContent);
  };
  
  // Track selection changes
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    if (!editorRef.current) return;
    
    const target = e.target as HTMLTextAreaElement;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    
    if (selectionStart === selectionEnd) return;
    
    const rect = editorRef.current.getBoundingClientRect();
    
    updateCursorPosition({
      x: rect.left,
      y: rect.top,
      elementId: editorContainerId,
      selection: {
        start: selectionStart,
        end: selectionEnd
      }
    });
  };
  
  // Generate users status message
  const getUsersStatus = () => {
    const { activeUsers, users } = state;
    
    if (activeUsers.length === 0) {
      return 'No active users';
    } else if (activeUsers.length === 1 && activeUsers[0] === state.users[activeUsers[0]]?.id) {
      return 'Only you are editing';
    } else {
      const otherUsers = activeUsers.filter(id => users[id] && users[id].id !== users[activeUsers[0]]?.id);
      return `${otherUsers.length} other user${otherUsers.length !== 1 ? 's' : ''} editing`;
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Collaborative Document</h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">{getUsersStatus()}</span>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div 
        id={editorContainerId} 
        className="relative"
        onMouseMove={handleMouseMove}
      >
        <Textarea
          ref={editorRef}
          value={content}
          onChange={handleChange}
          onSelect={handleSelect}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="min-h-[300px] w-full p-3 font-mono"
          placeholder="Start typing here..."
        />
        
        {/* Overlay to show cursors and selections */}
        <UserPresenceOverlay containerId={editorContainerId} />
      </div>
      
      <div className="flex justify-end mt-4">
        <Button variant="outline" className="mr-2">
          Share
        </Button>
        <Button>Save</Button>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
