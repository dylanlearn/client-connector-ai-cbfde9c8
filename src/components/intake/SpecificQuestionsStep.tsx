
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { IntakeFormData } from "@/types/intake-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import SaasFields from "./site-types/SaasFields";
import EcommerceFields from "./site-types/EcommerceFields";
import BusinessFields from "./site-types/BusinessFields";
import PortfolioFields from "./site-types/PortfolioFields";
import BaseFields from "./site-types/BaseFields";
import { getFormSchema, getDefaultValues, getSiteTypeName } from "./utils/form-helpers";

interface SpecificQuestionsStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isSaving?: boolean;
}

const SpecificQuestionsStep = ({ formData, updateFormData, onNext, onPrevious, isSaving }: SpecificQuestionsStepProps) => {
  const siteType = formData.siteType || "business";
  const schema = getFormSchema(siteType);
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(siteType, formData),
  });

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
