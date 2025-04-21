
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QuestionItem } from './QuestionItem';
import { FormField } from '@/components/ui/form';
import { IntakeFormData } from '@/types/intake-form';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { getQuestionsBySiteType } from "@/hooks/intake-form/questions";

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
  
  // Get questions based on the selected business type
  const questions = getQuestionsBySiteType(formData.siteType);

  // Validate at least one specific question answered
  useEffect(() => {
    let hasValid = false;
    if (questions && questions.length && formData) {
      hasValid = questions.some(q => {
        return formData.specificQuestions && formData.specificQuestions[q.id];
      });
    }
    setLocalValid(hasValid);
    setCanProceed(hasValid);
  }, [formData, questions, setCanProceed]);

  const handleNext = () => {
    if (localValid) {
      toast({
        description: "Specific questions for your business type have been saved."
      });
      onNext();
    } else {
      toast({
        description: "Please answer at least one question before continuing."
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
                    fieldValue={formData?.specificQuestions?.[question.id]}
                    onChange={val => {
                      // Mark as valid if this is filled
                      const valid = !!val || questions.some(q => {
                        return formData?.specificQuestions && formData.specificQuestions[q.id];
                      });
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
      {formData && Object.keys(formData).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <Separator className="mb-6" />
          {/* Just a placeholder - the WireframeVisualizer component is not available */}
          <div className="bg-gray-100 p-4 rounded border text-center">
            <p>Preview based on your inputs</p>
            <p className="text-sm text-gray-500">
              {formData.projectName || formData.businessName || "Business Preview"}
            </p>
          </div>
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
