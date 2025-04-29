
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrowserTestingService, BrowserTestResult } from '@/services/testing/BrowserTestingService';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface BrowserTestResultsListProps {
  sessionId: string;
}

const BrowserTestResultsList: React.FC<BrowserTestResultsListProps> = ({ sessionId }) => {
  const [results, setResults] = useState<BrowserTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      try {
        const data = await BrowserTestingService.getTestResults(sessionId);
        setResults(data);
      } catch (error) {
        console.error('Error loading test results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [sessionId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading test results...</div>;
  }

  if (results.length === 0) {
    return <Alert className="my-4">
      <AlertTitle>No test results found</AlertTitle>
      <AlertDescription>
        This test session doesn't have any detailed results recorded.
      </AlertDescription>
    </Alert>;
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Alert key={result.id} variant={result.status === 'passed' ? 'default' : 'destructive'}>
          <div className="flex items-start gap-2">
            {getStatusIcon(result.status)}
            <div>
              <AlertTitle className="text-base">{result.testType}</AlertTitle>
              <AlertDescription>
                <div className="mt-1">
                  {result.details?.notes || result.actualResult || 'No additional details'}
                </div>
                
                {result.elementId && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Element: {result.elementId}
                  </div>
                )}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default BrowserTestResultsList;
