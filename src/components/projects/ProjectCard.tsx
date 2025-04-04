
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/types/project';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useClientNotifications } from '@/hooks/use-client-notifications';

interface ProjectCardProps {
  project: Project;
  onStatusChange?: (id: string, newStatus: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onStatusChange }) => {
  const { createNotification } = useClientNotifications();
  
  // Function to handle status change and notifications
  const handleStatusChange = async (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(project.id, newStatus);
      
      // If client email exists, send notification about status change
      if (project.client_email) {
        await createNotification.mutateAsync({
          project_id: project.id,
          client_email: project.client_email,
          notification_type: 'status_change',
          message: `Project status has been changed to "${newStatus}".`,
          metadata: {
            previousStatus: project.status,
            newStatus: newStatus
          },
          status: 'pending',
          sent_at: null
        });
      }
    }
  };

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
    <Card className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h2>
            <p className="text-gray-600 text-sm">
              Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
            </p>
          </div>
          <Badge className={`${getStatusColor(project.status)} capitalize text-white`}>
            {project.status}
          </Badge>
        </div>
        <p className="text-gray-700 mb-4">{project.description}</p>
        <div className="flex justify-between items-center">
          <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline">
            View Details
          </Link>
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusChange('draft')}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 text-sm"
            >
              Draft
            </button>
            <button
              onClick={() => handleStatusChange('active')}
              className="px-3 py-1 bg-green-200 text-green-700 rounded hover:bg-green-300 transition-colors duration-200 text-sm"
            >
              Active
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className="px-3 py-1 bg-blue-200 text-blue-700 rounded hover:bg-blue-300 transition-colors duration-200 text-sm"
            >
              Completed
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
