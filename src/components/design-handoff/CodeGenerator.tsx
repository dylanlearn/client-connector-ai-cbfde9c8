
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CodeGeneratorProps {
  wireframeId: string;
  specificationId?: string;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ 
  wireframeId, 
  specificationId 
}) => {
  const { toast } = useToast();

  const { data: templates } = useQuery({
    queryKey: ['codeTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('code_generation_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    }
  });

  const handleGenerateCode = async (templateId: string) => {
    try {
      const { data, error } = await supabase.rpc('generate_code', {
        p_wireframe_id: wireframeId,
        p_creator_id: (await supabase.auth.getUser()).data.user?.id,
        p_framework: 'React', // This would come from template selection
        p_language: 'TypeScript',
        p_specification_id: specificationId,
        p_template_id: templateId
      });

      if (error) throw error;

      toast({
        title: "Code generated successfully",
        description: "Your code has been generated and is ready for review."
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Error generating code",
        description: "There was a problem generating the code. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleGenerateCode('template-id')}>
                Generate Code
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
