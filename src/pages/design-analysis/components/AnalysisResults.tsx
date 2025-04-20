
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WebsiteAnalysisResult } from '@/hooks/ai-design/website-analysis/types';
import { Loader2 } from 'lucide-react';

interface AnalysisResultsProps {
  isAnalyzing: boolean;
  analysisResults: WebsiteAnalysisResult | null;
  error: string | null;
}

export default function AnalysisResults({ 
  isAnalyzing, 
  analysisResults, 
  error 
}: AnalysisResultsProps) {
  if (isAnalyzing) {
    return (
      <Card className="mt-6">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Analyzing website design patterns...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!analysisResults) {
    return null;
  }
  
  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Design Analysis Results</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Design Patterns</h4>
              <div className="bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap">{analysisResults.designPatterns}</pre>
              </div>
            </div>
            
            {analysisResults.implementation && (
              <div>
                <h4 className="font-medium mb-2">Implementation Guidance</h4>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="whitespace-pre-wrap">{analysisResults.implementation}</pre>
                </div>
              </div>
            )}
            
            {analysisResults.colorScheme && (
              <div>
                <h4 className="font-medium mb-2">Color Scheme</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(analysisResults.colorScheme).map(([name, color]) => (
                    <div key={name} className="flex flex-col items-center">
                      <div 
                        className="w-full h-12 rounded-md border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs mt-1">{color}</span>
                      <span className="text-xs text-muted-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {analysisResults.components && (
              <div>
                <h4 className="font-medium mb-2">Components</h4>
                <ul className="list-disc pl-5">
                  {analysisResults.components.map((component, index) => (
                    <li key={index} className="mb-1">{component}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
