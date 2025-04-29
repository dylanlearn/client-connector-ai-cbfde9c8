
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DesignConsistencyService, DesignConsistencyIssue } from '@/services/testing/DesignConsistencyService';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface DesignConsistencyIssuesListProps {
  checkId: string;
}

const DesignConsistencyIssuesList: React.FC<DesignConsistencyIssuesListProps> = ({ checkId }) => {
  const [issues, setIssues] = useState<DesignConsistencyIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadIssues = async () => {
      setIsLoading(true);
      try {
        const data = await DesignConsistencyService.getIssues(checkId);
        setIssues(data);
      } catch (error) {
        console.error('Error loading consistency issues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, [checkId]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading consistency issues...</div>;
  }

  if (issues.length === 0) {
    return <Alert className="my-4">
      <AlertTitle>No consistency issues found</AlertTitle>
      <AlertDescription>
        This check didn't detect any design consistency issues.
      </AlertDescription>
    </Alert>;
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div 
          key={issue.id} 
          className={`border rounded-md p-4 ${DesignConsistencyService.getSeverityColor(issue.severity)}`}
        >
          <div className="flex items-start gap-3">
            {getSeverityIcon(issue.severity)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">{issue.issueType}</h4>
              </div>
              <p className="mt-1">{issue.description}</p>
              
              {(issue.expectedValue || issue.actualValue) && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  {issue.expectedValue && (
                    <div className="p-2 bg-white bg-opacity-50 rounded">
                      <div className="font-semibold">Expected</div>
                      <div className="break-all">{issue.expectedValue}</div>
                    </div>
                  )}
                  {issue.actualValue && (
                    <div className="p-2 bg-white bg-opacity-50 rounded">
                      <div className="font-semibold">Actual</div>
                      <div className="break-all">{issue.actualValue}</div>
                    </div>
                  )}
                </div>
              )}
              
              {issue.recommendation && (
                <div className="mt-3 bg-white bg-opacity-50 p-2 rounded border border-current">
                  <div className="text-sm font-medium">Recommendation:</div>
                  <div className="mt-1">{issue.recommendation}</div>
                </div>
              )}
              
              {issue.wireframeId && (
                <div className="mt-3 text-xs opacity-80">
                  <strong>Wireframe:</strong> {issue.wireframeId}
                  {issue.elementId && <span> • <strong>Element:</strong> {issue.elementId}</span>}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline">Fix Issue</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DesignConsistencyIssuesList;
