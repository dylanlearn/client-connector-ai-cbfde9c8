
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, FileText, Palette, Store } from "lucide-react";
import { useDesignSelection } from '@/hooks/use-design-selection';
import { toast } from 'sonner';

const ClientHubPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientAccessMode, clientToken, designerId } = useDesignSelection({});
  const [taskStatus, setTaskStatus] = useState({
    intakeForm: false,
    designPicker: false,
    templates: false
  });

  useEffect(() => {
    // If someone accesses this page without a client token, redirect them
    if (!clientAccessMode) {
      toast.error("This page is only available for client access.");
      navigate('/');
      return;
    }

    // Check local storage for completed tasks
    const savedStatus = localStorage.getItem(`taskStatus-${clientToken}`);
    if (savedStatus) {
      setTaskStatus(JSON.parse(savedStatus));
    }
  }, [clientAccessMode, clientToken, navigate]);

  const saveTaskStatus = (updatedStatus) => {
    setTaskStatus(updatedStatus);
    localStorage.setItem(`taskStatus-${clientToken}`, JSON.stringify(updatedStatus));
  };

  const navigateTo = (path) => {
    // Preserve the client token and designer ID in the URL
    navigate(`${path}?clientToken=${clientToken}&designerId=${designerId}`);
  };

  const markTaskCompleted = (task) => {
    const updatedStatus = { ...taskStatus, [task]: true };
    saveTaskStatus(updatedStatus);
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
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {
                  navigateTo('/intake');
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
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {
                  navigateTo('/design-picker');
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
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => {
                navigateTo('/templates');
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
