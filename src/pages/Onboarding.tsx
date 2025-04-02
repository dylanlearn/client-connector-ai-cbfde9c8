
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSubscription } from "@/hooks/use-subscription";

const OnboardingSteps = [
  {
    title: "Welcome to DezignSync",
    description: "Let's get your account set up to make the most of our platform.",
    fields: [],
    buttonText: "Continue",
  },
  {
    title: "What brings you to DezignSync?",
    description: "Help us personalize your experience.",
    fields: [
      { id: "designer", label: "I'm a designer looking to streamline client onboarding" },
      { id: "agency", label: "I run an agency and need better client management" },
      { id: "freelancer", label: "I'm a freelancer looking to appear more professional" },
      { id: "other", label: "Something else" },
    ],
    buttonText: "Continue",
  },
  {
    title: "Choose your plan",
    description: "Select the plan that works best for you.",
    fields: [
      { 
        id: "sync", 
        label: "Sync Basic", 
        description: "Perfect for individuals",
        features: ["3 active projects", "Basic questionnaires", "Client portal"],
        price: "$35/month" 
      },
      { 
        id: "syncPro", 
        label: "Sync Pro", 
        description: "Ideal for freelancers",
        features: ["Unlimited projects", "Advanced AI analysis", "Custom branding", "Priority support"],
        price: "$69/month" 
      },
    ],
    buttonText: "Continue",
  },
  {
    title: "Set up complete!",
    description: "You're all set to start using DezignSync.",
    fields: [],
    buttonText: "Go to Dashboard",
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const { startSubscription } = useSubscription();

  const handleContinue = () => {
    // Validation for step 1
    if (currentStep === 1 && !selectedRole) {
      toast({
        title: "Please select an option",
        description: "Let us know what brings you to DezignSync.",
        variant: "destructive",
      });
      return;
    }

    // Validation for step 2
    if (currentStep === 2 && !selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose a plan to continue.",
        variant: "destructive",
      });
      return;
    }

    // If it's the last step, navigate to dashboard
    if (currentStep === OnboardingSteps.length - 1) {
      navigate("/dashboard");
      return;
    }

    // Handle plan selection
    if (currentStep === 2) {
      if (selectedPlan === "syncPro") {
        startSubscription("pro");
      } else if (selectedPlan === "sync") {
        startSubscription("basic");
      }
    }

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8 px-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {OnboardingSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-medium text-sm md:text-base
                      ${index < currentStep 
                        ? "bg-indigo-600 text-white" 
                        : index === currentStep 
                          ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600" 
                          : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>
                  {index < OnboardingSteps.length - 1 && (
                    <div className="hidden md:block h-1 w-16 bg-gray-200 mt-5">
                      <div 
                        className="h-full bg-indigo-600" 
                        style={{ width: index < currentStep ? "100%" : "0%" }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center">
                {OnboardingSteps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-center text-base md:text-lg">
                {OnboardingSteps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {OnboardingSteps[currentStep].fields.map((field) => (
                    <div 
                      key={field.id}
                      className={`border rounded-lg p-4 cursor-pointer hover:border-indigo-600 transition-colors
                        ${selectedRole === field.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}
                      `}
                      onClick={() => setSelectedRole(field.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border ${selectedRole === field.id ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}></div>
                        <span className="font-medium">{field.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {OnboardingSteps[currentStep].fields.map((field: any) => (
                    <div 
                      key={field.id}
                      className={`border rounded-lg p-6 cursor-pointer hover:border-indigo-600 transition-colors
                        ${selectedPlan === field.id ? "border-indigo-600 bg-indigo-50" : "border-gray-200"}
                      `}
                      onClick={() => setSelectedPlan(field.id)}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-5 h-5 rounded-full border ${selectedPlan === field.id ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}></div>
                        <span className="font-bold text-lg">{field.label}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{field.description}</p>
                      <div className="text-2xl font-bold mb-2 text-indigo-600">{field.price}</div>
                      <p className="text-xs text-gray-500 mb-4">Starts with a 3-day free trial</p>
                      <ul className="space-y-2">
                        {field.features.map((feature: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="bg-indigo-100 text-indigo-600 rounded-full p-1">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-indigo-600" />
                  </div>
                  <p className="text-lg mb-4">
                    You've successfully set up your DezignSync account.
                  </p>
                  <p className="text-gray-600">
                    Your 3-day free trial has started. You're now ready to create your first project and start collaborating with clients.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={handleContinue}
                className="w-full md:w-auto px-8"
              >
                {OnboardingSteps[currentStep].buttonText}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
