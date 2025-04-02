
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useAI } from "@/contexts/ai";
import AIChat from "@/components/ai/AIChat";
import AIAnalysisSummary from "@/components/ai/AIAnalysisSummary";
import AIInsightCard from "@/components/ai/AIInsightCard";
import SummaryTab from "@/components/questionnaire-results/SummaryTab";
import AnswersTab from "@/components/questionnaire-results/AnswersTab";
import DesignRecommendationsTab from "@/components/questionnaire-results/DesignRecommendationsTab";
import AIInsightsTab from "@/components/questionnaire-results/AIInsightsTab";
import ExportShareSidebar from "@/components/questionnaire-results/ExportShareSidebar";
import AIReadinessScore from "@/components/questionnaire-results/AIReadinessScore";
import { projectData } from "@/components/questionnaire-results/data/projectData";

const QuestionnaireResults = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { analyzeResponses, analysis, isProcessing } = useAI();
  const [aiReady, setAiReady] = useState(false);

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const questionsData = projectData.answers.reduce((acc, item, index) => {
          acc[`question_${index + 1}`] = item.answer;
          if (item.followup) {
            acc[`question_${index + 1}_followup`] = item.followup;
          }
          return acc;
        }, {} as Record<string, string>);
        
        await analyzeResponses(questionsData);
        setAiReady(true);
      } catch (error) {
        console.error("Error running AI analysis:", error);
      }
    };

    runAnalysis();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{projectData.name}</h1>
            <p className="text-gray-600">Client: {projectData.client} • Created: {projectData.date}</p>
          </div>
          <div className="flex gap-4">
            <button 
              className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-300 flex items-center"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => navigate("/project-view")}
            >
              Complete Setup
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="summary">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
                <TabsTrigger value="answers" className="flex-1">Client Answers</TabsTrigger>
                <TabsTrigger value="design" className="flex-1">Design Recommendations</TabsTrigger>
                <TabsTrigger value="ai-insights" className="flex-1">AI Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <SummaryTab 
                  summary={projectData.aiSummary} 
                  onCopy={() => toast({
                    title: "Summary copied",
                    description: "The summary has been copied to your clipboard.",
                  })}
                  onExport={(format) => toast({
                    title: `Exporting as ${format}`,
                    description: "Your file will be ready to download shortly.",
                  })}
                />
              </TabsContent>
              
              <TabsContent value="answers">
                <AnswersTab answers={projectData.answers} />
              </TabsContent>
              
              <TabsContent value="design">
                <DesignRecommendationsTab />
              </TabsContent>
              
              <TabsContent value="ai-insights">
                <AIInsightsTab 
                  isProcessing={isProcessing} 
                  analysis={analysis} 
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <ExportShareSidebar 
              onExport={(format) => toast({
                title: `Exporting as ${format}`,
                description: "Your file will be ready to download shortly.",
              })} 
            />
            
            <AIReadinessScore />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionnaireResults;
