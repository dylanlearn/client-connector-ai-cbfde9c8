
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesignConsistencyService, DesignConsistencyCheck } from '@/services/testing/DesignConsistencyService';
import DesignConsistencyIssuesList from './DesignConsistencyIssuesList';
import DesignConsistencyRulesList from './DesignConsistencyRulesList';
import { toast } from 'sonner';

interface DesignConsistencyPanelProps {
  projectId: string;
  wireframeIds: string[];
}

type CheckType = 'full' | 'color-only' | 'typography' | 'spacing';

const DesignConsistencyPanel: React.FC<DesignConsistencyPanelProps> = ({ projectId, wireframeIds }) => {
  const [checkType, setCheckType] = useState<CheckType>('full');
  const [checks, setChecks] = useState<DesignConsistencyCheck[]>([]);
  const [isLoadingChecks, setIsLoadingChecks] = useState(true);
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('issues');

  useEffect(() => {
    if (projectId) {
      loadChecks();
    }
  }, [projectId]);

  const loadChecks = async () => {
    setIsLoadingChecks(true);
    try {
      const checksData = await DesignConsistencyService.getChecks(projectId);
      setChecks(checksData);
    } catch (error) {
      console.error('Error loading consistency checks:', error);
      toast.error('Failed to load consistency checks');
    } finally {
      setIsLoadingChecks(false);
    }
  };

  const runConsistencyCheck = async () => {
    if (!projectId || wireframeIds.length === 0) {
      toast.error('Invalid project or wireframe selection');
      return;
    }

    setIsRunningCheck(true);
    try {
      await DesignConsistencyService.runConsistencyCheck(projectId, wireframeIds, checkType);
      toast.success('Design consistency check started');
      // In a real app, this might start a background job
      // For demo, we'll simulate a completed check after a delay
      setTimeout(() => {
        loadChecks();
      }, 2000);
    } catch (error) {
      console.error('Error starting consistency check:', error);
      toast.error('Failed to start consistency check');
    } finally {
      setIsRunningCheck(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Run Design Consistency Check</CardTitle>
          <CardDescription>
            Verify design consistency across wireframes and components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Check Type</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={checkType === 'full' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCheckType('full')}
                  disabled={isRunningCheck}
                >
                  Full Check
                </Button>
                <Button 
                  variant={checkType === 'color-only' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCheckType('color-only')}
                  disabled={isRunningCheck}
                >
                  Colors Only
                </Button>
                <Button 
                  variant={checkType === 'typography' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCheckType('typography')}
                  disabled={isRunningCheck}
                >
                  Typography
                </Button>
                <Button 
                  variant={checkType === 'spacing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCheckType('spacing')}
                  disabled={isRunningCheck}
                >
                  Spacing
                </Button>
              </div>
            </div>
            <Button 
              onClick={runConsistencyCheck}
              disabled={isRunningCheck || wireframeIds.length === 0}
              className="mt-2 md:mt-0"
            >
              {isRunningCheck ? 'Running Check...' : 'Run Consistency Check'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="issues">Consistency Issues</TabsTrigger>
          <TabsTrigger value="rules">Consistency Rules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Consistency Check Results</CardTitle>
              <CardDescription>
                Design consistency issues detected across wireframes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingChecks ? (
                <div className="py-4">Loading consistency checks...</div>
              ) : checks.length === 0 ? (
                <Alert>
                  <AlertTitle>No consistency checks found</AlertTitle>
                  <AlertDescription>
                    Run your first design consistency check to see results
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {checks.map((check) => (
                    <div 
                      key={check.id} 
                      className="border rounded-lg overflow-hidden"
                    >
                      <div 
                        className="p-4 border-b cursor-pointer flex items-center justify-between"
                        onClick={() => setSelectedCheckId(selectedCheckId === check.id ? null : check.id)}
                      >
                        <div>
                          <h4 className="font-medium">
                            {check.checkType === 'full' ? 'Full Consistency Check' : 
                             check.checkType === 'color-only' ? 'Color Consistency Check' :
                             check.checkType === 'typography' ? 'Typography Consistency Check' :
                             'Spacing Consistency Check'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(check.startedAt).toLocaleString()} • {check.wireframeIds.length} wireframes
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {check.resultsSummary && (
                            <div className="flex gap-2 text-sm">
                              <span className="text-red-600">
                                {check.resultsSummary.critical + check.resultsSummary.high} critical/high
                              </span>
                              <span className="text-amber-600">
                                {check.resultsSummary.medium} medium
                              </span>
                            </div>
                          )}
                          <span className="text-xs">
                            {check.status}
                          </span>
                        </div>
                      </div>
                      {selectedCheckId === check.id && (
                        <div className="p-4 bg-slate-50">
                          {check.resultsSummary && (
                            <div className="mb-4 grid grid-cols-5 gap-2 text-center">
                              <div className="bg-red-100 p-2 rounded">
                                <div className="font-bold">{check.resultsSummary.critical}</div>
                                <div className="text-xs">Critical</div>
                              </div>
                              <div className="bg-orange-100 p-2 rounded">
                                <div className="font-bold">{check.resultsSummary.high}</div>
                                <div className="text-xs">High</div>
                              </div>
                              <div className="bg-amber-100 p-2 rounded">
                                <div className="font-bold">{check.resultsSummary.medium}</div>
                                <div className="text-xs">Medium</div>
                              </div>
                              <div className="bg-blue-100 p-2 rounded">
                                <div className="font-bold">{check.resultsSummary.low}</div>
                                <div className="text-xs">Low</div>
                              </div>
                              <div className="bg-gray-100 p-2 rounded">
                                <div className="font-bold">{check.resultsSummary.info}</div>
                                <div className="text-xs">Info</div>
                              </div>
                            </div>
                          )}
                          <DesignConsistencyIssuesList checkId={check.id} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-0">
          <DesignConsistencyRulesList projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignConsistencyPanel;
