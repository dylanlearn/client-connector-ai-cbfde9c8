
import React from 'react';
import { Project, UpdateProjectData } from '@/types/project';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { UseMutationResult } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { User, Calendar, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  project: Project;
  updateProject: UseMutationResult<any, Error, UpdateProjectData & { id: string }, unknown>;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, updateProject, onClick }) => {
  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    updateProject.mutate({ 
      id: project.id, 
      status: 'archived'
    });
  };
  
  const handleStatusChange = (status: 'draft' | 'active' | 'completed') => (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    updateProject.mutate({
      id: project.id,
      status
    });
  };

  return (
    <Card 
      className="mb-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <User className="w-3.5 h-3.5 mr-1" /> 
            {project.client_name}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleStatusChange('draft')}>
              Mark as Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStatusChange('active')}>
              Mark as Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStatusChange('completed')}>
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleArchive} className="text-red-600">
              Archive Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-600 line-clamp-2 text-sm">
          {project.description || "No description provided"}
        </p>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 pt-0">
        <div className="flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1" />
          Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
