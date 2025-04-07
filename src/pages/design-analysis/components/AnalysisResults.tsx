
import { WebsiteAnalysisResult } from '@/hooks/ai-design/website-analysis/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertMessage } from '@/components/ui/alert-message';
import { Globe, Loader2 } from 'lucide-react';
import AnalysisCard from './AnalysisCard';

interface AnalysisResultsProps {
  isAnalyzing: boolean;
  analysisResults: WebsiteAnalysisResult[];
  error: string | null;
}

export default function AnalysisResults({
  isAnalyzing,
  analysisResults,
  error
}: AnalysisResultsProps) {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 mt-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Analyzing website...</p>
        <p className="text-sm text-muted-foreground mt-2">
          This may take a minute or two
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-6">
        <AlertMessage type="error" title="Analysis Error">
          {error}
        </AlertMessage>
      </div>
    );
  }
  
  if (!analysisResults || analysisResults.length === 0) {
    return (
      <div className="text-center py-16 mt-6">
        <Globe className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium">No analysis data yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Enter a website URL to get started
        </p>
      </div>
    );
  }
  
  const latestResult = analysisResults[analysisResults.length - 1];
  
  return (
    <div className="mt-6 space-y-6">
      <AnalysisCard result={latestResult} />
    </div>
  );
}
