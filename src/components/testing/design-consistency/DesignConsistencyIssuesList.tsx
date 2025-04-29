
import React, { useEffect, useState } from 'react';
import { DesignConsistencyService, DesignConsistencyIssue } from '@/services/testing/DesignConsistencyService';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, ArrowRight, FileSymlink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">High</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Low</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Info</span>;
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading design consistency issues...</div>;
  }

  if (issues.length === 0) {
    return (
      <div className="border rounded-md p-6 bg-green-50 flex flex-col items-center justify-center">
        <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
        <h3 className="text-lg font-medium text-green-700">No consistency issues found</h3>
        <p className="text-green-600 text-center max-w-md mt-1">
          Great job! Your design is consistent across all wireframes and components.
        </p>
      </div>
    );
  }

  // Group issues by type
  const issuesByType: Record<string, DesignConsistencyIssue[]> = {};
  issues.forEach(issue => {
    if (!issuesByType[issue.issueType]) {
      issuesByType[issue.issueType] = [];
    }
    issuesByType[issue.issueType].push(issue);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-medium">Consistency Issues</h3>
        <div className="text-sm text-muted-foreground">
          {issues.length} issues found
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {Object.entries(issuesByType).map(([type, typeIssues]) => (
          <AccordionItem key={type} value={type}>
            <AccordionTrigger className="hover:bg-muted/50 px-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{type}</span>
                <span className="ml-2 text-xs bg-muted rounded-full px-2 py-0.5">
                  {typeIssues.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-10">
              <div className="space-y-4 py-2">
                {typeIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-md p-3">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(issue.severity)}
                        {issue.wireframeId && (
                          <span className="text-xs text-muted-foreground">
                            Wireframe ID: {issue.wireframeId.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {issue.elementId && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <FileSymlink className="h-3 w-3 mr-1" />
                            {issue.elementId}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p>{issue.description}</p>
                    
                    {(issue.expectedValue || issue.actualValue) && (
                      <div className="flex items-center mt-2 text-sm">
                        <div className="bg-muted px-2 py-1 rounded">
                          {issue.actualValue || 'undefined'}
                        </div>
                        <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground" />
                        <div className="bg-green-50 border border-green-300 px-2 py-1 rounded">
                          {issue.expectedValue || 'consistent value'}
                        </div>
                      </div>
                    )}
                    
                    {issue.recommendation && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Recommendation:</span> {issue.recommendation}
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline">Fix Issue</Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default DesignConsistencyIssuesList;
