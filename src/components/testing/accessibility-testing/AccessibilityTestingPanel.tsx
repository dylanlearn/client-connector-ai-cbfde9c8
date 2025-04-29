
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertMessage } from '@/components/ui/alert-message';
import { AccessibilityTestingService, AccessibilityTestRun } from '@/services/testing/AccessibilityTestingService';
import AccessibilityIssuesList from './AccessibilityIssuesList';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface AccessibilityTestingPanelProps {
  wireframeId: string;
}

const AccessibilityTestingPanel: React.FC<AccessibilityTestingPanelProps> = ({ wireframeId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testRuns, setTestRuns] = useState<AccessibilityTestRun[]>([]);
  const [activeTestRun, setActiveTestRun] = useState<AccessibilityTestRun | null>(null);
  const [activeTab, setActiveTab] = useState<string>('run');
  const [wcagLevel, setWcagLevel] = useState<string>('AA');
  
  // Fetch past test runs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const runs = await AccessibilityTestingService.getTestRuns(wireframeId);
        setTestRuns(runs);
      } catch (error) {
        console.error('Error loading accessibility test runs:', error);
        toast.error('Failed to load accessibility test data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [wireframeId]);
  
  const handleRunTest = async () => {
    setIsLoading(true);
    try {
      const newRun = await AccessibilityTestingService.runAccessibilityTest(wireframeId, wcagLevel);
      
      // Add the new run to the list and set it as active
      setTestRuns(prev => [newRun, ...prev]);
      setActiveTestRun(newRun);
      setActiveTab('results');
      
      toast.success('Accessibility test completed successfully');
    } catch (error) {
      console.error('Error running accessibility test:', error);
      toast.error('Failed to run accessibility test');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewRun = (run: AccessibilityTestRun) => {
    setActiveTestRun(run);
    setActiveTab('results');
  };
  
  const getScoreColor = (score?: number) => {
    if (!score && score !== 0) return 'bg-gray-200';
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Accessibility Compliance Testing</CardTitle>
        <CardDescription>
          Test your wireframe for WCAG compliance, screen reader compatibility, and keyboard navigation.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="run">Run Test</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="run">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">WCAG Compliance Level</h3>
                <Select 
                  value={wcagLevel} 
                  onValueChange={setWcagLevel}
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
                <p className="text-sm text-muted-foreground mt-1">
                  {wcagLevel === 'A' && 'Basic level of accessibility support addressing major barriers.'}
                  {wcagLevel === 'AA' && 'Standard level required by most regulations and policies.'}
                  {wcagLevel === 'AAA' && 'Highest level providing enhanced accessibility for all users.'}
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleRunTest}
                  disabled={isLoading}
                >
                  {isLoading ? 'Running Test...' : 'Run Accessibility Test'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Previous Test Runs</h3>
              {testRuns.length === 0 ? (
                <p className="text-muted-foreground">No previous accessibility test runs found.</p>
              ) : (
                <div className="space-y-2">
                  {testRuns.map((run) => (
                    <div 
                      key={run.id} 
                      className="p-4 border rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => handleViewRun(run)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            WCAG {run.wcagLevel} Test
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {run.startedAt && new Date(run.startedAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className={`text-sm px-2 py-0.5 rounded-full ${
                          run.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          run.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {run.status}
                        </div>
                        
                        {typeof run.overallScore === 'number' && (
                          <div className="text-sm">
                            Score: {run.overallScore}/100
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {activeTestRun ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    WCAG {activeTestRun.wcagLevel} Compliance Test
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {activeTestRun.startedAt && new Date(activeTestRun.startedAt).toLocaleString()}
                  </div>
                </div>
                
                {typeof activeTestRun.overallScore === 'number' && (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-sm font-medium">{activeTestRun.overallScore}/100</span>
                    </div>
                    <Progress 
                      value={activeTestRun.overallScore} 
                      max={100}
                      className={getScoreColor(activeTestRun.overallScore)} 
                    />
                    
                    <div className="mt-1 text-sm text-muted-foreground">
                      {activeTestRun.overallScore >= 90 ? (
                        'Excellent! Your wireframe meets most accessibility requirements.'
                      ) : activeTestRun.overallScore >= 70 ? (
                        'Good. Some accessibility improvements are recommended.'
                      ) : (
                        'Attention needed. Significant accessibility issues were found.'
                      )}
                    </div>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <h4 className="font-medium">Accessibility Issues</h4>
                <AccessibilityIssuesList testRunId={activeTestRun.id} />
              </div>
            ) : (
              <AlertMessage
                type="info"
                title="No test results selected"
              >
                Run a new accessibility test or select a previous test run to view results.
              </AlertMessage>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AccessibilityTestingPanel;
