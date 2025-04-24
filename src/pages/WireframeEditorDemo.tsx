
import React from 'react';
import CollaborativeEditorWithAnnotations from '@/components/collaboration/CollaborativeEditorWithAnnotations';
import { nanoid } from 'nanoid';

const WireframeEditorDemo: React.FC = () => {
  const documentId = React.useMemo(() => nanoid(), []);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Wireframe Editor with Annotations</h1>
      <CollaborativeEditorWithAnnotations documentId={documentId} />
      
      <div className="mt-8 bg-gray-100 rounded-md p-4">
        <h2 className="text-lg font-medium mb-2">About this Demo</h2>
        <p>
          This is a demo of the collaborative editor with a comprehensive annotation system.
          You can create annotations by clicking the toolbar icons and then clicking on the 
          document where you want to add the annotation.
        </p>
        <p className="mt-2">
          In a real application, changes and annotations would be synchronized between users
          in real-time. Future enhancements will include role-based access control and
          version control with branching.
        </p>
      </div>
    </div>
  );
};

export default WireframeEditorDemo;
