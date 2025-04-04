
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PencilLine, Trash, Save, Plus } from 'lucide-react';

interface ProjectNotesProps {
  projectId: string;
}

const ProjectNotes: React.FC<ProjectNotesProps> = ({ projectId }) => {
  // Mock notes data - in a real app this would come from an API
  const [notes, setNotes] = useState([
    {
      id: '1',
      content: 'Client prefers a more modern aesthetic with clean lines and minimal decoration.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      author: 'Jane Smith'
    },
    {
      id: '2',
      content: 'Homepage needs to emphasize the product benefits more clearly. Consider adding testimonials near the top of the page.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
      author: 'Mike Johnson'
    }
  ]);
  
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  
  const handleEdit = (note: { id: string, content: string }) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };
  
  const handleSave = () => {
    if (editingNoteId) {
      setNotes(notes.map(note => 
        note.id === editingNoteId 
          ? { ...note, content: editContent } 
          : note
      ));
      setEditingNoteId(null);
      setEditContent('');
    }
  };
  
  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newNote = {
        id: Date.now().toString(),
        content: newNoteContent,
        createdAt: new Date(),
        author: 'Current User'
      };
      setNotes([newNote, ...notes]);
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="space-y-4">
      {isAddingNote ? (
        <Card className="p-4">
          <Textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Enter your note here..."
            className="mb-3"
            rows={4}
          />
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsAddingNote(false);
                setNewNoteContent('');
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNote}>
              <Save className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>
        </Card>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mb-2"
          onClick={() => setIsAddingNote(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Note
        </Button>
      )}
      
      {notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No notes yet. Add your first note to keep track of important project details.</p>
        </div>
      ) : (
        notes.map(note => (
          <Card key={note.id} className="p-4">
            {editingNoteId === note.id ? (
              <>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="mb-3"
                  rows={4}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditingNoteId(null)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-3">{note.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span>{note.author}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(note.createdAt)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(note)}
                      className="h-8 px-2"
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(note.id)}
                      className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default ProjectNotes;
