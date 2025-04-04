
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, BarChart, FileText, AlertCircle } from "lucide-react";
import { useFeedbackSummary } from '@/contexts/ai/hooks/useFeedbackSummary';
import { FeedbackAnalysisResult } from '@/services/ai/content/feedback-analysis-service';

interface FeedbackSentimentProps {
  positive: number;
  neutral: number;
  negative: number;
}

interface FeedbackAnalyzerProps {
  onAnalysisComplete?: (result: FeedbackAnalysisResult) => void;
  className?: string;
}

const FeedbackSentiment = ({ positive, neutral, negative }: FeedbackSentimentProps) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Sentiment Analysis</h4>
      <div className="flex gap-2 h-3 mb-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="bg-green-500 h-full" 
          style={{ width: `${positive * 100}%` }}
          title={`Positive: ${Math.round(positive * 100)}%`}
        />
        <div 
          className="bg-gray-400 h-full" 
          style={{ width: `${neutral * 100}%` }}
          title={`Neutral: ${Math.round(neutral * 100)}%`}
        />
        <div 
          className="bg-red-500 h-full" 
          style={{ width: `${negative * 100}%` }}
          title={`Negative: ${Math.round(negative * 100)}%`}
        />
      </div>
      <div className="flex text-xs justify-between">
        <span className="text-green-600">{Math.round(positive * 100)}% Positive</span>
        <span className="text-gray-600">{Math.round(neutral * 100)}% Neutral</span>
        <span className="text-red-600">{Math.round(negative * 100)}% Negative</span>
      </div>
    </div>
  );
};

export const FeedbackAnalyzer = ({ onAnalysisComplete, className = "" }: FeedbackAnalyzerProps) => {
  const [feedbackText, setFeedbackText] = useState('');
  const { analyzeFeedback, isLoading, analysis, error, resetAnalysis } = useFeedbackSummary();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    const result = await analyzeFeedback(feedbackText);
    if (result && onAnalysisComplete) {
      onAnalysisComplete(result);
    }
  };

  const handleReset = () => {
    setFeedbackText('');
    resetAnalysis();
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Feedback Analysis</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Paste client feedback here..."
                className="min-h-[200px] p-4"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {analysis && (
              <div className="space-y-4 p-4 border rounded-md">
                <div>
                  <h3 className="font-medium text-lg mb-2">Summary</h3>
                  <p className="text-gray-700">{analysis.summary}</p>
                  
                  <FeedbackSentiment 
                    positive={analysis.toneAnalysis.positive} 
                    neutral={analysis.toneAnalysis.neutral} 
                    negative={analysis.toneAnalysis.negative} 
                  />
                  
                  {(analysis.toneAnalysis.urgent || 
                   analysis.toneAnalysis.critical || 
                   analysis.toneAnalysis.vague) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {analysis.toneAnalysis.urgent && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Urgent Feedback
                        </span>
                      )}
                      {analysis.toneAnalysis.critical && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Critical Feedback
                        </span>
                      )}
                      {analysis.toneAnalysis.vague && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Vague Feedback
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Action Items</h3>
                  <ul className="space-y-2">
                    {analysis.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start p-2 border-b last:border-0">
                        <div className={`
                          h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3
                          ${item.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : item.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }
                        `}>
                          {item.urgency}
                        </div>
                        <div>
                          <p className="text-gray-900">{item.task}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Priority: <span className="font-medium">{item.priority}</span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            disabled={isLoading || (!feedbackText && !analysis)}
          >
            Clear
          </Button>
          
          <Button 
            type="submit" 
            disabled={isLoading || !feedbackText.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : analysis ? (
              <>
                <BarChart className="mr-2 h-4 w-4" />
                Reanalyze
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
