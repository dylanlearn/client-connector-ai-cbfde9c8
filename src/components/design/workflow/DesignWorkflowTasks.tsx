
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { DesignWorkflowTask } from '@/types/design-workflow';

interface DesignWorkflowTasksProps {
  tasks: DesignWorkflowTask[];
  isLoading: boolean;
  onUpdateStatus: (taskId: string, status: string) => void;
  onRefresh: () => void;
}

export function DesignWorkflowTasks({ 
  tasks, 
  isLoading, 
  onUpdateStatus, 
  onRefresh 
}: DesignWorkflowTasksProps) {
  const [filter, setFilter] = useState('all');
  
  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.task_status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Blocked</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Medium</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No tasks found matching the current filter.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <Card key={task.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.task_status)}
                      <h3 className="font-semibold">{task.task_title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.task_description || 'No description provided'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(task.task_status)}
                      {getPriorityBadge(task.priority)}
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {task.artifact_type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-x-2">
                    {task.task_status !== 'in_progress' && task.task_status !== 'completed' && (
                      <Button 
                        size="sm" 
                        onClick={() => onUpdateStatus(task.id, 'in_progress')}
                      >
                        Start
                      </Button>
                    )}
                    {task.task_status !== 'completed' && (
                      <Button 
                        size="sm" 
                        variant="default" 
                        onClick={() => onUpdateStatus(task.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
