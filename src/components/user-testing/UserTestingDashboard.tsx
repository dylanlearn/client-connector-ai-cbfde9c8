
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TestScenariosList } from './TestScenariosList';
import { SimulationEngine } from './SimulationEngine';
import { TestResultsDashboard } from './TestResultsDashboard';

interface UserTestingDashboardProps {
  wireframeId?: string;
}

export function UserTestingDashboard({ wireframeId }: UserTestingDashboardProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Testing Simulation</h1>
      <p className="text-muted-foreground">
        Create testing scenarios, simulate user interactions, and generate insights for your wireframes.
      </p>
      
      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scenarios" className="space-y-4">
          <TestScenariosList />
        </TabsContent>
        
        <TabsContent value="simulation" className="space-y-4">
          <SimulationEngine scenarioId={selectedScenario} />
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          <TestResultsDashboard wireframeId={wireframeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
