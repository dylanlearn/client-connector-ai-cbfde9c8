
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, FileCode, AlignLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DesignSpecificationEditorProps {
  wireframeId: string;
  onSpecificationSelected?: (specId: string | undefined) => void;
}

export const DesignSpecificationEditor: React.FC<DesignSpecificationEditorProps> = ({ 
  wireframeId,
  onSpecificationSelected
}) => {
  const { toast } = useToast();
  const [selectedSpecId, setSelectedSpecId] = useState<string | undefined>(undefined);

  const { data: specifications, isLoading } = useQuery({
    queryKey: ['designSpecifications', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_specifications')
        .select('*')
        .eq('wireframe_id', wireframeId);

      if (error) throw error;
      return data || [];
    }
  });

  const { data: selectedSpecification } = useQuery({
    queryKey: ['designSpecification', selectedSpecId],
    enabled: !!selectedSpecId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_specifications')
        .select('*')
        .eq('id', selectedSpecId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const handleSpecificationSelect = (specId: string) => {
    setSelectedSpecId(specId);
    if (onSpecificationSelected) {
      onSpecificationSelected(specId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        {specifications && specifications.length > 0 && (
          <div className="mb-6">
            <Select 
              value={selectedSpecId} 
              onValueChange={handleSpecificationSelect}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select specification" />
              </SelectTrigger>
              <SelectContent>
                {specifications.map((spec) => (
                  <SelectItem key={spec.id} value={spec.id}>
                    {spec.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
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
              {selectedSpecification?.measurements && (
                <pre className="p-4 bg-slate-50 rounded-md overflow-auto max-h-80">
                  {JSON.stringify(selectedSpecification.measurements, null, 2)}
                </pre>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assets" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Design Assets</h3>
              {selectedSpecification?.assets && (
                <pre className="p-4 bg-slate-50 rounded-md overflow-auto max-h-80">
                  {JSON.stringify(selectedSpecification.assets, null, 2)}
                </pre>
              )}
            </div>
          </TabsContent>

          <TabsContent value="annotations" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Developer Annotations</h3>
              {selectedSpecification?.annotations && (
                <pre className="p-4 bg-slate-50 rounded-md overflow-auto max-h-80">
                  {JSON.stringify(selectedSpecification.annotations, null, 2)}
                </pre>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
