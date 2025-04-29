
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TechnicalFeasibilityService, TechnicalConstraint, FeasibilityCheck } from '@/services/testing/TechnicalFeasibilityService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Check, Crown, Hammer, Laptop2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import TechnicalConstraintsList from './TechnicalConstraintsList';
import FeasibilityResultDetails from './FeasibilityResultDetails';
import FeasibilityScoreCard from './FeasibilityScoreCard';

interface TechnicalFeasibilityPanelProps {
  wireframeId: string;
}

const TechnicalFeasibilityPanel: React.FC<TechnicalFeasibilityPanelProps> = ({ wireframeId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [constraints, setConstraints] = useState<TechnicalConstraint[]>([]);
  const [feasibilityChecks, setFeasibilityChecks] = useState<FeasibilityCheck[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('mobile');
  const [isRunningCheck, setIsRunningCheck] = useState<boolean>(false);

  useEffect(() => {
    loadFeasibilityData();
  }, [wireframeId]);

  const loadFeasibilityData = async () => {
    setIsLoading(true);
    try {
      // Load constraints for the selected platform
      const constraintsData = await TechnicalFeasibilityService.getConstraints(selectedPlatform);
      setConstraints(constraintsData);
      
      // Load previous feasibility checks
      const checksData = await TechnicalFeasibilityService.getFeasibilityChecks(wireframeId);
      setFeasibilityChecks(checksData);
    } catch (error) {
      console.error('Error loading feasibility data:', error);
      toast.error('Failed to load technical feasibility data');
    } finally {
      setIsLoading(false);
    }
  };

  const runFeasibilityCheck = async () => {
    setIsRunningCheck(true);
    try {
      const result = await TechnicalFeasibilityService.runFeasibilityCheck(wireframeId, selectedPlatform);
      
      // Update the list of checks with the new one
      setFeasibilityChecks([result, ...feasibilityChecks.filter(check => check.platform !== selectedPlatform)]);
      
      toast.success(`Technical feasibility check for ${selectedPlatform} platform completed`);
    } catch (error) {
      console.error('Error running feasibility check:', error);
      toast.error('Failed to run feasibility check');
    } finally {
      setIsRunningCheck(false);
    }
  };

  const handlePlatformChange = async (platform: string) => {
    setSelectedPlatform(platform);
    try {
      const constraintsData = await TechnicalFeasibilityService.getConstraints(platform);
      setConstraints(constraintsData);
    } catch (error) {
      console.error('Error loading constraints for platform:', error);
    }
  };

  // Find the latest check for the current platform
  const currentPlatformCheck = feasibilityChecks.find(check => check.platform === selectedPlatform);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Technical Feasibility Verification</h2>
        <Button 
          onClick={runFeasibilityCheck}
          disabled={isRunningCheck}
          className="flex items-center gap-2"
        >
          {isRunningCheck ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          ) : (
            <Hammer className="h-4 w-4" />
          )}
          <span>Run Verification</span>
        </Button>
      </div>

      <div className="flex space-x-4 mb-4">
        <Button 
          variant={selectedPlatform === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePlatformChange('mobile')}
          className="flex items-center gap-2"
        >
          <Smartphone className="h-4 w-4" />
          <span>Mobile</span>
        </Button>
        <Button 
          variant={selectedPlatform === 'web' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePlatformChange('web')}
          className="flex items-center gap-2"
        >
          <Laptop2 className="h-4 w-4" />
          <span>Web</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading technical feasibility data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <span>Platform Constraints</span>
                  </CardTitle>
                  <CardDescription>Technical limitations for {selectedPlatform} platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <TechnicalConstraintsList constraints={constraints} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {currentPlatformCheck ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>Verification Results</CardTitle>
                      <FeasibilityScoreCard score={currentPlatformCheck.overallScore || 0} />
                    </div>
                    <CardDescription>
                      Test completed on {new Date(currentPlatformCheck.completedAt || '').toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="issues">
                      <TabsList className="mb-4">
                        <TabsTrigger value="issues" className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>Issues</span> 
                        </TabsTrigger>
                        <TabsTrigger value="recommendations" className="flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          <span>Recommendations</span>
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="issues">
                        <FeasibilityResultDetails check={currentPlatformCheck} />
                      </TabsContent>
                      <TabsContent value="recommendations">
                        {currentPlatformCheck.recommendations && currentPlatformCheck.recommendations.length > 0 ? (
                          <div className="space-y-2">
                            {currentPlatformCheck.recommendations.map((recommendation, index) => (
                              <div key={index} className="p-3 border rounded-md bg-slate-50">
                                <div className="flex gap-2 items-start">
                                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>{recommendation}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            No recommendations available.
                          </p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <Hammer className="h-4 w-4" />
                  <AlertTitle>No verification results</AlertTitle>
                  <AlertDescription>
                    No technical feasibility verification has been conducted for the {selectedPlatform} platform yet.
                    Run a verification to check if your wireframe meets technical constraints.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TechnicalFeasibilityPanel;
