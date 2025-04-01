
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IntakeFormData } from "@/types/intake-form";
import { getFormSchema, getDefaultValues } from "./schema/formSchemas";
import { getSiteTypeName } from "./site-types/SiteTypeUtils";
import SaasFields from "./site-types/SaasFields";
import EcommerceFields from "./site-types/EcommerceFields";
import BusinessFields from "./site-types/BusinessFields";
import PortfolioFields from "./site-types/PortfolioFields";
import BaseFields from "./site-types/BaseFields";

interface SpecificQuestionsStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SpecificQuestionsStep = ({ formData, updateFormData, onNext, onPrevious }: SpecificQuestionsStepProps) => {
  const siteType = formData.siteType || "business";
  const schema = getFormSchema(siteType);
  
  // Set up form with the schema type
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(siteType, formData),
  });

  // Save form data in real-time as fields change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).some(v => v !== undefined)) {
        updateFormData(value as Partial<IntakeFormData>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  function onSubmit(values: any) {
    updateFormData(values);
    onNext();
  }

  // Render the appropriate fields based on site type
  const renderSiteTypeFields = () => {
    switch (siteType) {
      case "saas":
        return <SaasFields form={form} />;
      case "ecommerce":
        return <EcommerceFields form={form} />;
      case "business":
        return <BusinessFields form={form} />;
      case "portfolio":
        return <PortfolioFields form={form} />;
      default:
        return <BaseFields form={form} />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-sm text-gray-600 mb-4">
          These questions are tailored to your {getSiteTypeName(siteType)} project. Please provide as much detail as possible.
        </div>
        
        {renderSiteTypeFields()}

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
