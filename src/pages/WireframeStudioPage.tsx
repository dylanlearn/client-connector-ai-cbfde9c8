
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/hooks/useProject';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EnhancedWireframeStudio from '@/components/wireframe/EnhancedWireframeStudio';
import { v4 as uuidv4 } from 'uuid';

const WireframeStudioPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading } = useProject();
  
  // Generate a default project ID if none is provided
  const effectiveProjectId = projectId || uuidv4();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Wireframe Studio</h1>
              <p className="text-muted-foreground mt-1">
                {project ? `Project: ${project.name}` : 'Create and customize wireframes'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow">
          <EnhancedWireframeStudio 
            projectId={effectiveProjectId} 
            standalone={true}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WireframeStudioPage;
