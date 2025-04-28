
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompetitorList } from './CompetitorList';
import { CompetitiveElementsList } from './CompetitiveElementsList';
import { CompetitorComparison } from './CompetitorComparison';

interface CompetitiveAnalysisViewProps {
  wireframeId?: string;
}

export function CompetitiveAnalysisView({ wireframeId }: CompetitiveAnalysisViewProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Competitive Analysis</h1>
      <p className="text-muted-foreground">
        Compare your design with competitors to identify strengths, weaknesses, and opportunities.
      </p>
      
      <Tabs defaultValue="competitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="elements">Competitive Elements</TabsTrigger>
          <TabsTrigger value="comparison">Wireframe Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="competitors" className="space-y-4">
          <CompetitorList />
        </TabsContent>
        
        <TabsContent value="elements" className="space-y-4">
          <CompetitiveElementsList />
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <CompetitorComparison wireframeId={wireframeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
