
import React from 'react';
import { FlowValidation } from '@/services/testing/UserFlowTestingService';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UserFlowValidationResultsProps {
  validation: FlowValidation;
}

const UserFlowValidationResults: React.FC<UserFlowValidationResultsProps> = ({ validation }) => {
  if (!validation) return null;

  const completionPercentage = (validation.completionRate || 0) * 100;
  const hasIssues = validation.issuesDetected && validation.issuesDetected.length > 0;

  const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between mb-1">
          <div className="text-sm font-medium">Flow Completion Rate</div>
          <div className="text-sm font-medium">{completionPercentage.toFixed(0)}%</div>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      <div>
        <h4 className="font-medium mb-3">
          {hasIssues ? 'Issues Detected' : 'No Issues Detected'}
        </h4>
        
        {hasIssues ? (
          <div className="space-y-3">
            {validation.issuesDetected?.map((issue, index) => (
              <div 
                key={index} 
                className={`border rounded-md p-3 ${getSeverityClass(issue.severity)}`}
              >
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      Issue at Step {issue.stepOrder}
                    </div>
                    <div>{issue.issue}</div>
                    <div className="text-sm mt-1">
                      <span className="uppercase font-medium mr-1">Severity:</span>
                      <span className="capitalize">{issue.severity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 items-center text-green-700 bg-green-50 p-4 rounded-md">
            <CheckCircle2 className="h-5 w-5" />
            <span>All flow steps completed successfully!</span>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Validation completed in {validation.executionTimeMs || 0}ms
      </div>
    </div>
  );
};

export default UserFlowValidationResults;
