
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/types/project';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useClientNotifications } from '@/hooks/use-client-notifications';
import { UseMutationResult } from '@tanstack/react-query';
import { NotificationStatus, NotificationType } from '@/types/client-notification';
import { toast } from 'sonner';
import { AppErrorBoundary } from '@/components/error-handling/AppErrorBoundary';

interface ProjectCardProps {
  project: Project;
  onStatusChange?: (id: string, newStatus: string) => void;
  updateProject?: UseMutationResult<unknown, Error, unknown, unknown>;
  onClick?: () => void;
}

interface ProjectNotification {
  project_id: string;
  client_email: string;
  notification_type: NotificationType;
  message: string;
  metadata: {
    previousStatus: string;
    newStatus: string;
  };
  status: NotificationStatus;
  sent_at: null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onStatusChange, onClick, updateProject }) => {
  const { createNotification } = useClientNotifications();
  
  // Function to handle status change and notifications
  const handleStatusChange = async (e: React.MouseEvent<HTMLButtonElement>, newStatus: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (onStatusChange) {
        onStatusChange(project.id, newStatus);
        
        // If client email exists, send notification about status change
        if (project.client_email) {
          await createNotification.mutateAsync({
            project_id: project.id,
            client_email: project.client_email,
            notification_type: 'status_change' as NotificationType,
            message: `Project status has been changed to "${newStatus}".`,
            metadata: {
              previousStatus: project.status,
              newStatus: newStatus
            },
            status: 'pending' as NotificationStatus,
            sent_at: null
          } as ProjectNotification);
          
          toast.success("Notification sent to client about status change");
        }
      }
    } catch (error) {
      console.error("Failed to update project status:", error);
      toast.error("Failed to update project status", {
        description: "Please try again or contact support if the issue persists."
      });
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'archived': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick();
    }
  };

  // Render fallback if project data is invalid
  if (!project || !project.id) {
    return (
      <Card className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p>Project data unavailable</p>
        </div>
      </Card>
    );
  }

  return (
    <AppErrorBoundary>
      <Card 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.title || 'Untitled Project'}</h2>
              <p className="text-gray-600 text-sm">
                Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
              </p>
            </div>
            <Badge className={`${getStatusColor(project.status)} capitalize text-white`}>
              {project.status}
            </Badge>
          </div>
          <p className="text-gray-700 mb-4">{project.description || 'No description available'}</p>
          <div className="flex justify-between items-center">
            <Link 
              to={`/projects/${project.id}`} 
              className="text-blue-600 hover:underline" 
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
            <div className="flex space-x-2">
              <button
                onClick={(e) => handleStatusChange(e, 'draft')}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200 text-sm"
                disabled={createNotification.isLoading}
              >
                Draft
              </button>
              <button
                onClick={(e) => handleStatusChange(e, 'active')}
                className="px-3 py-1 bg-green-200 text-green-700 rounded hover:bg-green-300 transition-colors duration-200 text-sm"
                disabled={createNotification.isLoading}
              >
                Active
              </button>
              <button
                onClick={(e) => handleStatusChange(e, 'completed')}
                className="px-3 py-1 bg-blue-200 text-blue-700 rounded hover:bg-blue-300 transition-colors duration-200 text-sm"
                disabled={createNotification.isLoading}
              >
                Completed
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppErrorBoundary>
  );
};

export default ProjectCard;
