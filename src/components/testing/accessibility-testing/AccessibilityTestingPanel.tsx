
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AccessibilityTestingService, AccessibilityTestRun } from '@/services/testing/AccessibilityTestingService';
import AccessibilityIssuesList from './AccessibilityIssuesList';
import { toast } from 'sonner';

interface AccessibilityTestingPanelProps {
  wireframeId: string;
}

const AccessibilityTestingPanel: React.FC<AccessibilityTestingPanelProps> = ({ wireframeId }) => {
  const [wcagLevel, setWcagLevel] = useState<string>("AA");
  const [testRuns, setTestRuns] = useState<AccessibilityTestRun[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(true);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  useEffect(() => {
    loadTestRuns();
  }, [wireframeId]);

  const loadTestRuns = async () => {
    setIsLoadingTests(true);
    try {
      const runs = await AccessibilityTestingService.getTestRuns(wireframeId);
      setTestRuns(runs);
    } catch (error) {
      console.error('Error loading accessibility test runs:', error);
      toast.error('Failed to load accessibility test runs');
    } finally {
      setIsLoadingTests(false);
    }
  };

  const runAccessibilityTest = async () => {
    setIsRunningTest(true);
    try {
      await AccessibilityTestingService.runAccessibilityTest(wireframeId, wcagLevel);
      toast.success('Accessibility test started successfully');
      // In a real app, this might start a background job
      // For demo, we'll simulate a completed test after a delay
      setTimeout(() => {
        loadTestRuns();
      }, 2000);
    } catch (error) {
      console.error('Error starting accessibility test:', error);
      toast.error('Failed to start accessibility test');
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Run Accessibility Compliance Test</CardTitle>
          <CardDescription>
            Test your wireframe against WCAG accessibility standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">WCAG Compliance Level</label>
              <Select 
                value={wcagLevel} 
                onValueChange={setWcagLevel}
                disabled={isRunningTest}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select compliance level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Level A (Minimum)</SelectItem>
                  <SelectItem value="AA">Level AA (Standard)</SelectItem>
                  <SelectItem value="AAA">Level AAA (Enhanced)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={runAccessibilityTest}
              disabled={isRunningTest}
              className="mt-2 md:mt-0"
            >
              {isRunningTest ? 'Running Test...' : 'Run Accessibility Test'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Accessibility Test History</CardTitle>
          <CardDescription>
            Previous accessibility compliance test results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTests ? (
            <div className="py-4">Loading test runs...</div>
          ) : testRuns.length === 0 ? (
            <Alert>
              <AlertTitle>No accessibility tests found</AlertTitle>
              <AlertDescription>
                Run your first accessibility test to see results
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {testRuns.map((run) => (
                <div 
                  key={run.id} 
                  className="border rounded-lg overflow-hidden"
                >
                  <div 
                    className="p-4 border-b cursor-pointer flex items-center justify-between"
                    onClick={() => setSelectedRunId(selectedRunId === run.id ? null : run.id)}
                  >
                    <div>
                      <h4 className="font-medium">
                        WCAG {run.wcagLevel} Compliance Test
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(run.startedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {run.overallScore !== undefined && (
                        <div className={`text-xl font-semibold ${AccessibilityTestingService.getScoreColor(run.overallScore)}`}>
                          {run.overallScore}%
                        </div>
                      )}
                      <span className="text-xs">
                        {run.status}
                      </span>
                    </div>
                  </div>
                  {selectedRunId === run.id && (
                    <div className="p-4 bg-slate-50">
                      {run.resultsSummary && (
                        <div className="mb-4 grid grid-cols-5 gap-2 text-center">
                          <div className="bg-red-100 p-2 rounded">
                            <div className="font-bold">{run.resultsSummary.critical}</div>
                            <div className="text-xs">Critical</div>
                          </div>
                          <div className="bg-orange-100 p-2 rounded">
                            <div className="font-bold">{run.resultsSummary.high}</div>
                            <div className="text-xs">High</div>
                          </div>
                          <div className="bg-amber-100 p-2 rounded">
                            <div className="font-bold">{run.resultsSummary.medium}</div>
                            <div className="text-xs">Medium</div>
                          </div>
                          <div className="bg-blue-100 p-2 rounded">
                            <div className="font-bold">{run.resultsSummary.low}</div>
                            <div className="text-xs">Low</div>
                          </div>
                          <div className="bg-gray-100 p-2 rounded">
                            <div className="font-bold">{run.resultsSummary.info}</div>
                            <div className="text-xs">Info</div>
                          </div>
                        </div>
                      )}
                      <AccessibilityIssuesList testRunId={run.id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityTestingPanel;
