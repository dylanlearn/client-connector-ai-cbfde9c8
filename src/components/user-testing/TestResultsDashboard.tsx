
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSimulationResults } from '@/hooks/use-simulation-results';
import { Loader2 } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';

interface TestResultsDashboardProps {
  wireframeId?: string;
}

export function TestResultsDashboard({ wireframeId }: TestResultsDashboardProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | undefined>(undefined);
  const { results, isLoading, error, scenarios } = useSimulationResults(wireframeId, selectedScenario);

  if (error) {
    return <AlertMessage type="error" title="Error loading results">{error.message}</AlertMessage>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Test Results</h2>
        <div className="w-[200px]">
          <Select value={selectedScenario} onValueChange={setSelectedScenario}>
            <SelectTrigger>
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              {scenarios?.map((scenario) => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  {scenario.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !selectedScenario ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Select a test scenario to view results.</p>
          </CardContent>
        </Card>
      ) : !results ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No simulation results available for this scenario.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard 
              title="Completion Rate" 
              value={`${results.completion_rate}%`} 
              description="Users who completed all tasks"
            />
            <MetricCard 
              title="Average Time"
              value={`${Math.round(results.average_completion_time / 60)}m ${Math.round(results.average_completion_time % 60)}s`}
              description="Average task completion time"
            />
            <MetricCard 
              title="Error Points"
              value={results.error_points?.length || "0"}
              description="Areas where users encountered issues"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Insights</CardTitle>
                <CardDescription>Key patterns identified during testing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {results.behavioral_insights?.map((insight: string, index: number) => (
                    <li key={index}>{insight}</li>
                  )) || <li>No insights available</li>}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Error Hotspots</CardTitle>
                <CardDescription>Elements where users experienced difficulties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.error_points?.map((point: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center border-b py-2 last:border-0"
                    >
                      <span>{point.element_id}</span>
                      <span className="text-destructive font-medium">
                        {typeof point.frequency === 'number' 
                          ? `${Math.round(point.frequency)}%`
                          : point.frequency}
                      </span>
                    </div>
                  )) || <p className="text-muted-foreground">No error hotspots detected</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
}

function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{value}</div>
          <p className="font-medium text-sm mt-1">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
