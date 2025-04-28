
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Loader2, Play, Pause, SkipForward } from 'lucide-react';
import { useSimulateTest } from '@/hooks/use-simulate-test';
import { Progress } from '@/components/ui/progress';

interface SimulationEngineProps {
  scenarioId?: string;
}

export function SimulationEngine({ scenarioId }: SimulationEngineProps) {
  const [iterations, setIterations] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const {
    simulate,
    isLoading,
    currentStep,
    totalSteps,
    simulationResults,
    progress
  } = useSimulateTest(scenarioId);

  const handleStartSimulation = () => {
    setIsPlaying(true);
    simulate(iterations);
  };

  const handlePauseSimulation = () => {
    setIsPlaying(false);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };
  
  if (!scenarioId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Select a test scenario to start simulation.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test Simulation</CardTitle>
        <CardDescription>
          Simulate user interactions with task flows and observe behavioral patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isLoading && !simulationResults ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Number of Iterations</label>
                <div className="flex space-x-4 items-center">
                  <Input 
                    type="number" 
                    min="10" 
                    max="1000" 
                    value={iterations} 
                    onChange={(e) => setIterations(Number(e.target.value))}
                    className="w-24" 
                  />
                  <Slider 
                    defaultValue={[100]}
                    min={10}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setIterations(value[0])}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Higher numbers provide more accurate results but take longer to simulate.
                </p>
              </div>
              
              <Button 
                onClick={handleStartSimulation} 
                className="w-full flex items-center gap-2"
                disabled={isLoading}
              >
                <Play className="h-4 w-4" />
                Start Simulation
              </Button>
            </div>
          </>
        ) : isLoading ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Running Simulation</p>
                <p className="text-xs text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
              <div className="space-x-2">
                {isPlaying ? (
                  <Button variant="outline" size="sm" onClick={handlePauseSimulation}>
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsPlaying(true)}>
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Simulation Speed</label>
              <div className="flex space-x-4 items-center">
                <span className="text-sm">1x</span>
                <Slider 
                  defaultValue={[1]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={handleSpeedChange}
                  className="flex-1"
                />
                <span className="text-sm">5x</span>
              </div>
            </div>
          </div>
        ) : (
          <SimulationResults results={simulationResults} />
        )}
      </CardContent>
    </Card>
  );
}

interface SimulationResultsProps {
  results: any;
}

function SimulationResults({ results }: SimulationResultsProps) {
  if (!results) return null;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{results.completion_rate}%</div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {Math.round(results.average_completion_time / 60)}m {Math.round(results.average_completion_time % 60)}s
              </div>
              <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{results.error_points?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Error Points</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Behavioral Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1">
            {results.behavioral_insights?.map((insight: string, index: number) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button>View Detailed Results</Button>
      </div>
    </div>
  );
}
