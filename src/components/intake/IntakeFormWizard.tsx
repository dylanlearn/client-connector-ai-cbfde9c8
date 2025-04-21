
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SiteTypeStep from "./SiteTypeStep";
import GeneralQuestionsStep from "./GeneralQuestionsStep";
import SpecificQuestionsStep from "./SpecificQuestionsStep";
import { useIntakeForm } from "@/hooks/intake-form";
import { IntakeFormData } from "@/types/intake-form";
import { cn } from "@/lib/utils";

/**
 * Modular, extensible production-ready Intake Form Wizard.
 */
const STEP_COMPONENTS = [
  SiteTypeStep,
  GeneralQuestionsStep,
  SpecificQuestionsStep,
  // Add new steps here as your form evolves (DesignPreferencesStep, ReviewStep, etc)
];

const STEP_TITLES = [
  "Choose Site Type",
  "General Questions",
  "Specific Questions",
  // Add step titles here as needed
];

const TOTAL_STEPS = STEP_COMPONENTS.length;

export default function IntakeFormWizard() {
  const {
    formData,
    updateFormData,
    submitForm,
    isLoading,
    isSaving,
    clearFormData,
  } = useIntakeForm();

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Handles form submission on the last step
  const handleSubmit = async () => {
    await submitForm();
    setCompleted(true);
  };

  // Step navigation
  const goToNextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
  const goToPrevStep = () => setStep(prev => Math.max(prev - 1, 0));

  // Step rendering
  const StepComponent = STEP_COMPONENTS[step];

  if (completed) {
    return (
      <Card className="max-w-xl mx-auto my-12">
        <CardHeader>
          <CardTitle>Thank you!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">We've received your intake submission. You'll hear from us soon.</p>
          <Button onClick={clearFormData} variant="outline">
            Start New Intake
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full max-w-xl mx-auto py-8 px-2 md:px-0")}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl">{STEP_TITLES[step]}</CardTitle>
              <div className="text-muted-foreground text-sm">
                Step {step + 1} of {TOTAL_STEPS}
              </div>
            </div>
            <Progress value={((step + 1) / TOTAL_STEPS) * 100} className="w-24 h-2" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Render current step, always with current validated data */}
          <StepComponent
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPrevStep}
            isSaving={isSaving}
          />

          {/* Navigation for steps, with accessibility */}
          <div className="flex justify-between gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              disabled={step === 0}
              className="flex-1"
              aria-label="Previous Step"
            >
              Back
            </Button>
            {step < TOTAL_STEPS - 1 ? (
              <Button
                type="button"
                onClick={goToNextStep}
                disabled={isSaving}
                className="flex-1"
                aria-label="Next Step"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving || isLoading}
                className="flex-1"
                aria-label="Submit Form"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
