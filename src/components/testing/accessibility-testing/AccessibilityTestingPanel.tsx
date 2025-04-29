
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AccessibilityTestingService, AccessibilityTestRun } from '@/services/testing/AccessibilityTestingService';
import { toast } from 'sonner';
import AccessibilityIssuesList from './AccessibilityIssuesList';

interface AccessibilityTestingPanelProps {
  wireframeId: string;
}

const AccessibilityTestingPanel: React.FC<AccessibilityTestingPanelProps> = ({ wireframeId }) => {
  const [testRuns, setTestRuns] = useState<AccessibilityTestRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<string | null>(null);
  const [wcagLevel, setWcagLevel] = useState<string>('AA');
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const runs = await AccessibilityTestingService.getTestRuns(wireframeId);
        setTestRuns(runs);
        if (runs.length > 0) {
          setSelectedRun(runs[0].id || null);
        }
      } catch (error) {
        console.error('Error loading accessibility test runs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [wireframeId]);

  const handleRunTest = async () => {
    setIsRunning(true);
    try {
      const result = await AccessibilityTestingService.runAccessibilityTest(wireframeId, wcagLevel);
      toast.success('Accessibility test completed');

      // Refresh test runs
      const runs = await AccessibilityTestingService.getTestRuns(wireframeId);
      setTestRuns(runs);
      setSelectedRun(result.id || null);
    } catch (error) {
      console.error('Error running accessibility test:', error);
      toast.error('Failed to run accessibility test');
    } finally {
      setIsRunning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const selectedTestRun = testRuns.find(run => run.id === selectedRun);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Accessibility Compliance Testing</span>
          {selectedTestRun && selectedTestRun.overallScore !== undefined && (
            <div className="text-2xl font-bold flex items-center gap-2">
              <span>Score:</span>
              <span className={`px-2 py-1 rounded ${
                selectedTestRun.overallScore >= 90 ? 'bg-green-100 text-green-800' :
                selectedTestRun.overallScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedTestRun.overallScore}/100
              </span>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Test your wireframe for WCAG accessibility compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">WCAG Compliance Level</label>
              <Select
                value={wcagLevel}
                onValueChange={setWcagLevel}
                disabled={isRunning}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select WCAG level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">WCAG 2.1 Level A</SelectItem>
                  <SelectItem value="AA">WCAG 2.1 Level AA (Recommended)</SelectItem>
                  <SelectItem value="AAA">WCAG 2.1 Level AAA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">&nbsp;</label>
              <Button 
                onClick={handleRunTest} 
                disabled={isLoading || isRunning}
              >
                {isRunning ? 'Running Test...' : 'Run Accessibility Test'}
              </Button>
            </div>
          </div>

          {selectedTestRun && selectedTestRun.overallScore !== undefined && (
            <div className="mt-6">
              <div className="flex justify-between mb-2 text-sm">
                <span>Accessibility Score</span>
                <span>{selectedTestRun.overallScore}%</span>
              </div>
              <Progress
                value={selectedTestRun.overallScore}
                className={getScoreColor(selectedTestRun.overallScore)}
              />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Issues Found</h3>
                {selectedRun && <AccessibilityIssuesList testRunId={selectedRun} />}
              </div>
            </div>
          )}

          {testRuns.length > 0 && !selectedTestRun?.overallScore && (
            <div className="border rounded-md overflow-hidden mt-6">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">WCAG Level</th>
                    <th className="p-2 text-left">Score</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testRuns.map((run) => (
                    <tr key={run.id} className="border-t">
                      <td className="p-2">
                        {new Date(run.started_at || '').toLocaleString()}
                      </td>
                      <td className="p-2">{run.wcagLevel}</td>
                      <td className="p-2">{run.overallScore || 'N/A'}</td>
                      <td className="p-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          run.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : run.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {run.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedRun(run.id || null)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {testRuns.length} accessibility tests run for this wireframe
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open('https://www.w3.org/WAI/standards-guidelines/wcag/', '_blank')}>
          WCAG Guidelines
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessibilityTestingPanel;
