
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ContentAdherenceService, ContentStrategy, ContentAdherenceCheck } from '@/services/testing/ContentAdherenceService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Info, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ContentStrategyDetails from './ContentStrategyDetails';
import AdherenceCheckResults from './AdherenceCheckResults';

interface ContentAdherencePanelProps {
  wireframeId: string;
}

const ContentAdherencePanel: React.FC<ContentAdherencePanelProps> = ({ wireframeId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<ContentStrategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<ContentStrategy | null>(null);
  const [adherenceChecks, setAdherenceChecks] = useState<ContentAdherenceCheck[]>([]);
  const [isRunningCheck, setIsRunningCheck] = useState<boolean>(false);

  useEffect(() => {
    loadContentData();
  }, [wireframeId]);

  const loadContentData = async () => {
    setIsLoading(true);
    try {
      // Mock project ID (in real app would be from context/props)
      const projectId = "example-project";
      
      // Load content strategies for the project
      const strategiesData = await ContentAdherenceService.getContentStrategies(projectId);
      setStrategies(strategiesData);
      
      if (strategiesData.length > 0) {
        setSelectedStrategy(strategiesData[0]);
      }
      
      // Load previous adherence checks
      const checksData = await ContentAdherenceService.getAdherenceChecks(wireframeId);
      setAdherenceChecks(checksData);
    } catch (error) {
      console.error('Error loading content strategy data:', error);
      toast.error('Failed to load content strategy data');
    } finally {
      setIsLoading(false);
    }
  };

  const runAdherenceCheck = async () => {
    if (!selectedStrategy) return;
    
    setIsRunningCheck(true);
    try {
      const result = await ContentAdherenceService.verifyContentAdherence(wireframeId, selectedStrategy.id);
      
      // Update the list with the new check
      setAdherenceChecks([result, ...adherenceChecks.filter(check => check.strategyId !== selectedStrategy.id)]);
      
      toast.success('Content strategy adherence check completed');
    } catch (error) {
      console.error('Error running adherence check:', error);
      toast.error('Failed to run adherence check');
    } finally {
      setIsRunningCheck(false);
    }
  };

  const handleStrategyChange = (strategyId: string) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      setSelectedStrategy(strategy);
    }
  };

  // Find the latest check for the current strategy
  const currentStrategyCheck = selectedStrategy 
    ? adherenceChecks.find(check => check.strategyId === selectedStrategy.id)
    : null;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Strategy Adherence</h2>
        
        <div className="flex items-center gap-2">
          {strategies.length > 0 && (
            <Select 
              defaultValue={selectedStrategy?.id} 
              onValueChange={handleStrategyChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy.id} value={strategy.id}>
                    {strategy.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button 
            onClick={runAdherenceCheck}
            disabled={isRunningCheck || !selectedStrategy}
            className="flex items-center gap-2"
          >
            {isRunningCheck ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>Verify Adherence</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading content strategy data...</p>
        </div>
      ) : strategies.length === 0 ? (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>No content strategies</AlertTitle>
          <AlertDescription>
            No content strategies have been defined for this project. Create a content strategy first.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedStrategy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Strategy: {selectedStrategy.title}</span>
                  </CardTitle>
                  <CardDescription>{selectedStrategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentStrategyDetails strategy={selectedStrategy} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  <span>Adherence Results</span>
                </CardTitle>
                <CardDescription>
                  {currentStrategyCheck 
                    ? `Check completed on ${new Date(currentStrategyCheck.completedAt || '').toLocaleString()}`
                    : 'No adherence check has been run yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStrategyCheck ? (
                  <AdherenceCheckResults check={currentStrategyCheck} />
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Run an adherence check to see results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentAdherencePanel;
