
import React from 'react';
import { FeasibilityCheck, TechnicalFeasibilityService } from '@/services/testing/TechnicalFeasibilityService';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FeasibilityResultDetailsProps {
  check: FeasibilityCheck;
}

const FeasibilityResultDetails: React.FC<FeasibilityResultDetailsProps> = ({ check }) => {
  if (!check) return null;

  const hasIssues = check.issuesDetected && check.issuesDetected.length > 0;

  return (
    <div className="space-y-4">
      {hasIssues ? (
        <>
          {check.issuesDetected!.map((issue, index) => (
            <div 
              key={index} 
              className={`border rounded-md p-3 ${TechnicalFeasibilityService.getSeverityColor(issue.severity)}`}
            >
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-5 w-5 mt-0.5" />
                <div>
                  <div className="font-medium">{issue.constraintName}</div>
                  <div>{issue.description}</div>
                  <div className="text-sm mt-1">
                    <span className="uppercase font-medium mr-1">Severity:</span>
                    <span className="capitalize">{issue.severity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex gap-2 items-center text-green-700 bg-green-50 p-4 rounded-md">
          <CheckCircle2 className="h-5 w-5" />
          <span>No technical issues detected! Your wireframe is feasible for implementation.</span>
        </div>
      )}
    </div>
  );
};

export default FeasibilityResultDetails;
