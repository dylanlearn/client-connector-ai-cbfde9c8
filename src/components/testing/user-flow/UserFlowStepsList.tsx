
import React from 'react';
import { FlowPathStep } from '@/services/testing/UserFlowTestingService';
import { ArrowRight, MousePointer, Type, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserFlowStepsListProps {
  steps: FlowPathStep[];
}

const UserFlowStepsList: React.FC<UserFlowStepsListProps> = ({ steps }) => {
  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No steps defined for this flow path.
      </div>
    );
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'click':
        return <MousePointer className="h-4 w-4" />;
      case 'input':
        return <Type className="h-4 w-4" />;
      default:
        return <X className="h-4 w-4" />;
    }
  };

  return (
    <div className="flow-steps">
      {steps.map((step, index) => (
        <div key={step.id} className="mb-6 relative">
          {index < steps.length - 1 && (
            <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-muted-foreground/20 -z-10"></div>
          )}
          <div className="flow-step">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-medium">
                {step.stepOrder}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getActionIcon(step.actionType)}
                    <span className="capitalize">{step.actionType}</span>
                  </Badge>
                </div>
                <div className="font-medium">Element: {step.elementId}</div>
                {step.validationRule && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Validation: </span>
                    {step.validationRule}
                  </div>
                )}
                {step.expectedDestination && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Navigate to: {step.expectedDestination}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserFlowStepsList;
