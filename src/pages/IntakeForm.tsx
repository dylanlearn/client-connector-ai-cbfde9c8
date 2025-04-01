
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import SiteTypeStep from "@/components/intake/SiteTypeStep";
import GeneralQuestionsStep from "@/components/intake/GeneralQuestionsStep";
import SpecificQuestionsStep from "@/components/intake/SpecificQuestionsStep";
import DesignPreferencesStep from "@/components/intake/DesignPreferencesStep";
import CompletionStep from "@/components/intake/CompletionStep";
import { useIntakeForm } from "@/hooks/use-intake-form";

const IntakeForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formData, updateFormData, submitForm, isLoading } = useIntakeForm();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Set the initial step based on saved progress
  useEffect(() => {
    const savedStep = localStorage.getItem("intakeFormStep");
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("intakeFormStep", currentStep.toString());
    // Scroll to top on step change
    window.scrollTo(0, 0);
  }, [currentStep]);

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
        return <SiteTypeStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 2:
        return <GeneralQuestionsStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <SpecificQuestionsStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <DesignPreferencesStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <CompletionStep formData={formData} onComplete={handleComplete} onPrevious={handlePrevious} />;
      default:
        return <SiteTypeStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
  );
};

export default IntakeForm;
