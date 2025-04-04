
import React, { useState, useRef } from "react";
import { useFeedbackAnalysis } from "@/hooks/use-feedback-analysis";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { FeedbackAnalyzerProps } from "./types";
import { FeedbackAnalysisResult } from '@/services/ai/content/feedback-analysis-service';

export function FeedbackAnalyzer({
  onAnalysisComplete,
  initialFeedback = "",
  placeholder = "Paste client feedback here to analyze...",
  className = "",
}: FeedbackAnalyzerProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const { analyzeFeedback, isAnalyzing, result, error, resetAnalysis } = useFeedbackAnalysis();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async () => {
    if (!feedback.trim()) return;
    
    const analysisResult = await analyzeFeedback(feedback);
    
    if (analysisResult && onAnalysisComplete) {
      onAnalysisComplete(analysisResult);
    }
  };

  const handleReset = () => {
    setFeedback("");
    resetAnalysis();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Client Feedback Analyzer</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          className="min-h-[200px]"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={isAnalyzing}
        />

        {error && (
          <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>Error analyzing feedback: {error}</span>
          </div>
        )}

        {result && !error && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Summary</h3>
              <p className="text-sm text-gray-600">{result.summary}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Action Items</h3>
              <ul className="space-y-2">
                {result.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 p-2 border border-gray-100 rounded bg-gray-50">
                    <div 
                      className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        item.priority === 'high' ? 'bg-red-500' : 
                        item.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm">{item.task}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.priority === 'high' ? 'bg-red-100 text-red-700' : 
                          item.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Urgency: {item.urgency}/10
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Tone Analysis</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-green-50 rounded p-2 text-center">
                  <span className="text-xs text-gray-600">Positive</span>
                  <p className="font-medium">{Math.round(result.toneAnalysis.positive * 100)}%</p>
                </div>
                <div className="bg-gray-50 rounded p-2 text-center">
                  <span className="text-xs text-gray-600">Neutral</span>
                  <p className="font-medium">{Math.round(result.toneAnalysis.neutral * 100)}%</p>
                </div>
                <div className="bg-red-50 rounded p-2 text-center">
                  <span className="text-xs text-gray-600">Negative</span>
                  <p className="font-medium">{Math.round(result.toneAnalysis.negative * 100)}%</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {result.toneAnalysis.urgent && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Urgent</span>
                )}
                {result.toneAnalysis.critical && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Critical</span>
                )}
                {result.toneAnalysis.vague && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Vague</span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isAnalyzing || (!result && !error && !feedback.trim())}
        >
          Reset
        </Button>
        
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !feedback.trim()}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : result ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Reanalyze
            </>
          ) : (
            'Analyze Feedback'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
