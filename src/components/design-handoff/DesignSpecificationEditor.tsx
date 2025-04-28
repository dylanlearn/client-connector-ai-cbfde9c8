
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, FileCode, AlignLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface DesignSpecificationEditorProps {
  wireframeId: string;
}

export const DesignSpecificationEditor: React.FC<DesignSpecificationEditorProps> = ({ wireframeId }) => {
  const { toast } = useToast();

  const { data: specifications } = useQuery({
    queryKey: ['designSpecifications', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_specifications')
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
        <CardTitle>Design Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="measurements">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="measurements">
              <Ruler className="w-4 h-4 mr-2" />
              Measurements
            </TabsTrigger>
            <TabsTrigger value="assets">
              <FileCode className="w-4 h-4 mr-2" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="annotations">
              <AlignLeft className="w-4 h-4 mr-2" />
              Annotations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="measurements" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Component Measurements</h3>
              {/* Component measurements UI will go here */}
            </div>
          </TabsContent>

          <TabsContent value="assets" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Design Assets</h3>
              {/* Assets management UI will go here */}
            </div>
          </TabsContent>

          <TabsContent value="annotations" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Developer Annotations</h3>
              {/* Annotations UI will go here */}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
