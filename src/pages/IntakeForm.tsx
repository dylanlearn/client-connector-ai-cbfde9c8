import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import SiteTypeStep from "@/components/intake/SiteTypeStep";
import GeneralQuestionsStep from "@/components/intake/GeneralQuestionsStep";
import SpecificQuestionsStep from "@/components/intake/SpecificQuestionsStep";
import DesignPreferencesStep from "@/components/intake/DesignPreferencesStep";
import CompletionStep from "@/components/intake/CompletionStep";
import { useIntakeForm } from "@/hooks/intake-form";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const IntakeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const { 
    formData, 
    updateFormData, 
    submitForm, 
    clearFormData, 
    hasStartedForm, 
    isLoading,
    isSaving,
    getSavedStep,
    saveCurrentStep,
    hasInProgressForm
  } = useIntakeForm();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/" && hasInProgressForm()) {
      setShowResumeDialog(true);
    }
  }, [location.pathname, hasInProgressForm]);

  useEffect(() => {
    if (!showResumeDialog) {
      const savedStep = getSavedStep();
      if (savedStep > 1) {
        setCurrentStep(savedStep);
      }
    }
  }, [getSavedStep, showResumeDialog]);

  useEffect(() => {
    saveCurrentStep(currentStep);
    window.scrollTo(0, 0);
  }, [currentStep, saveCurrentStep]);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("User not authenticated, redirecting to login");
      toast({
        title: "Authentication Required",
        description: "Please log in to access the intake form",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast, isLoading]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <LoadingSpinner size="lg" />
          <p className="ml-2">Loading your profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleStartNewForm = () => {
    clearFormData();
    setCurrentStep(1);
    setShowResumeDialog(false);
  };

  const handleResumeForm = () => {
    const savedStep = getSavedStep();
    setCurrentStep(savedStep);
    setShowResumeDialog(false);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await submitForm();
      toast({
        title: "Form submitted successfully",
        description: "Thank you for completing the intake form. We'll be in touch soon.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error submitting form",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SiteTypeStep formData={formData} updateFormData={updateFormData} onNext={handleNext} isSaving={isSaving} />;
      case 2:
        return <GeneralQuestionsStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <SpecificQuestionsStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <DesignPreferencesStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <CompletionStep formData={formData} onComplete={handleComplete} onPrevious={handlePrevious} />;
      default:
        return <SiteTypeStep formData={formData} updateFormData={updateFormData} onNext={handleNext} isSaving={isSaving} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resume Previous Form?</AlertDialogTitle>
              <AlertDialogDescription>
                We found a previously started form. Would you like to resume where you left off or start a new form?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleStartNewForm}>Start New</AlertDialogCancel>
              <AlertDialogAction onClick={handleResumeForm}>Resume</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Project Intake Form</h1>
            <p className="mt-2 text-lg text-gray-600">
              Help us understand your project better so we can deliver exactly what you need.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2 text-sm font-medium text-gray-500">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "What are you building?"}
                {currentStep === 2 && "General Information"}
                {currentStep === 3 && "Specific Requirements"}
                {currentStep === 4 && "Design Preferences"}
                {currentStep === 5 && "Review & Submit"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntakeForm;
