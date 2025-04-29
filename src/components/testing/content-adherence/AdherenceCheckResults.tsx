
import React from 'react';
import { ContentAdherenceCheck, ContentAdherenceService } from '@/services/testing/ContentAdherenceService';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AdherenceCheckResultsProps {
  check: ContentAdherenceCheck;
}

const AdherenceCheckResults: React.FC<AdherenceCheckResultsProps> = ({ check }) => {
  if (!check) return null;

  const compliancePercentage = (check.complianceScore || 0) * 100;
  const hasIssues = check.issues && check.issues.length > 0;
  const scoreColorClass = ContentAdherenceService.getScoreColor(check.complianceScore || 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between mb-1">
          <div className="text-sm font-medium">Content Compliance Score</div>
          <div className={`text-sm font-medium ${scoreColorClass}`}>{compliancePercentage.toFixed(0)}%</div>
        </div>
        <Progress value={compliancePercentage} className="h-2" />
      </div>

      {check.recommendations && (
        <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
          <p className="text-sm text-blue-700">{check.recommendations}</p>
        </div>
      )}

      <div>
        <h4 className="font-medium mb-3">
          {hasIssues ? 'Content Issues' : 'No Content Issues'}
        </h4>
        
        {hasIssues ? (
          <div className="space-y-3">
            {check.issues?.map((issue, index) => (
              <div 
                key={index} 
                className={`border rounded-md p-3 ${ContentAdherenceService.getSeverityColor(issue.severity)}`}
              >
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      Element: {issue.elementId}
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
            <span>Content meets all strategy requirements!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdherenceCheckResults;
