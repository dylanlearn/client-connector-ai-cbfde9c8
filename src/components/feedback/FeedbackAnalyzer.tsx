
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useFeedbackAnalysis } from "@/hooks/use-feedback-analysis";
import { FeedbackAnalysisResult } from "@/services/ai/content/feedback-types";

interface FeedbackAnalyzerProps {
  onAnalysisComplete?: (result: FeedbackAnalysisResult) => void;
  initialFeedback?: string;
  placeholder?: string;
  className?: string;
}

export const FeedbackAnalyzer = ({ 
  onAnalysisComplete, 
  initialFeedback = "", 
  placeholder = "Paste client feedback here...",
  className = ""
}: FeedbackAnalyzerProps) => {
  const [feedbackText, setFeedbackText] = useState(initialFeedback);
  const { analyzeFeedback, isAnalyzing, result, error, isAuthenticated } = useFeedbackAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const analysisResult = await analyzeFeedback(feedbackText);
    
    if (analysisResult && onAnalysisComplete) {
      onAnalysisComplete(analysisResult);
    }
  };

  const renderActionItemPriority = (priority: string) => {
    switch(priority) {
      case 'high':
        return <span className="text-red-600 font-medium">High</span>;
      case 'medium':
        return <span className="text-amber-600 font-medium">Medium</span>;
      case 'low':
        return <span className="text-blue-600 font-medium">Low</span>;
      default:
        return null;
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Analyze Client Feedback</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isAuthenticated === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You need to be logged in to save feedback analysis results.
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Textarea
            placeholder={placeholder}
            className="min-h-[150px] resize-y"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            disabled={isAnalyzing}
          />
          
          {result && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Analysis Complete</AlertTitle>
              <AlertDescription>
                We've identified {result.actionItems.length} action items and analyzed the tone.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setFeedbackText('')}
            disabled={isAnalyzing || !feedbackText}
          >
            Clear
          </Button>
          
          <Button 
            type="submit" 
            disabled={isAnalyzing || !feedbackText.trim()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : 'Analyze Feedback'}
          </Button>
        </CardFooter>
      </form>
      
      {result && (
        <CardContent className="pt-4 border-t">
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="actions">Action Items</TabsTrigger>
              <TabsTrigger value="tone">Tone Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-3">
              <h3 className="text-lg font-medium">Summary</h3>
              <p className="text-gray-700">{result.summary}</p>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-3">
              <h3 className="text-lg font-medium">Action Items</h3>
              <ul className="space-y-3">
                {result.actionItems.map((item, index) => (
                  <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <p>{item.task}</p>
                      <div>
                        {renderActionItemPriority(item.priority)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="tone" className="space-y-3">
              <h3 className="text-lg font-medium">Tone Analysis</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Positive</p>
                  <p className="text-xl font-medium">{Math.round(result.toneAnalysis.positive * 100)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Neutral</p>
                  <p className="text-xl font-medium">{Math.round(result.toneAnalysis.neutral * 100)}%</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Negative</p>
                  <p className="text-xl font-medium">{Math.round(result.toneAnalysis.negative * 100)}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {result.toneAnalysis.urgent && (
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Contains urgent language</span>
                  </div>
                )}
                
                {result.toneAnalysis.critical && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Contains critical tone</span>
                  </div>
                )}
                
                {result.toneAnalysis.vague && (
                  <div className="flex items-center text-blue-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Feedback appears vague, may need clarification</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};
