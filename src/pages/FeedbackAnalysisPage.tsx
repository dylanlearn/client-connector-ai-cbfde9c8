
import React from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FeedbackAnalyzer } from "@/components/feedback/FeedbackAnalyzer"; // Changed to named import
import { toast } from "sonner";
import { ActionItem } from '@/services/ai/content/feedback-analysis-service';

const FeedbackAnalysisPage = () => {
  const navigate = useNavigate();

  const handleAnalysisComplete = (actionItems: ActionItem[]) => {
    // Store action items in session storage for potential use in other parts of the app
    try {
      sessionStorage.setItem('feedback-action-items', JSON.stringify(actionItems));
      
      // Optionally navigate to another page or use the action items
      toast.success("Analysis complete! Action items are ready to use.");
    } catch (error) {
      console.error("Error saving action items:", error);
      toast.error("Failed to save action items");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Client Feedback Analysis</h1>
        <p className="text-gray-600 mb-8">
          Paste client feedback to analyze sentiment and extract actionable tasks with AI assistance.
        </p>
        
        <FeedbackAnalyzer
          onAnalysisComplete={handleAnalysisComplete}
          className="max-w-4xl"
        />
      </div>
    </DashboardLayout>
  );
};

export default FeedbackAnalysisPage;
