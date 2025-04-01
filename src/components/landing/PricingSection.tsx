
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Sync",
    price: "Free",
    description: "Perfect for freelancers and small teams",
    features: [
      "AI-powered client questionnaire",
      "Visual inspiration selector",
      "Basic brand style detection",
      "Project brief generation",
      "PDF export",
      "Up to 3 projects"
    ],
    cta: "Get Started",
    highlight: false
  },
  {
    name: "Sync Pro",
    price: "$69",
    period: "/month",
    description: "For growing design teams and agencies",
    features: [
      "Everything in Sync, plus:",
      "Unlimited projects",
      "Advanced AI analysis",
      "Client readiness score",
      "Export to Figma & Webflow",
      "Project analytics",
      "Team collaboration",
      "Client portal",
      "Priority support"
    ],
    cta: "Go Pro",
    highlight: true
  },
  {
    name: "Templates",
    price: "From $29",
    description: "Industry-specific template packs",
    features: [
      "Pre-built industry templates",
      "Compatible with Sync questionnaires",
      "Editable Webflow templates",
      "Design system included",
      "Commercial license",
      "Regular updates",
      "Support included"
    ],
    cta: "Browse Templates",
    highlight: false
  }
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start for free or unlock advanced features with Sync Pro.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-8 transition-all ${
                plan.highlight 
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg transform md:-translate-y-4' 
                  : 'bg-white border border-gray-200 shadow'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-2 h-5 w-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                variant={plan.highlight ? "default" : "outline"}
                onClick={() => navigate(plan.name === "Templates" ? "/templates" : "/signup")}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Need a custom solution for your enterprise?</p>
          <Button variant="link" onClick={() => navigate("/enterprise")}>
            Contact us about enterprise plans →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
