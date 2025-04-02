
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useSubscription } from "@/hooks/use-subscription";
import { ProgressIndicator } from "@/components/onboarding/ProgressIndicator";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { RoleSelectionStep } from "@/components/onboarding/RoleSelectionStep";
import { PlanSelectionStep } from "@/components/onboarding/PlanSelectionStep";
import { CompletionStep } from "@/components/onboarding/CompletionStep";
import { OnboardingSteps } from "@/components/onboarding/OnboardingSteps";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const { startSubscription } = useSubscription();

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    setCurrentStep(currentStep + 1);
  };

  const handlePlanSelection = (plan: string) => {
    setSelectedPlan(plan);
    
    // Handle plan selection
    if (plan === "syncPro") {
      startSubscription("sync-pro");
    } else if (plan === "sync") {
      startSubscription("sync");
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handleFinishOnboarding = () => {
    navigate("/dashboard");
  };

  const handleContinue = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <ProgressIndicator 
            steps={OnboardingSteps} 
            currentStep={currentStep} 
          />

          {/* Current step */}
          {currentStep === 0 && (
            <WelcomeStep onContinue={handleContinue} />
          )}
          
          {currentStep === 1 && (
            <RoleSelectionStep 
              roles={OnboardingSteps[1].fields as { id: string; label: string }[]} 
              onContinue={handleRoleSelection} 
            />
          )}
          
          {currentStep === 2 && (
            <PlanSelectionStep 
              plans={OnboardingSteps[2].fields as any} 
              onContinue={handlePlanSelection} 
            />
          )}
          
          {currentStep === 3 && (
            <CompletionStep onFinish={handleFinishOnboarding} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
