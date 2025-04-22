
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  ArrowRight, 
  Zap, 
  X, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  useUserFlowAnalysis, 
  UserFlowAnalysis, 
  UserFlowPath 
} from '@/hooks/ai/use-user-flow-analysis';

interface UserFlowAnalysisPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (wireframe: WireframeData) => void;
}

const UserFlowAnalysisPanel: React.FC<UserFlowAnalysisPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const { 
    isAnalyzing, 
    flowAnalysis, 
    error, 
    analyzeUserFlows,
    applyOptimizationSuggestion
  } = useUserFlowAnalysis();
  
  useEffect(() => {
    // Auto-analyze on component mount
    if (wireframe && !flowAnalysis && !isAnalyzing) {
      analyzeUserFlows(wireframe);
    }
  }, [wireframe, flowAnalysis, isAnalyzing, analyzeUserFlows]);
  
  const handleApplySuggestion = async (suggestionId: string) => {
    if (onUpdateWireframe) {
      const updatedWireframe = await applyOptimizationSuggestion(wireframe, suggestionId);
      onUpdateWireframe(updatedWireframe);
    }
  };
  
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Analyzing user flows...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          Error analyzing user flows: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!flowAnalysis) {
    return (
      <div className="text-center p-8">
        <Button onClick={() => analyzeUserFlows(wireframe)}>
          Analyze User Flows
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Flow Analysis</h3>
          <p className="text-sm text-muted-foreground">
            AI analysis of user journeys through your wireframe
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => analyzeUserFlows(wireframe)}>
          Refresh Analysis
        </Button>
      </div>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Overall Efficiency</h4>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {Math.round(flowAnalysis.overallEfficiency * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">Path Length</h4>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {flowAnalysis.flowMetrics.averagePathLength} steps
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">User Friction</h4>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {Math.round(flowAnalysis.flowMetrics.userFriction * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Flow Paths */}
      <div className="space-y-4">
        <h3 className="text-md font-medium">User Paths</h3>
        
        {flowAnalysis.paths.map(path => (
          <UserFlowPathCard key={path.id} path={path} />
        ))}
      </div>
      
      {/* Optimization Suggestions */}
      <div className="space-y-4">
        <h3 className="text-md font-medium">Optimization Suggestions</h3>
        
        {flowAnalysis.optimizationSuggestions.map(suggestion => (
          <div 
            key={suggestion.id} 
            className="flex items-start justify-between p-4 border rounded-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium">{suggestion.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-50">
                  Impact: {suggestion.impact}
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  Difficulty: {suggestion.implementationDifficulty}
                </Badge>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={() => handleApplySuggestion(suggestion.id)}
            >
              Apply
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface UserFlowPathCardProps {
  path: UserFlowPath;
}

const UserFlowPathCard: React.FC<UserFlowPathCardProps> = ({ path }) => {
  return (
    <Card>
      <CardContent className="pt-4">
        <h4 className="font-medium">{path.name}</h4>
        
        <div className="flex flex-wrap items-center gap-1 mt-3">
          {path.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div className="border rounded p-2 text-sm bg-gray-50">
                {node.name}
                <span className="ml-2 text-xs text-muted-foreground">({node.interactionType})</span>
              </div>
              
              {index < path.nodes.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium">Efficiency: {Math.round(path.efficiency * 100)}%</p>
        </div>
        
        {path.bottlenecks.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Bottlenecks
            </p>
            <ul className="mt-1 space-y-2">
              {path.bottlenecks.map((bottleneck, index) => (
                <li key={index} className="text-xs border-l-2 border-amber-300 pl-2">
                  <p><span className="font-medium">Issue:</span> {bottleneck.issue}</p>
                  <p><span className="font-medium">Suggestion:</span> {bottleneck.suggestion}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserFlowAnalysisPanel;
