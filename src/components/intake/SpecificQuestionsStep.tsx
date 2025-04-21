
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFormContext } from 'react-hook-form';
import { useIntakeForm } from '@/hooks/intake-form';
import { QuestionItem } from './QuestionItem';
import { FormField } from '@/components/ui/form';
import WireframeVisualizer from '@/components/wireframe/WireframeVisualizer';
import { IntakeFormData } from '@/types/intake-form';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";

// Unified props with validation, navigation, and a11y
interface SpecificQuestionsStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => any;
  onNext: () => void;
  onPrevious: () => void;
  isSaving?: boolean;
  canProceed: boolean;
  setCanProceed: (valid: boolean) => void;
}

const SpecificQuestionsStep: React.FC<SpecificQuestionsStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
  isSaving,
  canProceed,
  setCanProceed
}) => {
  // For schema: Place all validation here, e.g. require at least 1 filled value by default
  const [localValid, setLocalValid] = useState(false);
  const { getSpecificQuestionsByType, intakeData } = useIntakeForm();

  // Get questions based on the selected business type
  const questions = getSpecificQuestionsByType();

  // Use either passed in formData or intakeData from the hook
  const displayData = formData || intakeData;

  // Validate at least one specific question answered
  useEffect(() => {
    let hasValid = false;
    if (questions && questions.length && formData && formData.specificQuestions) {
      hasValid = questions.some(q => formData.specificQuestions && formData.specificQuestions[q.id]);
    }
    setLocalValid(hasValid);
    setCanProceed(hasValid);
  }, [formData, questions, setCanProceed]);

  const handleNext = () => {
    if (localValid) {
      toast({
        title: "Details Saved",
        description: "Specific questions for your business type have been saved.",
        variant: "success",
      });
      onNext();
    } else {
      toast({
        title: "Validation Error",
        description: "Please answer at least one question before continuing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6" aria-label="Specific Questions">
        <h2 className="text-xl font-semibold mb-4">Specific Questions</h2>
        <p className="text-muted-foreground mb-6">
          These questions help us understand your specific needs based on your business type.
        </p>
        {questions.length > 0 ? (
          <div className="space-y-8">
            {questions.map((question) => (
              <FormField
                key={question.id}
                name={`specificQuestions.${question.id}`}
                render={({ field }) => (
                  <QuestionItem
                    question={question}
                    fieldValue={field.value}
                    onChange={val => {
                      field.onChange(val);
                      // Mark as valid if this is filled
                      let valid = !!val || questions.some(q => formData?.specificQuestions && formData.specificQuestions[q.id]);
                      setLocalValid(valid);
                      setCanProceed(valid);
                      // Save to parent
                      updateFormData({
                        specificQuestions: {
                          ...(formData?.specificQuestions || {}),
                          [question.id]: val
                        }
                      });
                    }}
                  />
                )}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            No specific questions for the selected business type.
          </p>
        )}
      </Card>
      {/* Preview section */}
      {displayData && Object.keys(displayData).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <Separator className="mb-6" />
          <WireframeVisualizer 
            wireframe={{
              id: "preview",
              title: displayData.projectName || displayData.businessName || "Business Preview",
              description: displayData.projectDescription || displayData.businessDescription || "Based on your inputs",
              sections: [],
              colorScheme: {
                primary: "#0070f3",
                secondary: "#0070f3",
                accent: "#0070f3",
                background: "#ffffff",
                text: "#000000"
              },
              typography: {
                headings: "Inter",
                body: "Inter"
              }
            }}
            preview={true}
          />
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2" role="group" aria-label="Navigation">
        <Button type="button" variant="outline" onClick={onPrevious} aria-label="Previous Step">
          Back
        </Button>
        <Button type="button" onClick={handleNext} disabled={isSaving || !canProceed} aria-label={canProceed ? "Continue" : "Please answer at least one question"}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SpecificQuestionsStep;
