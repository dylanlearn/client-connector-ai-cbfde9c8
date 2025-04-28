
import React from 'react';
import { ProjectGoalsKPIDashboard } from '@/components/goals/ProjectGoalsKPIDashboard';
import { useParams } from 'react-router-dom';

const ProjectGoalsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  return (
    <div className="container mx-auto py-8">
      <ProjectGoalsKPIDashboard projectId={projectId} />
    </div>
  );
};

export default ProjectGoalsPage;
