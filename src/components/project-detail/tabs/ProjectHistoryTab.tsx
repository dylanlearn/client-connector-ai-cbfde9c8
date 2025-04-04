
import React from 'react';
import { Project } from '@/types/project';
import { useProjectHistory } from '@/hooks/use-project-history';
import { formatDistanceToNow, format } from 'date-fns';
import { History, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProjectHistoryTabProps {
  project: Project;
}

const ProjectHistoryTab: React.FC<ProjectHistoryTabProps> = ({ project }) => {
  const { history, isLoading, error } = useProjectHistory(project.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100">Draft</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          Error loading project history. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <History className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">No history yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          This project has no status change history yet. 
          When the project status changes, it will be recorded here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Project Status History</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-100"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status changed from</span> 
                    {getStatusBadge(item.previous_status || 'unknown')} 
                    <span>to</span> 
                    {getStatusBadge(item.new_status)}
                  </div>
                  {item.notes && (
                    <p className="text-gray-600 text-sm mt-1">{item.notes}</p>
                  )}
                </div>
                <div className="text-gray-500 text-sm mt-2 md:mt-0">
                  <span title={format(new Date(item.changed_at), 'PPP p')}>
                    {formatDistanceToNow(new Date(item.changed_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHistoryTab;
