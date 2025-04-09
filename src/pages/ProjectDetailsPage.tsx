
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Project Details</h1>
        <p className="text-muted-foreground mb-6">Project ID: {projectId}</p>
        
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <p className="text-muted-foreground">
            This is where you can view and manage details for your project.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetailsPage;
