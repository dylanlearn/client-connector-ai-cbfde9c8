import React from 'react';
import { Project, UpdateProjectData } from '@/types/project';
import ProjectColumn from './ProjectColumn';
import ProjectCard from './ProjectCard';
import { UseMutationResult } from '@tanstack/react-query';

type ProjectsByStatus = {
  [key: string]: Project[];
};

interface ProjectBoardProps {
  projects: Project[];
  updateProject: UseMutationResult<any, Error, UpdateProjectData & { id: string }, unknown>;
  onProjectClick: (projectId: string) => void;
  view: 'board' | 'list';
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projects, updateProject, onProjectClick, view }) => {
  // Group projects by their status
  const projectsByStatus = projects.reduce((acc: ProjectsByStatus, project) => {
    const status = project.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(project);
    return acc;
  }, {} as ProjectsByStatus);

  // Define the order of columns
  const columnOrder = ['draft', 'active', 'completed'];
  
  // If view is list, render a list view instead of columns
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            updateProject={updateProject} 
            onClick={() => onProjectClick(project.id)}
          />
        ))}
      </div>
    );
  }
  
  // Otherwise render the board view (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columnOrder.map(status => {
        const columnProjects = projectsByStatus[status] || [];
        return (
          <ProjectColumn key={status} title={status} count={columnProjects.length}>
            {columnProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                updateProject={updateProject} 
                onClick={() => onProjectClick(project.id)}
              />
            ))}
          </ProjectColumn>
        );
      })}
    </div>
  );
};

export default ProjectBoard;
