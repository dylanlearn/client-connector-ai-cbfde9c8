import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, FileText, Palette, Store, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { validateClientToken, getClientTasks, updateTaskStatus, ClientTask } from '@/utils/client-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TaskStatus } from '@/types/client';

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
    // Extract client token and designer ID from the URL
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

    // Validate the token
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
        
        // Update task status based on fetched tasks
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
    // Find the task ID for the taskType
    const task = tasks?.find(t => t.taskType === taskType);
    if (!task) {
      toast.error(`Task not found for ${taskType}`);
      return;
    }
    
    // Update the task status to in_progress if it's not completed yet
    if (task.status !== 'completed') {
      updateTaskStatus(task.id, 'in_progress');
    }
    
    // Navigate to the task page with the client token and designer ID
    if (clientToken && designerId) {
      navigate(`${path}?clientToken=${clientToken}&designerId=${designerId}&taskId=${task.id}`);
    }
  };

  const markTaskCompleted = async (task: string) => {
    // Find the task ID for the taskType
    const taskObj = tasks?.find(t => t.taskType === task);
    if (!taskObj) {
      toast.error(`Task not found for ${task}`);
      return;
    }
    
    // Update the task status to completed
    const success = await updateTaskStatus(taskObj.id, 'completed');
    if (success) {
      const updatedStatus = { ...taskStatus, [task]: true };
      setTaskStatus(updatedStatus);
      
      // Update the task in the tasks array
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

  // If access is being validated, show a loading state
  if (isValidatingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-72 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-64 mb-8" />
        </div>
      </div>
    );
  }

  // If access is denied, show an error message
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              This client hub link is invalid or has expired. Please contact your designer for a new link.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/')}
            className="mx-auto block"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

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
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className={taskStatus.intakeForm ? "border-green-500" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">Project Intake Form</CardTitle>
                  {taskStatus.intakeForm ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                </div>
                <CardDescription>
                  Tell us about your project needs and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Answer questions about your business, target audience, and project requirements to help us understand what you need.
                </p>
                {tasks?.find(t => t.taskType === 'intakeForm')?.designerNotes && (
                  <div className="text-sm italic text-gray-500 mb-4 bg-gray-50 p-3 rounded-md">
                    <strong>Designer Note:</strong> {tasks.find(t => t.taskType === 'intakeForm')?.designerNotes}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    navigateTo('/intake', 'intakeForm');
                    markTaskCompleted('intakeForm');
                  }}
                  className="w-full"
                  variant={taskStatus.intakeForm ? "outline" : "default"}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {taskStatus.intakeForm ? "Review Your Answers" : "Start Questionnaire"}
                </Button>
              </CardFooter>
            </Card>

            <Card className={taskStatus.designPicker ? "border-green-500" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">Design Preferences</CardTitle>
                  {taskStatus.designPicker ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                </div>
                <CardDescription>
                  Select design elements that match your style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Browse through different design options and select the ones that resonate with your brand's aesthetic and vision.
                </p>
                {tasks?.find(t => t.taskType === 'designPicker')?.designerNotes && (
                  <div className="text-sm italic text-gray-500 mb-4 bg-gray-50 p-3 rounded-md">
                    <strong>Designer Note:</strong> {tasks.find(t => t.taskType === 'designPicker')?.designerNotes}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    navigateTo('/design-picker', 'designPicker');
                    markTaskCompleted('designPicker');
                  }}
                  className="w-full"
                  variant={taskStatus.designPicker ? "outline" : "default"}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  {taskStatus.designPicker ? "Review Your Selections" : "Select Designs"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {isLoadingTasks ? (
          <Skeleton className="h-64 mb-8" />
        ) : (
          <Card className={taskStatus.templates ? "border-green-500" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-semibold">Explore Templates</CardTitle>
                {taskStatus.templates ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <CardDescription>
                Browse our template marketplace for inspiration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Explore our collection of professionally designed templates that can serve as a starting point for your project.
              </p>
              {tasks?.find(t => t.taskType === 'templates')?.designerNotes && (
                <div className="text-sm italic text-gray-500 mb-4 bg-gray-50 p-3 rounded-md">
                  <strong>Designer Note:</strong> {tasks.find(t => t.taskType === 'templates')?.designerNotes}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {
                  navigateTo('/templates', 'templates');
                  markTaskCompleted('templates');
                }}
                className="w-full"
                variant={taskStatus.templates ? "outline" : "default"}
              >
                <Store className="mr-2 h-4 w-4" />
                {taskStatus.templates ? "Review Templates" : "Browse Templates"}
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
          <p className="text-gray-600 mb-4">
            After you complete these tasks, your designer will receive your preferences and feedback. They'll use this information to create personalized design recommendations for your project.
          </p>
          <p className="text-gray-600">
            You'll be notified when your designer has updates to share with you. Thank you for helping us understand your vision!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientHubPage;
