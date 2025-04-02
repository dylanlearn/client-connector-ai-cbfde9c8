
import { z } from "zod";
import { IntakeFormData } from "@/types/intake-form";

// Define the schema for different site types
export const getFormSchema = (siteType: string) => {
  const baseSchema = z.object({
    projectName: z.string().min(2, "Project name must be at least 2 characters"),
    projectDescription: z.string().min(2, "Project description must be at least 2 characters"),
    targetAudience: z.string().min(2, "Target audience must be at least 2 characters"),
  });

  switch (siteType) {
    case "saas":
      return baseSchema.extend({
        mainFeatures: z.string().min(10, "Please describe your main features"),
        pricingTiers: z.string().optional(),
        competitors: z.string().optional(),
        userAccountsRequired: z.boolean().optional(),
      });
    case "ecommerce":
      return baseSchema.extend({
        estimatedProducts: z.string().min(2, "Product information must be at least 2 characters"),
        paymentProcessors: z.string().optional(),
        shippingIntegration: z.boolean().optional(),
        customQuestions: z.array(z.string()).optional(),
      });
    case "business":
      return baseSchema.extend({
        serviceOfferings: z.string().min(10, "Please describe your services"),
        contactFormRequired: z.boolean().optional(),
        hasPhysicalLocation: z.boolean().optional(),
        mainFeatures: z.string().optional(),
      });
    case "portfolio":
      return baseSchema.extend({
        projectCategories: z.string().min(2, "Project categories must be at least 2 characters"),
        contactInformation: z.string().optional(),
        resumeUploadRequired: z.boolean().optional(),
        mainFeatures: z.string().optional(),
      });
    default:
      return baseSchema;
  }
};

// Get default values for the form based on site type and existing form data
export const getDefaultValues = (siteType: string, formData: IntakeFormData) => {
  const baseDefaults = {
    projectName: formData.projectName || "",
    projectDescription: formData.projectDescription || "",
    targetAudience: formData.targetAudience || "",
  };

  switch (siteType) {
    case "saas":
      return {
        ...baseDefaults,
        mainFeatures: formData.mainFeatures || "",
        pricingTiers: formData.pricingTiers || "",
        competitors: formData.competitors || "",
        userAccountsRequired: formData.userAccountsRequired || false,
      };
    case "ecommerce":
      return {
        ...baseDefaults,
        estimatedProducts: formData.estimatedProducts || "",
        paymentProcessors: formData.paymentProcessors || "",
        shippingIntegration: formData.shippingIntegration || false,
        customQuestions: formData.customQuestions || [],
      };
    case "business":
      return {
        ...baseDefaults,
        serviceOfferings: formData.serviceOfferings || "",
        contactFormRequired: formData.contactFormRequired || false,
        hasPhysicalLocation: formData.hasPhysicalLocation || false,
        mainFeatures: formData.mainFeatures || "",
      };
    case "portfolio":
      return {
        ...baseDefaults,
        projectCategories: formData.projectCategories || "",
        contactInformation: formData.contactInformation || "",
        resumeUploadRequired: formData.resumeUploadRequired || false,
        mainFeatures: formData.mainFeatures || "",
      };
    default:
      return baseDefaults;
  }
};

// Get a human-readable name for the site type
export const getSiteTypeName = (siteType: string): string => {
  switch (siteType) {
    case "saas":
      return "SaaS";
    case "ecommerce":
      return "E-Commerce";
    case "business":
      return "Business";
    case "portfolio":
      return "Portfolio";
    default:
      return siteType.charAt(0).toUpperCase() + siteType.slice(1);
  }
};
