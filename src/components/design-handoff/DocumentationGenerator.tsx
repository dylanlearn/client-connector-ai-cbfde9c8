
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DocumentationGeneratorProps {
  wireframeId: string;
  specificationId?: string;
}

export const DocumentationGenerator: React.FC<DocumentationGeneratorProps> = ({ 
  wireframeId, 
  specificationId 
}) => {
  const { toast } = useToast();

  const { data: documentation } = useQuery({
    queryKey: ['technicalDocumentation', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_documentation')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="requirements">
          <TabsList>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="criteria">Acceptance Criteria</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Technical Requirements</h3>
              {documentation?.technical_requirements && (
                <pre className="p-4 bg-slate-50 rounded-md">
                  {JSON.stringify(documentation.technical_requirements, null, 2)}
                </pre>
              )}
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Implementation Notes</h3>
              {documentation?.implementation_notes && (
                <div className="prose max-w-none">
                  {documentation.implementation_notes}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="criteria" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Acceptance Criteria</h3>
              {documentation?.acceptance_criteria && (
                <pre className="p-4 bg-slate-50 rounded-md">
                  {JSON.stringify(documentation.acceptance_criteria, null, 2)}
                </pre>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
