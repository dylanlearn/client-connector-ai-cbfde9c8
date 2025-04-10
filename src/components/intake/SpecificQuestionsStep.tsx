
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFormContext } from 'react-hook-form';
import { useIntakeForm } from '@/hooks/use-intake-form';
import { QuestionItem } from './QuestionItem';
import { FormField } from '@/components/ui/form';
import WireframeVisualizer from '@/components/wireframe/WireframeVisualizer';
import { IntakeFormData } from '@/types/intake-form';

interface SpecificQuestionsStepProps {
  formData?: IntakeFormData;
  updateFormData?: (data: Partial<IntakeFormData>) => any;
  onNext?: () => void;
  onPrevious?: () => void;
}

const SpecificQuestionsStep: React.FC<SpecificQuestionsStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious
}) => {
  const { formState } = useFormContext();
  const { getSpecificQuestionsByType, intakeData } = useIntakeForm();
  
  // Get questions based on the selected business type
  const questions = getSpecificQuestionsByType();
  
  // Use either passed in formData or intakeData from the hook
  const displayData = formData || intakeData;
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
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
                    onChange={field.onChange}
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
              sections: []
            }}
            preview={true}
          />
        </Card>
      )}

      {/* Navigation buttons would be here, if needed */}
      {(onNext || onPrevious) && (
        <div className="flex justify-between pt-4">
          {onPrevious && (
            <button 
              type="button"
              className="px-4 py-2 border rounded-md hover:bg-gray-100" 
              onClick={onPrevious}
            >
              Previous
            </button>
          )}
          {onNext && (
            <button
              type="button"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              onClick={onNext}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecificQuestionsStep;
