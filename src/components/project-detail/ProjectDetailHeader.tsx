
import React from 'react';
import { Calendar, Users, Bookmark, Clock } from 'lucide-react';
import { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ProjectDetailHeaderProps {
  project: Project;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'archived': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="border-b pb-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <div className="flex items-center mt-2 text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span className="mr-4">{project.client_name}</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>
              Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        <Badge className={`${getStatusColor(project.status)} capitalize text-white`}>
          {project.status}
        </Badge>
      </div>
      
      {project.description && (
        <p className="text-gray-600 mb-6">{project.description}</p>
      )}
      
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
        <Button size="sm" variant="outline">
          <Bookmark className="h-4 w-4 mr-2" />
          Save to Templates
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;
