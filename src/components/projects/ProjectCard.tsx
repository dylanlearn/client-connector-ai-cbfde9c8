
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/types/project';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useClientNotifications } from '@/hooks/use-client-notifications';
import { UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AppErrorBoundary } from '@/components/error-handling/AppErrorBoundary';
import { LoadingOverlay } from '@/components/export/LoadingOverlay';

interface ProjectCardProps {
  project: Project;
  onStatusChange?: (id: string, newStatus: string) => void;
  updateProject?: UseMutationResult<unknown, Error, unknown, unknown>;
  onClick?: () => void;
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
            notification_type: 'status_change',
            message: `Project status has been changed to "${newStatus}".`,
            metadata: {
              previousStatus: project.status,
              newStatus: newStatus
            },
            status: 'pending',
            sent_at: null
          });
          
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
      case 'active': return 'bg-gradient-to-r from-[#3a8ef6] to-[#5f9df7]';
      case 'completed': return 'bg-gradient-to-r from-[#8439e9] to-[#6142e7]';
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
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p>Project data unavailable</p>
        </div>
      </Card>
    );
  }

  // Show loading state when the notification is being sent
  const isProcessingNotification = createNotification?.isPending;

  return (
    <AppErrorBoundary>
      <Card 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
        onClick={handleCardClick}
      >
        {isProcessingNotification && (
          <LoadingOverlay 
            message="Sending notification..." 
            spinnerSize="sm"
            className="rounded-lg"
          />
        )}
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{project.title || 'Untitled Project'}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
              </p>
            </div>
            <Badge className={`${getStatusColor(project.status)} capitalize text-white`}>
              {project.status}
            </Badge>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{project.description || 'No description available'}</p>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Link 
              to={`/projects/${project.id}`} 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm" 
              onClick={(e) => e.stopPropagation()}
              aria-label={`View details for project ${project.title || 'Untitled'}`}
            >
              View Details
            </Link>
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={(e) => handleStatusChange(e, 'draft')}
                className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                disabled={isProcessingNotification}
                aria-label="Set project status to draft"
              >
                Draft
              </button>
              <button
                onClick={(e) => handleStatusChange(e, 'active')}
                className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-gradient-to-r from-[#3a8ef6]/20 to-[#5f9df7]/20 text-[#3a8ef6] dark:text-[#5f9df7] rounded hover:from-[#3a8ef6]/30 hover:to-[#5f9df7]/30 transition-colors duration-200"
                disabled={isProcessingNotification}
                aria-label="Set project status to active"
              >
                Active
              </button>
              <button
                onClick={(e) => handleStatusChange(e, 'completed')}
                className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-gradient-to-r from-[#8439e9]/20 to-[#6142e7]/20 text-[#8439e9] dark:text-[#6142e7] rounded hover:from-[#8439e9]/30 hover:to-[#6142e7]/30 transition-colors duration-200"
                disabled={isProcessingNotification}
                aria-label="Set project status to completed"
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
