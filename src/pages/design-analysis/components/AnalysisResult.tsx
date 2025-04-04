
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { Badge } from '@/components/ui/badge';
import { X, CheckCircle } from 'lucide-react';

interface AnalysisResultProps {
  currentResult: WebsiteAnalysisResult | null;
  analysisResults: WebsiteAnalysisResult[];
  onSelectResult: (result: WebsiteAnalysisResult) => void;
  onClearResult: () => void;
}

const AnalysisResult = ({
  currentResult,
  analysisResults,
  onSelectResult,
  onClearResult
}: AnalysisResultProps) => {
  if (!currentResult) {
    if (analysisResults.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No analysis results yet. Fill out the form to analyze a website section or a complete website.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisResults.map((result, index) => (
              <div 
                key={index} 
                className="p-3 border rounded-md cursor-pointer hover:bg-slate-50"
                onClick={() => onSelectResult(result)}
              >
                <h3 className="font-medium text-sm">{result.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.source || "Unknown source"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{currentResult.title}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {currentResult.source || "Unknown source"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearResult}
          className="h-8 w-8 -mt-1 -mr-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{currentResult.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Visual Elements</h3>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm">Layout:</span>
                <span className="text-sm font-medium">{currentResult.visualElements.layout}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Color Scheme:</span>
                <span className="text-sm font-medium">{currentResult.visualElements.colorScheme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Typography:</span>
                <span className="text-sm font-medium">{currentResult.visualElements.typography}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Content</h3>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm">Headline:</span>
                <span className="text-sm font-medium">{currentResult.contentStructure.headline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Call to Action:</span>
                <span className="text-sm font-medium">{currentResult.contentStructure.callToAction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Value Proposition:</span>
                <span className="text-sm font-medium">{currentResult.contentStructure.valueProposition}</span>
              </div>
            </div>
          </div>

          {currentResult.targetAudience && currentResult.targetAudience.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Target Audience</h3>
              <div className="flex flex-wrap gap-2">
                {currentResult.targetAudience.map((audience, index) => (
                  <Badge key={index} variant="secondary">{audience}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {currentResult.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Stored successfully</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;
