
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectGoalsList } from './ProjectGoalsList';
import { KPIList } from './KPIList';
import { WireframeGoalConnections } from './WireframeGoalConnections';

interface ProjectGoalsKPIDashboardProps {
  projectId?: string;
  wireframeId?: string;
}

export function ProjectGoalsKPIDashboard({ projectId, wireframeId }: ProjectGoalsKPIDashboardProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Project Goals & KPIs</h1>
      <p className="text-muted-foreground">
        Define project goals, track key performance indicators, and connect them to wireframe elements.
      </p>
      
      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Project Goals</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="connections">Element Connections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="space-y-4">
          <ProjectGoalsList 
            projectId={projectId} 
            onSelectGoal={setSelectedGoalId} 
          />
        </TabsContent>
        
        <TabsContent value="kpis" className="space-y-4">
          <KPIList 
            projectId={projectId} 
            goalId={selectedGoalId} 
          />
        </TabsContent>
        
        <TabsContent value="connections" className="space-y-4">
          <WireframeGoalConnections wireframeId={wireframeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
