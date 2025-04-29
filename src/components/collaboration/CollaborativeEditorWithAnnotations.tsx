
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { CollaborationProvider, useCollaboration } from '@/contexts/CollaborationContext';
import UserPresenceOverlay from '@/components/collaboration/UserPresenceOverlay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Edit,
  Mic,
  Video,
  Pencil,
  Save,
  Users,
  X,
  Check
} from 'lucide-react';
import { Annotation } from '@/types/annotations';
import { CursorPosition } from '@/types/collaboration';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_USER_ID = nanoid();

// Editor component that is wrapped by the collaboration provider
const Editor: React.FC<{ documentId: string }> = ({ documentId }) => {
  // Get collaboration context
  const { state, addChange, updatePresence } = useCollaboration();
  const [content, setContent] = useState<string>('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
  const [annotationMode, setAnnotationMode] = useState<'text' | 'voice' | 'video' | 'sketch' | null>(null);
  const [annotationContent, setAnnotationContent] = useState<string>('');
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Fetch initial document content
  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId) return;
      
      try {
        const { data, error } = await supabase
          .from('collaborative_documents')
          .select('content')
          .eq('id', documentId)
          .single();
        
        if (error) throw error;
        if (data) {
          setContent(data.content || '');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
    
    fetchDocument();
  }, [documentId]);
  
  // Fetch annotations
  useEffect(() => {
    const fetchAnnotations = async () => {
      if (!documentId) return;
      
      try {
        const { data, error } = await supabase
          .from('document_annotations')
          .select('*')
          .eq('document_id', documentId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data) {
          const formattedAnnotations: Annotation[] = data.map(item => ({
            id: item.id,
            documentId: item.document_id,
            userId: item.user_id,
            type: item.type,
            content: item.content,
            position: item.position,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            status: item.status,
            parentId: item.parent_id,
            metadata: item.metadata
          }));
          
          setAnnotations(formattedAnnotations);
        }
      } catch (error) {
        console.error('Error fetching annotations:', error);
      }
    };
    
    fetchAnnotations();
    
    // Subscribe to annotation changes
    const channel = supabase
      .channel(`annotations-${documentId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'document_annotations',
        filter: `document_id=eq.${documentId}`
      }, (_) => {
        fetchAnnotations();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);
  
  // Apply document changes
  useEffect(() => {
    if (state.changes.length > 0) {
      let newContent = content;
      
      state.changes.forEach(change => {
        if (change.operation === 'insert') {
          // Simple insert operation (in a real app we'd use more robust algorithms)
          const position = parseInt(change.path, 10);
          newContent = newContent.slice(0, position) + change.value + newContent.slice(position);
        } else if (change.operation === 'delete') {
          // Simple delete operation
          const [start, end] = change.path.split(':').map(Number);
          newContent = newContent.slice(0, start) + newContent.slice(end);
        } else if (change.operation === 'update') {
          // Complete document update
          newContent = change.value;
        }
      });
      
      setContent(newContent);
    }
  }, [state.changes, content]);
  
  // Track cursor position for collaboration
  const handleCursorChange = useCallback(() => {
    if (!editorRef.current) return;
    
    const cursorPosition: CursorPosition = {
      x: 0,
      y: 0,
      selection: {
        start: editorRef.current.selectionStart,
        end: editorRef.current.selectionEnd
      }
    };
    
    updatePresence({ cursorPosition });
  }, [updatePresence]);
  
  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Send change to collaborators
    addChange({
      documentId,
      userId: DEFAULT_USER_ID,
      operation: 'update',
      path: 'content',
      value: newContent
    });
    
    handleCursorChange();
  };
  
  // Create a new annotation
  const createAnnotation = async (position: { x: number, y: number }) => {
    if (!annotationMode || !annotationContent.trim()) return;
    
    try {
      const newAnnotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'> = {
        documentId,
        userId: DEFAULT_USER_ID,
        type: annotationMode,
        content: annotationContent,
        position,
        status: 'open'
      };
      
      const { data, error } = await supabase
        .from('document_annotations')
        .insert({
          document_id: newAnnotation.documentId,
          user_id: newAnnotation.userId,
          type: newAnnotation.type,
          content: newAnnotation.content,
          position: newAnnotation.position,
          status: newAnnotation.status
        });
      
      if (error) throw error;
      
      // Reset annotation state
      setAnnotationMode(null);
      setAnnotationContent('');
      
    } catch (error) {
      console.error('Error creating annotation:', error);
    }
  };
  
  // Handle click on editor to create annotation
  const handleEditorClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!annotationMode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    createAnnotation(position);
  };
  
  // Update annotation status
  const updateAnnotationStatus = async (annotationId: string, status: 'open' | 'in-review' | 'resolved' | 'rejected') => {
    try {
      await supabase
        .from('document_annotations')
        .update({ status })
        .eq('id', annotationId);
      
      setAnnotations(prev => 
        prev.map(a => a.id === annotationId ? { ...a, status } : a)
      );
      
    } catch (error) {
      console.error('Error updating annotation status:', error);
    }
  };
  
  // Save document
  const saveDocument = async () => {
    try {
      await supabase
        .from('collaborative_documents')
        .update({ content })
        .eq('id', documentId);
      
      console.log('Document saved successfully');
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };
  
  // Get annotation status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in-review': return 'bg-amber-500';
      case 'resolved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <div>
          <h2 className="text-lg font-semibold">Collaborative Document</h2>
          <p className="text-sm text-muted-foreground">
            {state.activeUsers.length} user{state.activeUsers.length !== 1 ? 's' : ''} active
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowUsers(!showUsers)}>
            <Users className="h-4 w-4 mr-1" /> 
            {showUsers ? 'Hide Users' : 'Show Users'}
          </Button>
          
          <Button variant="default" size="sm" onClick={saveDocument}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
      
      <div className="flex-grow flex">
        <div className="w-3/4 relative">
          <textarea
            ref={editorRef}
            value={content}
            onChange={handleContentChange}
            onClick={handleEditorClick}
            onKeyUp={handleCursorChange}
            onMouseUp={handleCursorChange}
            className="w-full h-full p-4 font-mono text-base resize-none focus:outline-none border-r"
            placeholder="Start typing here..."
          />
          
          {/* Render annotation markers */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {annotations.map(annotation => (
              <div 
                key={annotation.id}
                className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto ${getStatusColor(annotation.status)} text-white`}
                style={{ 
                  left: `${annotation.position.x - 12}px`, 
                  top: `${annotation.position.y - 12}px`
                }}
                onClick={() => setActiveAnnotation(
                  activeAnnotation?.id === annotation.id ? null : annotation
                )}
              >
                {annotation.type === 'text' && <MessageSquare className="h-3 w-3" />}
                {annotation.type === 'voice' && <Mic className="h-3 w-3" />}
                {annotation.type === 'video' && <Video className="h-3 w-3" />}
                {annotation.type === 'sketch' && <Pencil className="h-3 w-3" />}
              </div>
            ))}
          </div>
          
          {/* Annotation details popup */}
          {activeAnnotation && (
            <div 
              className="absolute bg-background p-4 border rounded-md shadow-md w-80"
              style={{
                left: `${Math.min(activeAnnotation.position.x, document.body.clientWidth - 340)}px`,
                top: `${activeAnnotation.position.y + 20}px`
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className={`px-2 py-0.5 rounded-full text-xs text-white ${getStatusColor(activeAnnotation.status)}`}>
                  {activeAnnotation.status}
                </div>
                <button 
                  className="text-muted-foreground hover:text-foreground" 
                  onClick={() => setActiveAnnotation(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mb-3">
                <p className="text-sm">{activeAnnotation.content}</p>
                <span className="text-xs text-muted-foreground">
                  User {activeAnnotation.userId.substring(0, 8)} • 
                  {new Date(activeAnnotation.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => updateAnnotationStatus(activeAnnotation.id, 'in-review')}
                >
                  Review
                </Button>
                <Button 
                  size="sm" 
                  variant={activeAnnotation.status === 'resolved' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => updateAnnotationStatus(activeAnnotation.id, 'resolved')}
                >
                  <Check className="h-3 w-3 mr-1" /> Resolve
                </Button>
                <Button 
                  size="sm" 
                  variant={activeAnnotation.status === 'rejected' ? 'destructive' : 'outline'} 
                  className="flex-1"
                  onClick={() => updateAnnotationStatus(activeAnnotation.id, 'rejected')}
                >
                  <X className="h-3 w-3 mr-1" /> Reject
                </Button>
              </div>
            </div>
          )}
          
          {/* Annotation tools */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background rounded-full shadow-md border flex items-center p-1">
            <Button
              variant={annotationMode === 'text' ? 'default' : 'ghost'} 
              size="icon"
              className="rounded-full"
              onClick={() => setAnnotationMode(annotationMode === 'text' ? null : 'text')}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant={annotationMode === 'voice' ? 'default' : 'ghost'} 
              size="icon"
              className="rounded-full"
              onClick={() => setAnnotationMode(annotationMode === 'voice' ? null : 'voice')}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant={annotationMode === 'video' ? 'default' : 'ghost'} 
              size="icon"
              className="rounded-full"
              onClick={() => setAnnotationMode(annotationMode === 'video' ? null : 'video')}
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button
              variant={annotationMode === 'sketch' ? 'default' : 'ghost'} 
              size="icon"
              className="rounded-full"
              onClick={() => setAnnotationMode(annotationMode === 'sketch' ? null : 'sketch')}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            {annotationMode && (
              <div className="ml-2 flex items-center bg-muted rounded-full overflow-hidden">
                <input
                  type="text"
                  value={annotationContent}
                  onChange={(e) => setAnnotationContent(e.target.value)}
                  className="bg-transparent border-none py-1 px-3 text-sm focus:outline-none"
                  placeholder={`Add ${annotationMode} annotation...`}
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-full"
                  onClick={() => setAnnotationMode(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          {/* User presence overlay */}
          <UserPresenceOverlay containerId="editor-container" showPresenceList={false} />
        </div>
        
        <div className={`${showUsers ? 'w-1/4' : 'w-0'} transition-all duration-200 overflow-hidden bg-muted/30`}>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
              <TabsTrigger value="annotations" className="flex-1">Annotations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="p-2">
              <h3 className="font-medium mb-2">Active Users</h3>
              <div className="space-y-2">
                {state.activeUsers.map(userId => {
                  const user = state.users[userId];
                  return (
                    <div key={userId} className="flex items-center gap-2 p-2 bg-background rounded-md">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: user?.color || '#888' }} 
                      />
                      <span>{user?.name || `User ${userId.substring(0, 4)}`}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {user?.presence.status || 'active'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="annotations" className="p-2">
              <h3 className="font-medium mb-2">Annotations ({annotations.length})</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {annotations.map(annotation => (
                  <div 
                    key={annotation.id}
                    className="p-2 bg-background rounded-md cursor-pointer hover:bg-muted"
                    onClick={() => setActiveAnnotation(
                      activeAnnotation?.id === annotation.id ? null : annotation
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {annotation.type === 'text' && <MessageSquare className="h-3 w-3" />}
                      {annotation.type === 'voice' && <Mic className="h-3 w-3" />}
                      {annotation.type === 'video' && <Video className="h-3 w-3" />}
                      {annotation.type === 'sketch' && <Pencil className="h-3 w-3" />}
                      <div className={`ml-auto w-2 h-2 rounded-full ${getStatusColor(annotation.status)}`} />
                    </div>
                    <p className="text-sm mt-1 line-clamp-2">{annotation.content}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(annotation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {annotations.length === 0 && (
                  <p className="text-sm text-muted-foreground">No annotations yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Main component with collaboration provider
const CollaborativeEditorWithAnnotations: React.FC<{ documentId: string }> = ({ documentId }) => {
  return (
    <div className="border rounded-md shadow-sm h-[600px]" id="editor-container">
      <CollaborationProvider documentId={documentId} userId={DEFAULT_USER_ID}>
        <Editor documentId={documentId} />
      </CollaborationProvider>
    </div>
  );
};

export default CollaborativeEditorWithAnnotations;
