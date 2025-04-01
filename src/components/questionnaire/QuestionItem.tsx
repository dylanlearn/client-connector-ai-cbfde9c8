
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, Trash2 } from "lucide-react";

export interface Question {
  id: string;
  question: string;
  type: string;
  required: boolean;
  active: boolean;
}

interface QuestionItemProps {
  question: Question;
  provided: any;
  toggleQuestion: (id: string) => void;
  deleteQuestion: (id: string) => void;
  updateQuestion: (id: string, field: string, value: any) => void;
}

const QuestionItem = ({
  question,
  provided,
  toggleQuestion,
  deleteQuestion,
  updateQuestion,
}: QuestionItemProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`border rounded-lg p-4 ${
        question.active ? "bg-white" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div {...provided.dragHandleProps}>
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <Switch
            checked={question.active}
            onCheckedChange={() => toggleQuestion(question.id)}
          />
          <Label htmlFor={`question-${question.id}-active`}>
            {question.active ? "Active" : "Inactive"}
          </Label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteQuestion(question.id)}
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor={`question-${question.id}`}>Question</Label>
          <Textarea
            id={`question-${question.id}`}
            value={question.question}
            onChange={(e) =>
              updateQuestion(
                question.id,
                "question",
                e.target.value
              )
            }
            className="mt-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`required-${question.id}`}
            checked={question.required}
            onCheckedChange={(checked) =>
              updateQuestion(question.id, "required", checked)
            }
          />
          <Label htmlFor={`required-${question.id}`}>
            Required question
          </Label>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
