
export const OnboardingSteps = [
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
