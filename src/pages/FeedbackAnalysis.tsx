
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FeedbackAnalyzer from "@/components/feedback/FeedbackAnalyzer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Lightbulb, ListChecks } from "lucide-react";
import { toast } from "sonner";

const FeedbackAnalysis = () => {
  const navigate = useNavigate();

  const handleActionItemsGenerated = (actionItems: Array<{task: string; priority: string}>) => {
    // In a real implementation, you might save these to a project or task list
    toast.success(`${actionItems.length} action items generated`, {
      description: "Items can be added to your project tasks"
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Feedback Analysis</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FeedbackAnalyzer onAnalysisComplete={handleActionItemsGenerated} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <Lightbulb className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="text-lg font-semibold mb-2">How It Works</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our AI-powered feedback analyzer helps you extract actionable insights from client feedback and detect tone patterns.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <ListChecks className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>Converts feedback into prioritized action items</span>
              </li>
              <li className="flex items-start">
                <ListChecks className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>Detects tone: positive, negative, urgent, critical</span>
              </li>
              <li className="flex items-start">
                <ListChecks className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>Identifies vague feedback that needs clarification</span>
              </li>
              <li className="flex items-start">
                <ListChecks className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                <span>Creates shareable to-do lists from feedback</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <FileText className="h-8 w-8 text-gray-600 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Tips for Better Analysis</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="pb-2 border-b border-gray-200">
                Include complete feedback without summarizing to get better analysis
              </li>
              <li className="pb-2 border-b border-gray-200">
                The longer and more detailed the feedback, the more accurate the action items
              </li>
              <li className="pb-2 border-b border-gray-200">
                Copy action items directly into your project management tool
              </li>
              <li>
                Look for urgency indicators to prioritize critical work
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackAnalysis;
