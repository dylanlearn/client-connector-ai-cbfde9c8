
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { TaskCardProps } from "@/types/client";

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  icon,
  isCompleted,
  btnText,
  designerNotes,
  onButtonClick,
  taskType,
}) => {
  return (
    <Card className={isCompleted ? "border-green-500" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-gray-300" />
          )}
        </div>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          {taskType === 'intakeForm' && 'Answer questions about your business, target audience, and project requirements to help us understand what you need.'}
          {taskType === 'designPicker' && 'Browse through different design options and select the ones that resonate with your brand\'s aesthetic and vision.'}
          {taskType === 'templates' && 'Explore our collection of professionally designed templates that can serve as a starting point for your project.'}
        </p>
        {designerNotes && (
          <div className="text-sm italic text-gray-500 mb-4 bg-gray-50 p-3 rounded-md">
            <strong>Designer Note:</strong> {designerNotes}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onButtonClick}
          className="w-full"
          variant={isCompleted ? "outline" : "default"}
        >
          {icon}
          <span className="ml-2">{btnText}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
