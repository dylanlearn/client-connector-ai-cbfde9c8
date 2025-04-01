
import React from 'react';
import { FileText, Palette, Store } from "lucide-react";
import TaskCard from './TaskCard';
import LoadingView from './LoadingView';
import { ClientTask } from '@/types/client';

interface TasksSectionProps {
  isLoading: boolean;
  taskStatus: {
    intakeForm: boolean;
    designPicker: boolean;
    templates: boolean;
  };
  tasks: ClientTask[] | null;
  onTaskButtonClick: (taskType: string, path: string) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({ 
  isLoading, 
  taskStatus, 
  tasks, 
  onTaskButtonClick 
}) => {
  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div><LoadingView /></div>
          <div><LoadingView /></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TaskCard 
            title="Project Intake Form"
            description="Tell us about your project needs and goals"
            icon={<FileText className="h-4 w-4" />}
            isCompleted={taskStatus.intakeForm}
            btnText={taskStatus.intakeForm ? "Review Your Answers" : "Start Questionnaire"}
            designerNotes={tasks?.find(t => t.taskType === 'intakeForm')?.designerNotes}
            onButtonClick={() => onTaskButtonClick('intakeForm', '/intake')}
            taskType="intakeForm"
          />

          <TaskCard 
            title="Design Preferences"
            description="Select design elements that match your style"
            icon={<Palette className="h-4 w-4" />}
            isCompleted={taskStatus.designPicker}
            btnText={taskStatus.designPicker ? "Review Your Selections" : "Select Designs"}
            designerNotes={tasks?.find(t => t.taskType === 'designPicker')?.designerNotes}
            onButtonClick={() => onTaskButtonClick('designPicker', '/design-picker')}
            taskType="designPicker"
          />
        </div>
      )}

      {isLoading ? (
        <div><LoadingView /></div>
      ) : (
        <TaskCard 
          title="Explore Templates"
          description="Browse our template marketplace for inspiration"
          icon={<Store className="h-4 w-4" />}
          isCompleted={taskStatus.templates}
          btnText={taskStatus.templates ? "Review Templates" : "Browse Templates"}
          designerNotes={tasks?.find(t => t.taskType === 'templates')?.designerNotes}
          onButtonClick={() => onTaskButtonClick('templates', '/templates')}
          taskType="templates"
        />
      )}
    </>
  );
};

export default TasksSection;
