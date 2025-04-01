
import { useState, useEffect } from "react";
import { Building, ShoppingCart, Briefcase, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IntakeFormData } from "@/types/intake-form";

interface SiteTypeStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
}

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

const SiteTypeStep = ({ formData, updateFormData, onNext }: SiteTypeStepProps) => {
  const [selectedType, setSelectedType] = useState<string>(formData.siteType || "");

  useEffect(() => {
    if (selectedType) {
      updateFormData({ siteType: selectedType });
    }
  }, [selectedType, updateFormData]);

  const handleContinue = () => {
    if (selectedType) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-4">
        Select the type of website you're looking to build. This helps us tailor the next questions specifically to your project.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {siteTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={`p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all ${
                selectedType === type.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${selectedType === type.id ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
                  <Icon className="h-6 w-6" />
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

      <div className="flex justify-end pt-4">
        <Button onClick={handleContinue} disabled={!selectedType}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SiteTypeStep;
