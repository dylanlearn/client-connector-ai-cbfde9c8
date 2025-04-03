
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useFeedbackAnalysis } from "@/hooks/use-feedback-analysis";
import FeedbackAnalysisCard from "./FeedbackAnalysisResult";

interface FeedbackAnalyzerProps {
  initialFeedback?: string;
  onAnalysisComplete?: (actionItems: Array<{task: string; priority: string}>) => void;
  className?: string;
}

const FeedbackAnalyzer = ({ 
  initialFeedback = "", 
  onAnalysisComplete,
  className = "" 
}: FeedbackAnalyzerProps) => {
  const [feedbackText, setFeedbackText] = useState(initialFeedback);
  const { 
    analyzeFeedback, 
    clearAnalysis, 
    isAnalyzing, 
    analysisResult 
  } = useFeedbackAnalysis();

  const handleAnalyze = async () => {
    if (!feedbackText.trim()) return;
    
    const result = await analyzeFeedback(feedbackText);
    if (result && onAnalysisComplete) {
      onAnalysisComplete(result.actionItems);
    }
  };

  const handleClear = () => {
    setFeedbackText("");
    clearAnalysis();
  };

  const isFormDisabled = isAnalyzing || !feedbackText.trim();
  const hasFeedbackOrResult = !!feedbackText || !!analysisResult;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Analyzer</CardTitle>
          <CardDescription>
            Submit client feedback to generate actionable insights and detect tone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste client feedback here..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="min-h-[200px]"
            disabled={isAnalyzing}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleClear}
            disabled={isAnalyzing || !hasFeedbackOrResult}
          >
            Clear
          </Button>
          <Button 
            onClick={handleAnalyze}
            disabled={isFormDisabled}
          >
            {isAnalyzing ? (
              <>
                <LoadingSpinner className="mr-2" size="sm" />
                Analyzing...
              </>
            ) : "Analyze Feedback"}
          </Button>
        </CardFooter>
      </Card>

      {analysisResult && (
        <FeedbackAnalysisCard 
          result={analysisResult} 
          onExport={onAnalysisComplete}
        />
      )}
    </div>
  );
};

export default FeedbackAnalyzer;
