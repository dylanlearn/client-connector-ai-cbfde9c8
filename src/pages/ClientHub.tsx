import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Palette, Store } from "lucide-react";
import { toast } from 'sonner';
import { 
  validateClientToken, 
  getClientTasks, 
  updateTaskStatus,
  ClientTask, 
  TaskStatus 
} from '@/utils/client-service';
import LoadingView from '@/components/client-hub/LoadingView';
import AccessDeniedView from '@/components/client-hub/AccessDeniedView';
import TaskCard from '@/components/client-hub/TaskCard';
import WhatNextSection from '@/components/client-hub/WhatNextSection';

const ClientHubPage = () => {
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

  if (isValidatingAccess) {
    return <LoadingView message="Validating your access..." />;
  }

  if (accessDenied) {
    return <AccessDeniedView />;
  }

  const handleTaskButtonClick = (taskType: string, path: string) => {
    navigateTo(path, taskType);
    markTaskCompleted(taskType);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Design Journey</h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete these tasks to help us understand your design preferences
          </p>
        </div>

        {isLoadingTasks ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div><LoadingView /></div>
            <div><LoadingView /></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <TaskCard 
              title="Project Intake Form"
              description="Tell us about your project needs and goals"
              icon={<FileText className="h-4 w-4" />}
              isCompleted={taskStatus.intakeForm}
              btnText={taskStatus.intakeForm ? "Review Your Answers" : "Start Questionnaire"}
              designerNotes={tasks?.find(t => t.taskType === 'intakeForm')?.designerNotes}
              onButtonClick={() => handleTaskButtonClick('intakeForm', '/intake')}
              taskType="intakeForm"
            />

            <TaskCard 
              title="Design Preferences"
              description="Select design elements that match your style"
              icon={<Palette className="h-4 w-4" />}
              isCompleted={taskStatus.designPicker}
              btnText={taskStatus.designPicker ? "Review Your Selections" : "Select Designs"}
              designerNotes={tasks?.find(t => t.taskType === 'designPicker')?.designerNotes}
              onButtonClick={() => handleTaskButtonClick('designPicker', '/design-picker')}
              taskType="designPicker"
            />
          </div>
        )}

        {isLoadingTasks ? (
          <div><LoadingView /></div>
        ) : (
          <TaskCard 
            title="Explore Templates"
            description="Browse our template marketplace for inspiration"
            icon={<Store className="h-4 w-4" />}
            isCompleted={taskStatus.templates}
            btnText={taskStatus.templates ? "Review Templates" : "Browse Templates"}
            designerNotes={tasks?.find(t => t.taskType === 'templates')?.designerNotes}
            onButtonClick={() => handleTaskButtonClick('templates', '/templates')}
            taskType="templates"
          />
        )}

        <WhatNextSection />
      </div>
    </div>
  );
};

export default ClientHubPage;
