
import React, { useState, useEffect } from 'react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useRealTimeCollaboration } from '@/hooks/useRealTimeCollaboration';
import UserPresenceIndicator from './UserPresenceIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CollaborativeEditorProps {
  documentId: string;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ documentId }) => {
  const { state, applyChanges, updatePresence } = useCollaboration();
  const { activeUsers, isConnected, users } = useRealTimeCollaboration({
    documentId,
    userId: 'current-user-id', // Using a default ID here
  });
  const [content, setContent] = useState('');

  // Update the document content based on changes
  useEffect(() => {
    // This would apply changes to the content
    // In a real implementation, this would be much more complex
    setContent(`Document content for ${documentId}`);
  }, [state.changes, documentId]);

  // Update cursor position when content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    // Update presence with cursor information
    updatePresence({
      cursorPosition: { x: 0, y: 0 } // Simplified - would be actual cursor position
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Collaborative Editor</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="relative border rounded-md p-4 min-h-[300px]">
          <textarea 
            className="w-full min-h-[250px] focus:outline-none bg-transparent"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start typing..."
          />

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

export default CollaborativeEditor;
