
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Globe, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TechnicalFeasibilityAnalyzerProps {
  wireframeId: string;
  specificationId?: string;
}

export const TechnicalFeasibilityAnalyzer: React.FC<TechnicalFeasibilityAnalyzerProps> = ({
  wireframeId,
  specificationId
}) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: analysis, refetch } = useQuery({
    queryKey: ['feasibilityAnalysis', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_feasibility_analysis')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Call the analyze_technical_feasibility function
      const { data, error } = await supabase.rpc('analyze_technical_feasibility', {
        p_wireframe_id: wireframeId
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Technical feasibility analysis has been updated"
      });

      refetch();
    } catch (error) {
      console.error('Error analyzing technical feasibility:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to perform technical feasibility analysis",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Technical Feasibility Analysis</CardTitle>
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compatibility">
          <TabsList>
            <TabsTrigger value="compatibility">
              <Globe className="mr-2 h-4 w-4" />
              Browser Compatibility
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Zap className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="challenges">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Implementation Challenges
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="compatibility" className="p-4">
            {analysis?.browser_compatibility ? (
              <pre className="p-4 bg-slate-50 rounded-md overflow-auto max-h-80">
                {JSON.stringify(analysis.browser_compatibility, null, 2)}
              </pre>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                No compatibility data available. Run analysis to generate results.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="performance" className="p-4">
            {analysis?.performance_metrics ? (
              <pre className="p-4 bg-slate-50 rounded-md overflow-auto max-h-80">
                {JSON.stringify(analysis.performance_metrics, null, 2)}
              </pre>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                No performance metrics available. Run analysis to generate results.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="challenges" className="p-4">
            {analysis?.implementation_challenges ? (
              <pre className="p-4 bg-slate-50 rounded-md overflow-auto max-h-80">
                {JSON.stringify(analysis.implementation_challenges, null, 2)}
              </pre>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                No implementation challenges identified. Run analysis to generate results.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
