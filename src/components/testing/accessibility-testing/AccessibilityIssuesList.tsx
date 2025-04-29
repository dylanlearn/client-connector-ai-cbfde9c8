
import React, { useEffect, useState } from 'react';
import { AccessibilityTestingService, AccessibilityIssue } from '@/services/testing/AccessibilityTestingService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, AlertCircle, AlertOctagon, MoveRight } from 'lucide-react';

interface AccessibilityIssuesListProps {
  testRunId: string;
}

const AccessibilityIssuesList: React.FC<AccessibilityIssuesListProps> = ({ testRunId }) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadIssues = async () => {
      setIsLoading(true);
      try {
        const data = await AccessibilityTestingService.getIssues(testRunId);
        setIssues(data);
      } catch (error) {
        console.error('Error loading accessibility issues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, [testRunId]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading accessibility issues...</div>;
  }

  if (issues.length === 0) {
    return (
      <Alert>
        <AlertTitle>No accessibility issues found</AlertTitle>
        <AlertDescription>
          Your wireframe has passed all accessibility checks for this test run.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div 
          key={issue.id} 
          className={`border rounded-md p-4 ${getSeverityColor(issue.severity)}`}
        >
          <div className="flex items-start gap-3">
            {getSeverityIcon(issue.severity)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">{issue.issueType}</h4>
                <Badge variant="outline">{issue.wcagCriterion}</Badge>
              </div>
              <p className="mt-1">{issue.description}</p>
              
              {issue.impactDescription && (
                <div className="mt-2">
                  <strong className="text-sm">Impact:</strong> {issue.impactDescription}
                </div>
              )}
              
              {issue.recommendation && (
                <div className="mt-3 bg-white bg-opacity-50 p-2 rounded border border-current">
                  <div className="flex items-center text-sm font-medium">
                    <MoveRight className="h-4 w-4 mr-1" />
                    Recommendation:
                  </div>
                  <div className="mt-1">{issue.recommendation}</div>
                </div>
              )}
              
              {issue.elementId && (
                <div className="mt-3 text-xs opacity-80">
                  <strong>Element:</strong> {issue.elementId}
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

export default AccessibilityIssuesList;
