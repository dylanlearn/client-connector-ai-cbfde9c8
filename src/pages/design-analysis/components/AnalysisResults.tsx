
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WebsiteAnalysisResult } from '@/hooks/ai-design/website-analysis/types';
import { Loader2 } from 'lucide-react';
import AnalysisCard from './AnalysisCard';

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
    <div className="mt-6">
      <AnalysisCard result={analysisResults} />
    </div>
  );
}
