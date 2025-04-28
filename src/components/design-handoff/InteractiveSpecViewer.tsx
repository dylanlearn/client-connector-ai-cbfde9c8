
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InteractiveSpecViewerProps {
  wireframeId: string;
  specificationId?: string;
}

export const InteractiveSpecViewer: React.FC<InteractiveSpecViewerProps> = ({ 
  wireframeId, 
  specificationId 
}) => {
  const { toast } = useToast();
  const [isInteractive, setIsInteractive] = useState(false);

  const { data: specifications } = useQuery({
    queryKey: ['specifications', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_specifications')
        .select('*')
        .eq('wireframe_id', wireframeId);

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Interactive Specification Viewer
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsInteractive(!isInteractive)}
            className="flex items-center gap-2"
          >
            <ToggleLeft className={isInteractive ? 'rotate-180' : ''} />
            {isInteractive ? 'Disable' : 'Enable'} Interactive Mode
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="properties">
          <TabsList>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="p-4">
            {specifications?.map((spec) => (
              <div key={spec.id} className="space-y-4">
                <h3 className="text-lg font-semibold">{spec.name}</h3>
                <pre className="p-4 bg-slate-50 rounded-md">
                  {JSON.stringify(spec.properties, null, 2)}
                </pre>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="states" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Component States</h3>
              {specifications?.map((spec) => (
                <div key={`${spec.id}-states`} className="space-y-2">
                  <h4 className="font-medium">{spec.name}</h4>
                  <pre className="p-4 bg-slate-50 rounded-md">
                    {JSON.stringify(spec.states, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="variations" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Component Variations</h3>
              {specifications?.map((spec) => (
                <div key={`${spec.id}-variations`} className="space-y-2">
                  <h4 className="font-medium">{spec.name}</h4>
                  <pre className="p-4 bg-slate-50 rounded-md">
                    {JSON.stringify(spec.variations, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
