
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { IntakeFormData } from "@/types/intake-form";
import SiteTypeFields from "./site-type-fields/SiteTypeFields";
import { getFormSchema, getDefaultValues, getSiteTypeName } from "./utils/form-helpers";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface SpecificQuestionsStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isSaving?: boolean;
}

const SpecificQuestionsStep = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrevious, 
  isSaving 
}: SpecificQuestionsStepProps) => {
  const siteType = formData.siteType || "business";
  const schema = getFormSchema(siteType);
  const [showTooltips, setShowTooltips] = useState(false);
  const [aiPowered, setAiPowered] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(siteType, formData),
  });

  // Set up form field watching
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).some(v => v !== undefined)) {
        updateFormData(value as Partial<IntakeFormData>);
      }
    });
    return () => {
      subscription?.unsubscribe?.();
    };
  }, [form, updateFormData]);

  const onSubmit = (values: any) => {
    updateFormData(values);
    onNext();
  };

  const handleAIToggle = (enabled: boolean) => {
    setAiPowered(enabled);
    if (enabled) {
      toast({
        title: "AI-powered tooltips enabled",
        description: "Hover over the info icons to see AI-generated example answers",
        duration: 3000,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-sm text-gray-600 mb-4">
          These questions are tailored to your {getSiteTypeName(siteType)} project. Please provide as much detail as possible.
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-examples" className="text-sm text-gray-500">
              Show example answers
            </Label>
            <Switch
              id="show-examples"
              checked={showTooltips}
              onCheckedChange={setShowTooltips}
            />
          </div>
          
          {showTooltips && (
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Label htmlFor="ai-powered" className="text-sm text-gray-500">
                AI-powered examples
              </Label>
              <Switch
                id="ai-powered"
                checked={aiPowered}
                onCheckedChange={handleAIToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )}
        </div>
        
        <SiteTypeFields 
          siteType={siteType} 
          form={form} 
          showTooltips={showTooltips}
          aiPowered={aiPowered && showTooltips}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default SpecificQuestionsStep;
