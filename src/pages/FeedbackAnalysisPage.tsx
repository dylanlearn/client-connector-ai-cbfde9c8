
import React, { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FeedbackAnalyzer } from "@/components/feedback/FeedbackAnalyzer";
import { toast } from "sonner";
import { FeedbackAnalysisResult } from '@/services/ai/content/feedback-analysis-service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, FileText, BarChart, Check } from "lucide-react";

const FeedbackAnalysisPage = () => {
  const navigate = useNavigate();
  const [savedAnalyses, setSavedAnalyses] = useState<FeedbackAnalysisResult[]>([]);

  const handleAnalysisComplete = (result: FeedbackAnalysisResult) => {
    // Store analysis results in session storage for potential use in other parts of the app
    try {
      sessionStorage.setItem('feedback-analysis-results', JSON.stringify(result));
      
      // Add to our local state for display
      setSavedAnalyses(prev => [result, ...prev]);
      
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
          <h1 className="text-2xl font-bold">Client Feedback Analysis</h1>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)} 
            className="flex items-center"
          >
            Back
          </Button>
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
            
            {savedAnalyses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {savedAnalyses.map((analysis, index) => (
                      <li key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <p className="font-medium mb-1 line-clamp-1">{analysis.summary}</p>
                        <div className="flex gap-2 mb-2">
                          {analysis.actionItems.slice(0, 3).map((item, idx) => (
                            <div key={idx}>{renderActionItemBadge(item.priority)}</div>
                          ))}
                          {analysis.actionItems.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{analysis.actionItems.length - 3} more
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackAnalysisPage;
