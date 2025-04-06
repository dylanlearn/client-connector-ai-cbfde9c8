
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDesignProcess, DesignStage } from '@/contexts/design-process/DesignProcessProvider';
import { ClipboardList, FileText, PaintBucket, LayoutGrid, MessageSquare, Repeat, CheckCircle } from 'lucide-react';

const DesignProcessStatus: React.FC = () => {
  const { currentStage, progress } = useDesignProcess();
  
  const stages: { id: DesignStage; label: string; icon: React.ReactNode }[] = [
    { id: 'intake', label: 'Client Intake', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'analysis', label: 'Design Brief', icon: <FileText className="h-4 w-4" /> },
    { id: 'moodboard', label: 'Visual Direction', icon: <PaintBucket className="h-4 w-4" /> },
    { id: 'wireframe', label: 'Wireframing', icon: <LayoutGrid className="h-4 w-4" /> },
    { id: 'feedback', label: 'Client Feedback', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'revision', label: 'Revisions', icon: <Repeat className="h-4 w-4" /> },
    { id: 'handoff', label: 'Project Handoff', icon: <CheckCircle className="h-4 w-4" /> },
  ];
  
  const currentStageIndex = stages.findIndex(stage => stage.id === currentStage);
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Design Process</h3>
              <p className="text-sm text-muted-foreground">
                {currentStageIndex >= 0 ? stages[currentStageIndex].label : 'Getting started'}
              </p>
            </div>
            <span className="text-sm font-medium">{progress}% Complete</span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="grid grid-cols-7 gap-2">
            {stages.map((stage, index) => {
              const isActive = currentStage === stage.id;
              const isCompleted = currentStageIndex > index;
              
              return (
                <div 
                  key={stage.id}
                  className={`flex flex-col items-center py-2 px-1 rounded-md ${
                    isActive ? 'bg-primary/10 text-primary' : 
                    isCompleted ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {stage.icon}
                  <span className="text-[10px] text-center mt-1 hidden sm:block">{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignProcessStatus;
