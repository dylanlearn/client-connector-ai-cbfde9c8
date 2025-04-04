
import React, { useState } from 'react';
import { useFeedbackAnalysis } from '@/hooks/use-feedback-analysis';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Check, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FeedbackAnalyzerProps {
  onAnalysisComplete?: (result: any) => void;
  initialFeedback?: string;
  placeholder?: string;
  className?: string; // Add className prop to the interface
}

export function FeedbackAnalyzer({ 
  onAnalysisComplete, 
  initialFeedback = '', 
  placeholder = 'Enter feedback to analyze...',
  className = '' // Initialize with empty string
}: FeedbackAnalyzerProps) {
  const [feedbackText, setFeedbackText] = useState(initialFeedback);
  const { analyzeFeedback, resetAnalysis, isAnalyzing, result, error } = useFeedbackAnalysis();

  const handleAnalyze = async () => {
    const analysisResult = await analyzeFeedback(feedbackText);
    if (analysisResult && onAnalysisComplete) {
      onAnalysisComplete(analysisResult);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getSentimentScore = () => {
    if (!result?.toneAnalysis) return 0;
    
    const { positive, neutral, negative } = result.toneAnalysis;
    // Calculate a score from 0-100 where 0 is very negative and 100 is very positive
    return Math.round((positive * 100) + (neutral * 50));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none"
        disabled={isAnalyzing}
      />
      
      <div className="flex justify-end gap-2">
        {result && (
          <Button variant="outline" onClick={resetAnalysis}>
            Reset Analysis
          </Button>
        )}
        
        <Button onClick={handleAnalyze} disabled={isAnalyzing || !feedbackText.trim()}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : 'Analyze Feedback'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Analysis Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Feedback Analysis</CardTitle>
            <CardDescription>AI-powered analysis of the provided feedback</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Summary */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
              <p className="text-gray-700 text-sm">{result.summary}</p>
            </div>
            
            {/* Sentiment Analysis */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Sentiment Analysis</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Negative</span>
                  <span className="text-xs">Positive</span>
                </div>
                <Progress value={getSentimentScore()} className="h-2" />
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.toneAnalysis.urgent && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Urgent
                    </Badge>
                  )}
                  {result.toneAnalysis.critical && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Critical
                    </Badge>
                  )}
                  {result.toneAnalysis.vague && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Vague
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Items */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Action Items</h3>
              <ul className="space-y-2">
                {result.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{item.task}</p>
                      <div className="flex items-center mt-1 gap-2">
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Urgency: {item.urgency}/10
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-4">
            <div className="flex items-center text-xs text-gray-500">
              <Info className="h-3 w-3 mr-1" />
              This analysis is AI-generated and may not be 100% accurate.
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
