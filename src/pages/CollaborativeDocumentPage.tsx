
import React from 'react';
import CollaborativeEditorWithAnnotations from '@/components/collaboration/CollaborativeEditorWithAnnotations';
import { Button } from '@/components/ui/button';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

const CollaborativeDocumentPage: React.FC = () => {
  // In a real app, we would get the document ID from the route params
  // For this demo, we'll generate a random ID
  const documentId = React.useMemo(() => nanoid(), []);
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collaborative Document</h1>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
      
      <CollaborativeEditorWithAnnotations documentId={documentId} />
      
      <div className="mt-8 bg-gray-100 rounded-md p-4">
        <h2 className="text-lg font-medium mb-2">About this feature</h2>
        <p>
          This collaborative document editor includes a comprehensive annotation system 
          that supports text, voice, video, and sketch annotations. You can create 
          annotations by clicking the toolbar icons and then clicking on the document 
          where you want to add the annotation.
        </p>
        <p className="mt-2">
          Annotations can be threaded (replies), and you can track their status 
          (open, in-review, resolved, rejected). In a real application, these 
          annotations would be synchronized between users in real-time.
        </p>
      </div>
    </div>
  );
};

export default CollaborativeDocumentPage;
