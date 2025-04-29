
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrowserTestingPanel from '@/components/testing/browser-testing/BrowserTestingPanel';
import AccessibilityTestingPanel from '@/components/testing/accessibility-testing/AccessibilityTestingPanel';
import DesignConsistencyPanel from '@/components/testing/design-consistency/DesignConsistencyPanel';
import UserFlowTestingPanel from '@/components/testing/user-flow/UserFlowTestingPanel';
import TechnicalFeasibilityPanel from '@/components/testing/feasibility/TechnicalFeasibilityPanel';
import ContentAdherencePanel from '@/components/testing/content-adherence/ContentAdherencePanel';
import SecurityPrivacyPanel from '@/components/testing/security-privacy/SecurityPrivacyPanel';
import { supabase } from '@/integrations/supabase/client';

const WireframeTestingPage: React.FC = () => {
  const { wireframeId } = useParams<{ wireframeId: string }>();
  const [wireframe, setWireframe] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('browser');
  
  useEffect(() => {
    if (!wireframeId) return;

    const fetchWireframe = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_wireframes')
          .select('*, projects:project_id(*)')
          .eq('id', wireframeId)
          .single();
          
        if (error) throw error;
        setWireframe(data);
      } catch (err) {
        console.error('Error fetching wireframe:', err);
      }
    };

    fetchWireframe();
  }, [wireframeId]);

  if (!wireframeId) {
    return <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Wireframe Testing</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <p className="text-red-700">No wireframe ID provided.</p>
        </div>
      </div>
    </Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Testing Tools</h1>
        <p className="mb-6 text-muted-foreground">
          {wireframe ? `Testing wireframe: ${wireframe.title || wireframe.id}` : 'Loading wireframe...'}
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-7">
            <TabsTrigger value="browser">Cross-Browser</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="consistency">Consistency</TabsTrigger>
            <TabsTrigger value="userflow">User Flow</TabsTrigger>
            <TabsTrigger value="feasibility">Feasibility</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="browser" className="mt-0">
            <BrowserTestingPanel wireframeId={wireframeId} />
          </TabsContent>
          <TabsContent value="accessibility" className="mt-0">
            <AccessibilityTestingPanel wireframeId={wireframeId} />
          </TabsContent>
          <TabsContent value="consistency" className="mt-0">
            <DesignConsistencyPanel 
              projectId={wireframe?.project_id || wireframe?.projects?.id || ''}
              wireframeIds={[wireframeId]}
            />
          </TabsContent>
          <TabsContent value="userflow" className="mt-0">
            <UserFlowTestingPanel wireframeId={wireframeId} />
          </TabsContent>
          <TabsContent value="feasibility" className="mt-0">
            <TechnicalFeasibilityPanel wireframeId={wireframeId} />
          </TabsContent>
          <TabsContent value="content" className="mt-0">
            <ContentAdherencePanel wireframeId={wireframeId} />
          </TabsContent>
          <TabsContent value="security" className="mt-0">
            <SecurityPrivacyPanel wireframeId={wireframeId} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WireframeTestingPage;
