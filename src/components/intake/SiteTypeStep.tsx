
import { useState, useEffect } from "react";
import { Building, ShoppingCart, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IntakeFormData } from "@/types/intake-form";
import { toast } from "@/hooks/use-toast";

// Improved props (added canProceed/setCanProceed)
interface SiteTypeStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isSaving?: boolean;
  canProceed: boolean;
  setCanProceed: (valid: boolean) => void;
}

// ARIA enhancements: Each card is a button for selection, with role/radio-group for accessibility
const siteTypes = [
  {
    id: "saas",
    name: "SaaS Product",
    description: "Web application with user accounts and subscription model",
    icon: Building,
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    description: "Online store to sell products or services",
    icon: ShoppingCart,
  },
  {
    id: "business",
    name: "Business Website",
    description: "Professional site to represent your business online",
    icon: Briefcase,
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your work, skills or personal brand",
    icon: BookOpen,
  },
];

const SiteTypeStep = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
  isSaving,
  canProceed,
  setCanProceed
}: SiteTypeStepProps) => {
  const [selectedType, setSelectedType] = useState<string>(formData.siteType || "");

  useEffect(() => {
    setCanProceed(!!selectedType);
    if (selectedType && selectedType !== formData.siteType) {
      updateFormData({ siteType: selectedType });
    }
    // eslint-disable-next-line
  }, [selectedType]);

  // On mount, set validity
  useEffect(() => {
    setCanProceed(!!selectedType);
    // eslint-disable-next-line
  }, []);

  const handleContinue = () => {
    if (selectedType) {
      onNext();
      toast({
        description: `You selected ${siteTypes.find(t => t.id === selectedType)?.name}`
      });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Select the type of website you're looking to build. This helps us tailor the next questions specifically to your project.
      </p>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        role="radiogroup"
        aria-label="Site Types"
      >
        {siteTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={`p-4 w-full text-left flex flex-col justify-between border cursor-pointer transition-all duration-150 outline-none focus:ring-2 focus:ring-primary focus:border-primary ${selectedType === type.id ? "border-primary bg-primary/5" : ""}`}
              aria-checked={selectedType === type.id}
              aria-label={type.name}
              tabIndex={0}
              role="radio"
              onClick={() => {
                setSelectedType(type.id);
                setCanProceed(true);
                toast({
                  description: `You selected ${type.name}`
                });
              }}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedType(type.id);
                  setCanProceed(true);
                }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${selectedType === type.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium">{type.name}</h3>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          aria-label="Back"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedType || isSaving}
          aria-label={selectedType ? "Continue" : "Select a site type to continue"}
        >
          Continue
        </Button>
      </div>
      {/* a11y: Auto-save state */}
      <div className="text-sm text-gray-500 mt-2" aria-live="polite">
        {isSaving ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          <span>Changes auto-saved</span>
        )}
      </div>
    </div>
  );
};

export default SiteTypeStep;
