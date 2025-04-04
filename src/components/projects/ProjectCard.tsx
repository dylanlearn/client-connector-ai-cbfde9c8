
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';
import { CalendarClock, User, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  index?: number;
  statusColor?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, statusColor }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    if (statusColor) return statusColor;
    
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'archived': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md" 
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <Badge className={`${getStatusColor(project.status)} text-white capitalize`}>
            {project.status}
          </Badge>
        </div>
        
        {project.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{project.client_name}</span>
          </div>
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-1" />
            <span>Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
