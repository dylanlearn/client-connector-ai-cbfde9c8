
import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FeedbackAnalyzer } from "@/components/feedback/FeedbackAnalyzer";
import { toast } from "sonner";
import { FeedbackAnalysisResult, FeedbackAnalysisService } from '@/services/ai/content/feedback-analysis-service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, FileText, BarChart, Check, ArrowLeft, Clock } from "lucide-react";
import { format } from 'date-fns';

const FeedbackAnalysisPage = () => {
  const navigate = useNavigate();
  const [savedAnalyses, setSavedAnalyses] = useState<Array<{
    originalFeedback: string;
    result: FeedbackAnalysisResult;
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load past analyses
  useEffect(() => {
    const loadPastAnalyses = async () => {
      setIsLoading(true);
      try {
        const analyses = await FeedbackAnalysisService.getPastAnalyses(5);
        setSavedAnalyses(analyses);
      } catch (error) {
        console.error("Error loading past analyses:", error);
        toast.error("Failed to load past analyses");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPastAnalyses();
  }, []);

  const handleAnalysisComplete = (result: FeedbackAnalysisResult) => {
    // Store analysis results in session storage for potential use in other parts of the app
    try {
      sessionStorage.setItem('feedback-analysis-results', JSON.stringify(result));
      
      // Add to our local state for display
      setSavedAnalyses(prev => [{
        originalFeedback: result.summary, // Using summary as a preview
        result,
        createdAt: new Date().toISOString()
      }, ...prev.slice(0, 4)]);
      
      toast.success("Analysis complete!", {
        description: `${result.actionItems.length} action items identified.`
      });
    } catch (error) {
      console.error("Error saving analysis results:", error);
      toast.error("Failed to save analysis results");
    }
  };

  const renderActionItemBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Low</span>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Client Feedback Analysis</h1>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">
          Paste client feedback to analyze sentiment and extract actionable tasks with AI assistance.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeedbackAnalyzer
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Benefits</CardTitle>
                <CardDescription>
                  How feedback analysis helps your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Quickly identify action items from lengthy feedback</span>
                  </li>
                  <li className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Understand client sentiment to prioritize responses</span>
                  </li>
                  <li className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Detect urgent issues that need immediate attention</span>
                  </li>
                  <li className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Identify vague feedback that requires clarification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
                <CardDescription>
                  Your latest feedback analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center text-gray-500">
                    <Clock className="h-8 w-8 mb-2 mx-auto animate-pulse" />
                    <p>Loading past analyses...</p>
                  </div>
                ) : savedAnalyses.length > 0 ? (
                  <ul className="space-y-4">
                    {savedAnalyses.map((analysis, index) => (
                      <li key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium line-clamp-1">{analysis.result.summary}</p>
                          <span className="text-xs text-gray-500">
                            {format(new Date(analysis.createdAt), 'MMM d')}
                          </span>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {analysis.result.actionItems.slice(0, 3).map((item, idx) => (
                            <div key={idx}>{renderActionItemBadge(item.priority)}</div>
                          ))}
                          {analysis.result.actionItems.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{analysis.result.actionItems.length - 3} more
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <FileText className="h-8 w-8 mb-2 mx-auto opacity-50" />
                    <p>No past analyses yet</p>
                    <p className="text-sm mt-1">Analyses will appear here after you submit feedback</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackAnalysisPage;
