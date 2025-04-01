
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  validateClientToken, 
  getClientTasks, 
  updateTaskStatus,
  ClientTask, 
  TaskStatus 
} from '@/utils/client-service';
import { createRealtimeSubscription } from '@/utils/realtime-utils';
import { supabase } from '@/integrations/supabase/client';

export function useClientHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [designerId, setDesignerId] = useState<string | null>(null);
  const [isValidatingAccess, setIsValidatingAccess] = useState(true);
  const [taskStatus, setTaskStatus] = useState({
    intakeForm: false,
    designPicker: false,
    templates: false
  });
  const [tasks, setTasks] = useState<ClientTask[] | null>(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('clientToken');
    const dId = urlParams.get('designerId');

    if (!token || !dId) {
      setAccessDenied(true);
      setIsValidatingAccess(false);
      return;
    }

    setClientToken(token);
    setDesignerId(dId);

    const validateAccess = async () => {
      setIsValidatingAccess(true);
      try {
        const isValid = await validateClientToken(token, dId);
        if (!isValid) {
          setAccessDenied(true);
          toast.error("This link is invalid or has expired.");
        } else {
          loadClientTasks(token, dId);
        }
      } catch (error) {
        console.error("Error validating client access:", error);
        setAccessDenied(true);
      } finally {
        setIsValidatingAccess(false);
      }
    };

    validateAccess();
  }, [location.search]);

  useEffect(() => {
    if (!clientToken || !designerId || accessDenied) return;
    
    // Set up real-time subscription for task updates
    const { unsubscribe } = createRealtimeSubscription(
      'client-tasks-updates',
      'client_tasks',
      `link_id=in.(select id from client_access_links where token='${clientToken}' and designer_id='${designerId}')`, 
      (payload) => {
        console.log('Task updated in real-time:', payload);
        
        if (payload.new && tasks) {
          // Update the tasks array with the new task
          const taskId = payload.new.id;
          const updatedTasks = tasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  status: payload.new.status as TaskStatus,
                  completedAt: payload.new.completed_at ? new Date(payload.new.completed_at) : null,
                  designerNotes: payload.new.designer_notes
                }
              : task
          );
          
          setTasks(updatedTasks);
          
          // Update task status
          if (payload.new.status === 'completed') {
            const taskType = payload.new.task_type;
            if (taskType in taskStatus) {
              setTaskStatus(prev => ({
                ...prev,
                [taskType]: true
              }));
              
              toast.success(`Task "${getTaskName(taskType)}" completed!`);
            }
          }
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [clientToken, designerId, accessDenied, tasks]);

  const getTaskName = (taskType: string): string => {
    switch (taskType) {
      case 'intakeForm': return 'Project Intake Form';
      case 'designPicker': return 'Design Preferences';
      case 'templates': return 'Templates';
      default: return taskType;
    }
  };

  const loadClientTasks = async (token: string, designerId: string) => {
    setIsLoadingTasks(true);
    try {
      const clientTasks = await getClientTasks(token, designerId);
      if (clientTasks) {
        setTasks(clientTasks);
        
        const statusMap = {
          intakeForm: false,
          designPicker: false,
          templates: false
        };
        
        clientTasks.forEach(task => {
          if (task.taskType in statusMap && task.status === 'completed') {
            statusMap[task.taskType as keyof typeof statusMap] = true;
          }
        });
        
        setTaskStatus(statusMap);
      }
    } catch (error) {
      console.error("Error loading client tasks:", error);
      toast.error("Failed to load your tasks. Please try again.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const navigateTo = (path: string, taskType: string) => {
    const task = tasks?.find(t => t.taskType === taskType);
    if (!task) {
      toast.error(`Task not found for ${taskType}`);
      return;
    }
    
    if (task.status !== 'completed') {
      updateTaskStatus(task.id, 'in_progress');
    }
    
    if (clientToken && designerId) {
      navigate(`${path}?clientToken=${clientToken}&designerId=${designerId}&taskId=${task.id}`);
    }
  };

  const markTaskCompleted = async (task: string) => {
    const taskObj = tasks?.find(t => t.taskType === task);
    if (!taskObj) {
      toast.error(`Task not found for ${task}`);
      return;
    }
    
    const success = await updateTaskStatus(taskObj.id, 'completed');
    if (success) {
      const updatedStatus = { ...taskStatus, [task]: true };
      setTaskStatus(updatedStatus);
      
      if (tasks) {
        const updatedTasks = tasks.map(t => 
          t.id === taskObj.id 
            ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date() } 
            : t
        );
        setTasks(updatedTasks);
      }
      
      toast.success(`Task "${task}" marked as completed.`);
    } else {
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleTaskButtonClick = (taskType: string, path: string) => {
    navigateTo(path, taskType);
    markTaskCompleted(taskType);
  };

  return {
    clientToken,
    designerId,
    isValidatingAccess,
    taskStatus,
    tasks,
    isLoadingTasks,
    accessDenied,
    handleTaskButtonClick
  };
}
