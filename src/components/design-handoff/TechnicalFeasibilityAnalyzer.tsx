
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Monitor, Gauge, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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

  const { data: feasibilityAnalysis, refetch } = useQuery({
    queryKey: ['feasibilityAnalysis', wireframeId, specificationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feasibility_analysis')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!wireframeId
  });

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.rpc('analyze_technical_feasibility', {
        p_wireframe_id: wireframeId,
        p_specification_id: specificationId || null,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      toast({
        title: "Analysis complete",
        description: "Technical feasibility analysis has been completed."
      });
      
      refetch();
    } catch (error) {
      console.error('Error running feasibility analysis:', error);
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing the wireframe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-amber-500 bg-amber-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Technical Feasibility Analysis
        </CardTitle>
        <CardDescription>
          Identify potential implementation challenges, browser compatibility issues, and performance concerns
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>

        {feasibilityAnalysis ? (
          <Tabs defaultValue="challenges">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="challenges">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Implementation Challenges
              </TabsTrigger>
              <TabsTrigger value="compatibility">
                <Monitor className="h-4 w-4 mr-2" />
                Browser Compatibility
              </TabsTrigger>
              <TabsTrigger value="performance">
                <Gauge className="h-4 w-4 mr-2" />
                Performance Concerns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="challenges" className="space-y-6 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Implementation Complexity</h3>
                <Badge variant="outline" className="text-sm">
                  Score: {feasibilityAnalysis.implementation_score}/10
                </Badge>
              </div>
              <Progress value={feasibilityAnalysis.implementation_score * 10} className="h-2" />
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Identified Challenges:</h4>
                <ul className="space-y-3">
                  {feasibilityAnalysis.implementation_challenges && 
                   feasibilityAnalysis.implementation_challenges.map((challenge: any, idx: number) => (
                    <li key={idx} className="p-3 bg-slate-50 rounded-md flex items-start">
                      <Badge className={`${getSeverityColor(challenge.severity)} mr-2 mt-0.5`}>
                        {challenge.severity}
                      </Badge>
                      <div>
                        <p className="font-medium">{challenge.title}</p>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                        {challenge.recommendation && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Recommendation:</span> {challenge.recommendation}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="compatibility" className="space-y-6 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Browser Compatibility</h3>
                <Badge variant="outline" className="text-sm">
                  Score: {feasibilityAnalysis.compatibility_score}/10
                </Badge>
              </div>
              <Progress value={feasibilityAnalysis.compatibility_score * 10} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {feasibilityAnalysis.browser_compatibility && 
                 Object.entries(feasibilityAnalysis.browser_compatibility).map(([browser, data]: [string, any]) => (
                  <div key={browser} className="p-3 bg-slate-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{browser}</h4>
                      <CheckCircle2 className={data.supported ? 'text-green-500' : 'text-red-500'} size={16} />
                    </div>
                    <p className="text-sm text-gray-600">{data.notes}</p>
                    {data.issues && data.issues.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Issues:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {data.issues.map((issue: string, idx: number) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Performance Analysis</h3>
                <Badge variant="outline" className="text-sm">
                  Score: {feasibilityAnalysis.performance_score}/10
                </Badge>
              </div>
              <Progress value={feasibilityAnalysis.performance_score * 10} className="h-2" />
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Performance Metrics:</h4>
                <div className="grid grid-cols-3 gap-4">
                  {feasibilityAnalysis.performance_metrics && 
                   Object.entries(feasibilityAnalysis.performance_metrics).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-3 bg-slate-50 rounded-md">
                      <p className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="font-medium">{value.value} {value.unit}</p>
                      <Badge className={getSeverityColor(value.concern_level)}>
                        {value.concern_level} concern
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">Performance Recommendations:</h4>
                  <ul className="space-y-2">
                    {feasibilityAnalysis.performance_recommendations && 
                     feasibilityAnalysis.performance_recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="p-3 bg-slate-50 rounded-md">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center p-8 border border-dashed rounded-md">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No Analysis Available</h3>
            <p className="text-gray-500 mb-6">Run an analysis to identify potential implementation challenges</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
