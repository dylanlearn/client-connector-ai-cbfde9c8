
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormItem } from '@/components/ui/form';

export interface Question {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  required?: boolean;
  options?: { label: string; value: string }[];
}

interface QuestionItemProps {
  question: Question;
  fieldValue?: any;
  onChange: (value: any) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  fieldValue,
  onChange
}) => {
  const renderInputByType = () => {
    switch (question.type) {
      case 'textarea':
        return (
          <Textarea
            id={`question-${question.id}`}
            value={fieldValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here"
            className="w-full"
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`question-${question.id}`}
              checked={fieldValue || false}
              onCheckedChange={onChange}
            />
            <Label htmlFor={`question-${question.id}`}>Yes</Label>
          </div>
        );
      default:
        return (
          <Input
            id={`question-${question.id}`}
            type="text"
            value={fieldValue || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here"
            className="w-full"
          />
        );
    }
  };

  return (
    <FormItem className="space-y-2">
      <div className="flex flex-col">
        <Label 
          htmlFor={`question-${question.id}`}
          className="text-base font-medium"
        >
          {question.question}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {renderInputByType()}
      </div>
    </FormItem>
  );
};

export default QuestionItem;
