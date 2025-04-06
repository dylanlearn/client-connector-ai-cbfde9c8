
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBackClick}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-medium mb-4">Project ID: {projectId}</h2>
        <p className="text-muted-foreground">This page will display detailed information about your project.</p>
      </div>
      
      <div className="mt-6 flex">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/project/${projectId}/advanced-wireframe`)}
        >
          Create Advanced Wireframe
        </Button>
      </div>
    </div>
  );
};
