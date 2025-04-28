
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceBudgetManager } from "@/components/performance/PerformanceBudgetManager";
import { RiskAssessmentManager } from "@/components/risk/RiskAssessmentManager";
import { CodeGenerator } from "@/components/design-handoff/CodeGenerator";
import { DocumentationGenerator } from "@/components/design-handoff/DocumentationGenerator";
import { InteractiveSpecViewer } from "@/components/design-handoff/InteractiveSpecViewer";
import { TechnicalFeasibilityAnalyzer } from "@/components/design-handoff/TechnicalFeasibilityAnalyzer";
import { supabase } from '@/integrations/supabase/client';

const DesignHandoffPage: React.FC = () => {
  const { wireframeId } = useParams<{ wireframeId: string }>();
  const [wireframe, setWireframe] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('specs');
  const [isLoading, setIsLoading] = useState(true);
  const [projectId, setProjectId] = useState<string>('');
  
  useEffect(() => {
    if (wireframeId) {
      loadWireframeData();
    }
  }, [wireframeId]);
  
  const loadWireframeData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wireframes')
        .select('*, projects:project_id(*)')
        .eq('id', wireframeId)
        .single();
      
      if (error) throw error;
      
      setWireframe(data);
      // Assume the wireframe has a project_id field or it's nested under projects
      if (data.project_id) {
        setProjectId(data.project_id);
      } else if (data.projects?.id) {
        setProjectId(data.projects.id);
      }
    } catch (error) {
      console.error('Error loading wireframe:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading || !wireframeId) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {wireframe?.title || 'Design Handoff'}
      </h1>
      
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="risk">Risk</TabsTrigger>
              <TabsTrigger value="feasibility">Feasibility</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="specs">
                <InteractiveSpecViewer wireframeId={wireframeId} />
              </TabsContent>
              
              <TabsContent value="code">
                <CodeGenerator wireframeId={wireframeId} />
              </TabsContent>
              
              <TabsContent value="docs">
                <DocumentationGenerator wireframeId={wireframeId} />
              </TabsContent>
              
              <TabsContent value="performance">
                <PerformanceBudgetManager 
                  wireframeId={wireframeId} 
                  projectId={projectId} 
                />
              </TabsContent>
              
              <TabsContent value="risk">
                <RiskAssessmentManager 
                  wireframeId={wireframeId} 
                  projectId={projectId} 
                />
              </TabsContent>
              
              <TabsContent value="feasibility">
                <TechnicalFeasibilityAnalyzer wireframeId={wireframeId} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignHandoffPage;
