
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the question item type
interface Question {
  id: string;
  question: string;
  type: string;
  required: boolean;
}

interface QuestionItemProps {
  question: Question;
  fieldValue: any;
  onChange: (value: any) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  fieldValue,
  onChange
}) => {
  // Handle different input types
  const renderInputField = () => {
    switch (question.type) {
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={question.id} 
              checked={!!fieldValue}
              onCheckedChange={onChange}
            />
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea 
              id={question.id}
              placeholder={`Enter ${question.question.toLowerCase()}`}
              value={fieldValue || ''}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );
      
      case 'text':
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={question.id} className="text-sm font-medium">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input 
              id={question.id}
              placeholder={`Enter ${question.question.toLowerCase()}`}
              value={fieldValue || ''}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div className="question-item py-2">
      {renderInputField()}
    </div>
  );
};
