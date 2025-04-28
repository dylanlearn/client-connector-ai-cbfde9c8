
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DesignWorkflowTasks } from './DesignWorkflowTasks';
import { DesignVersionManager } from './DesignVersionManager';
import { DesignWebhooks } from './DesignWebhooks';
import { DesignDeployments } from './DesignDeployments';
import { DesignWorkflowService } from '@/services/design-workflow/design-workflow-service';
import type { DesignWorkflowTask } from '@/types/design-workflow';

interface DesignWorkflowManagerProps {
  projectId: string;
  designId?: string;
}

export function DesignWorkflowManager({ projectId, designId }: DesignWorkflowManagerProps) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<DesignWorkflowTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      loadTasks();
    }
  }, [projectId]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await DesignWorkflowService.getWorkflowTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Error loading tasks",
        description: "Failed to load workflow tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await DesignWorkflowService.updateTaskStatus(taskId, status);
      loadTasks();
      toast({
        title: "Task updated",
        description: "Task status has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design Workflow Automation</CardTitle>
        <CardDescription>
          Manage design-to-development workflow, versions, and deployments
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="tasks">
              <DesignWorkflowTasks 
                tasks={tasks} 
                isLoading={isLoading} 
                onUpdateStatus={updateTaskStatus}
                onRefresh={loadTasks}
              />
            </TabsContent>
            
            <TabsContent value="versions">
              <DesignVersionManager 
                projectId={projectId}
                designId={designId}
              />
            </TabsContent>
            
            <TabsContent value="deployments">
              <DesignDeployments 
                projectId={projectId}
                designId={designId}
              />
            </TabsContent>
            
            <TabsContent value="webhooks">
              <DesignWebhooks 
                projectId={projectId}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
