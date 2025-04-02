
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuestionItem } from "@/data/questionnaire-questions";

interface QuestionPromptProps {
  question: QuestionItem;
  answer: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  currentQuestionIndex: number;
}

const QuestionPrompt = ({ question, answer, onChange, currentQuestionIndex }: QuestionPromptProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor={`question-${currentQuestionIndex}`} className="text-lg font-medium">
        {question.question}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Textarea
        id={`question-${currentQuestionIndex}`}
        value={answer || ""}
        onChange={onChange}
        placeholder="Your answer..."
        rows={5}
        className="w-full"
      />
      
      {currentQuestionIndex === 3 && (
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-indigo-800">
            <span className="font-medium">Tip:</span> Including specific details about what 
            you like (colors, layout, typography) will help us better understand your preferences.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionPrompt;
