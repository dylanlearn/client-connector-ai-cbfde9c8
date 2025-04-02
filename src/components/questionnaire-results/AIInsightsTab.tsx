
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, MessageSquare } from "lucide-react";
import AIChat from "@/components/ai/AIChat";
import AIAnalysisSummary from "@/components/ai/AIAnalysisSummary";
import AIInsightCard from "@/components/ai/AIInsightCard";
import { AIAnalysis } from "@/types/ai";

interface AIInsightsTabProps {
  isProcessing: boolean;
  analysis: AIAnalysis | null;
}

const AIInsightsTab = ({ isProcessing, analysis }: AIInsightsTabProps) => {
  if (isProcessing) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin" style={{ borderTopColor: 'transparent' }}></div>
          </div>
          <h3 className="text-xl font-medium mb-2">AI Processing Responses</h3>
          <p className="text-gray-500 text-center max-w-md">
            Our AI is analyzing client responses to generate insights and recommendations.
            This should only take a moment.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysis && (
          <AIAnalysisSummary analysis={analysis} />
        )}
        
        <AIInsightCard 
          title="Design Recommendations" 
          insights={[
            "Use large hero sections with clear CTAs",
            "Incorporate visual elements that reinforce trust and reliability",
            "Focus on clear typography with good readability",
            "Use color accents strategically to highlight key elements",
            "Include visual explanations for complex features"
          ]} 
          icon={<Layout className="h-5 w-5" />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            AI Assistant Chat
          </CardTitle>
          <CardDescription>
            Ask follow-up questions about the analysis or get specific recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIChat 
            title="" 
            placeholder="Ask a question about the client's responses or design preferences..."
            initialMessage="I've analyzed the client's responses. You can ask me specific questions about their preferences, or for recommendations on design elements, content strategy, or any other aspect of the project."
            className="border-0 shadow-none p-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsTab;
