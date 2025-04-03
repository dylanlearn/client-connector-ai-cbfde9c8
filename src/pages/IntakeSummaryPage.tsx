
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Check, Sparkles, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-[#121212] text-white">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mr-4 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Project Brief
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isGenerating && !summaryResult ? (
              <Card className="p-12 border-none bg-[#121212] border-zinc-800">
                <CardContent className="flex flex-col items-center justify-center pt-6">
                  <div className="bg-zinc-800 p-3 rounded-full mb-4">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-white">Creating Your Project Brief</h3>
                  <p className="text-zinc-400 text-center max-w-md">
                    We're analyzing your responses to craft a personalized brief for your project.
                    This typically takes about 15-20 seconds.
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
              <Card className="p-8 border-none bg-[#121212] border-zinc-800">
                <CardContent className="flex flex-col items-center justify-center pt-6">
                  <h3 className="text-xl font-medium mb-2 text-white">Unable to Generate Brief</h3>
                  <p className="text-zinc-400 text-center max-w-md mb-4">
                    We had trouble creating your project brief. Let's try again.
                  </p>
                  <Button onClick={generateSummary} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Create Brief
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <Card className="border-none bg-[#121212] border-zinc-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                  What's Next
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-yellow-400 text-black p-1 rounded-full mr-3 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Review Your Brief</p>
                      <p className="text-sm text-zinc-400">
                        Look over the generated brief to ensure it captures your vision accurately
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zinc-800 text-zinc-300 p-1 rounded-full mr-3 mt-0.5">
                      <span className="block w-4 h-4 text-center text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Use the Content</p>
                      <p className="text-sm text-zinc-400">
                        Copy and customize the suggested text for your website or marketing materials
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zinc-800 text-zinc-300 p-1 rounded-full mr-3 mt-0.5">
                      <span className="block w-4 h-4 text-center text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Create Your Project</p>
                      <p className="text-sm text-zinc-400">
                        Set up a new project based on your brief and start bringing your vision to life
                      </p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8 space-y-3">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => navigate("/project/create")}>
                    Create Project
                  </Button>
                  <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => navigate("/dashboard")}>
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
