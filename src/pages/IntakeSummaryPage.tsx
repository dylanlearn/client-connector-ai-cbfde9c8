
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Check } from "lucide-react";  // Added Check import
import { useIntakeForm } from "@/hooks/intake-form";
import { useIntakeSummary } from "@/hooks/intake-form/useIntakeSummary";
import AISummaryResult from "@/components/intake/AISummaryResult";

const IntakeSummaryPage = () => {
  const navigate = useNavigate();
  const { formData, hasStartedForm } = useIntakeForm();
  const { summaryResult, isGenerating, generateSummary, regenerateSummary } = useIntakeSummary(formData);

  useEffect(() => {
    // If no form data, redirect to the intake form
    if (!hasStartedForm()) {
      navigate("/intake");
      return;
    }

    // Generate summary when the page loads
    if (!summaryResult && !isGenerating) {
      generateSummary();
    }
  }, [hasStartedForm, navigate, summaryResult, isGenerating, generateSummary]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Intake Form Summary</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isGenerating && !summaryResult ? (
              <Card className="p-12">
                <CardContent className="flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <h3 className="text-xl font-medium mb-2">Generating AI Summary</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    We're analyzing your intake form responses to generate insights and recommendations.
                    This will only take a moment.
                  </p>
                </CardContent>
              </Card>
            ) : summaryResult ? (
              <AISummaryResult 
                summaryResult={summaryResult} 
                isLoading={isGenerating}
                onRegenerate={regenerateSummary}
              />
            ) : (
              <Card className="p-8">
                <CardContent className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-medium mb-2">No Summary Available</h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">
                    We couldn't generate a summary. Please try again.
                  </p>
                  <Button onClick={generateSummary}>Generate Summary</Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-800 p-1 rounded-full mr-3 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">Review AI Summary</p>
                      <p className="text-sm text-gray-600">
                        Check that the AI has correctly captured your client's requirements
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-gray-100 text-gray-800 p-1 rounded-full mr-3 mt-0.5">
                      <span className="block w-4 h-4 text-center text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Incorporate Draft Copy</p>
                      <p className="text-sm text-gray-600">
                        Use the AI-generated copy as a starting point for your website
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-gray-100 text-gray-800 p-1 rounded-full mr-3 mt-0.5">
                      <span className="block w-4 h-4 text-center text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Set Up Your Project</p>
                      <p className="text-sm text-gray-600">
                        Create a new project based on these insights
                      </p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8 space-y-3">
                  <Button className="w-full" onClick={() => navigate("/project/create")}>
                    Create Project
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntakeSummaryPage;
