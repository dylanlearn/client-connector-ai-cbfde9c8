import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DesignSpecificationEditor } from '@/components/design-handoff/DesignSpecificationEditor';
import { CodeGenerator } from '@/components/design-handoff/CodeGenerator';
import { DocumentationGenerator } from '@/components/design-handoff/DocumentationGenerator';
import { TechnicalFeasibilityAnalyzer } from '@/components/design-handoff/TechnicalFeasibilityAnalyzer';
import { ComponentLibraryMapper } from '@/components/design-handoff/ComponentLibraryMapper';
import { InteractiveSpecViewer } from '@/components/design-handoff/InteractiveSpecViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIModelingSystem } from '@/components/api-integration/APIModelingSystem';
import { AccessibilityImplementation } from '@/components/accessibility/AccessibilityImplementation';
import { PerformanceBudgetManager } from '@/components/design-handoff/PerformanceBudgetManager';
import { RiskAssessmentManager } from '@/components/design-handoff/RiskAssessmentManager';

const DesignHandoffPage = () => {
  const { wireframeId } = useParams();
  const [selectedSpecificationId, setSelectedSpecificationId] = useState<string | undefined>(undefined);

  if (!wireframeId) {
    return <div>No wireframe ID provided</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-8">Design Handoff</h1>
        
        <Tabs defaultValue="specifications">
          <TabsList className="grid w-full grid-cols-10 mb-8">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="code">Code Generation</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="feasibility">Feasibility Analysis</TabsTrigger>
            <TabsTrigger value="component-mapping">Component Mapping</TabsTrigger>
            <TabsTrigger value="interactive-specs">Interactive Specs</TabsTrigger>
            <TabsTrigger value="api-modeling">API Modeling</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications">
            <DesignSpecificationEditor 
              wireframeId={wireframeId} 
              onSpecificationSelected={setSelectedSpecificationId}
            />
          </TabsContent>
          
          <TabsContent value="code">
            <CodeGenerator 
              wireframeId={wireframeId} 
              specificationId={selectedSpecificationId}
            />
          </TabsContent>
          
          <TabsContent value="documentation">
            <DocumentationGenerator 
              wireframeId={wireframeId} 
              specificationId={selectedSpecificationId}
            />
          </TabsContent>
          
          <TabsContent value="feasibility">
            <TechnicalFeasibilityAnalyzer 
              wireframeId={wireframeId} 
              specificationId={selectedSpecificationId}
            />
          </TabsContent>
          
          <TabsContent value="component-mapping">
            <ComponentLibraryMapper 
              wireframeId={wireframeId} 
              specificationId={selectedSpecificationId}
            />
          </TabsContent>
          
          <TabsContent value="interactive-specs">
            <InteractiveSpecViewer 
              wireframeId={wireframeId} 
              specificationId={selectedSpecificationId}
            />
          </TabsContent>
          
          <TabsContent value="api-modeling">
            <APIModelingSystem wireframeId={wireframeId} />
          </TabsContent>
          
          <TabsContent value="accessibility">
            <AccessibilityImplementation 
              wireframeId={wireframeId}
              elementId={selectedSpecificationId}
            />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceBudgetManager wireframeId={wireframeId} />
          </TabsContent>
          
          <TabsContent value="risks">
            <RiskAssessmentManager wireframeId={wireframeId} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DesignHandoffPage;
