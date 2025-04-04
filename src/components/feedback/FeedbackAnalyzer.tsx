
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useFeedbackAnalysis } from "@/hooks/use-feedback-analysis";
import { toast } from "sonner";
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
    resetAnalysis, 
    isAnalyzing, 
    analysisResult,
    error 
  } = useFeedbackAnalysis();

  const handleAnalyze = async () => {
    if (!feedbackText.trim()) {
      toast.error("Please enter feedback text to analyze");
      return;
    }
    
    const result = await analyzeFeedback(feedbackText);
    if (result && onAnalysisComplete) {
      try {
        onAnalysisComplete(result.actionItems);
        toast.success("Action items exported successfully");
      } catch (err) {
        console.error("Error exporting action items:", err);
        toast.error("Failed to export action items");
      }
    }
  };

  const handleClear = () => {
    setFeedbackText("");
    resetAnalysis();
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
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
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
          onExport={onAnalysisComplete ? () => {
            try {
              onAnalysisComplete(analysisResult.actionItems);
              toast.success("Action items exported successfully");
            } catch (err) {
              console.error("Error exporting action items:", err);
              toast.error("Failed to export action items");
            }
          } : undefined}
        />
      )}
    </div>
  );
};

export default FeedbackAnalyzer;
