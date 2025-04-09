
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFormContext } from 'react-hook-form';
import { useIntakeForm } from '@/hooks/use-intake-form';
import { QuestionItem } from './QuestionItem';
import { FormField } from '@/components/ui/form';
import { WireframeVisualizer } from '@/components/wireframe';

const SpecificQuestionsStep: React.FC = () => {
  const { formState } = useFormContext();
  const { getSpecificQuestionsByType, intakeData } = useIntakeForm();
  
  // Get questions based on the selected business type
  const questions = getSpecificQuestionsByType();
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Specific Questions</h2>
        <p className="text-muted-foreground mb-6">
          These questions help us understand your specific needs based on your business type.
        </p>
        
        {questions.length > 0 ? (
          <div className="space-y-8">
            {questions.map((question, index) => (
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
      {intakeData && Object.keys(intakeData).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <Separator className="mb-6" />
          <WireframeVisualizer 
            wireframeData={{
              title: intakeData.businessName || "Business Preview",
              description: intakeData.businessDescription || "Based on your inputs",
              sections: []
            }}
            preview={true}
          />
        </Card>
      )}
    </div>
  );
};

export default SpecificQuestionsStep;
