
import { IntakeFormData } from "@/types/intake-form";
import { z } from "zod";

// Map site type to a user-friendly name
export const getSiteTypeName = (siteType: string): string => {
  const siteTypeMap: Record<string, string> = {
    saas: "SaaS",
    ecommerce: "E-commerce",
    business: "Business",
    portfolio: "Portfolio",
  };
  
  return siteTypeMap[siteType] || "Website";
};

// Base schema for all site types
const baseSchema = z.object({
  mainFeatures: z.string().min(1, "Please describe your main features"),
  competitors: z.string().optional(),
});

// SaaS specific schema
const saasSchema = baseSchema.extend({
  userAccountsRequired: z.boolean().default(true),
  pricingTiers: z.string().min(1, "Please describe your pricing tiers"),
  freeTrialOffered: z.boolean().default(false),
});

// E-commerce specific schema
const ecommerceSchema = baseSchema.extend({
  estimatedProducts: z.string().min(1, "Please specify how many products"),
  paymentProcessors: z.string().min(1, "Please specify payment processors"),
  shippingIntegration: z.boolean().default(false),
  customQuestions: z.array(z.string()).optional(),
});

// Business specific schema
const businessSchema = baseSchema.extend({
  serviceOfferings: z.string().min(1, "Please list your services"),
  contactFormRequired: z.boolean().default(true),
  hasPhysicalLocation: z.boolean().default(false),
});

// Portfolio specific schema
const portfolioSchema = baseSchema.extend({
  projectCategories: z.string().min(1, "Please list your project categories"),
  contactInformation: z.string().min(1, "Please provide contact information"),
  resumeUploadRequired: z.boolean().default(false),
});

// Get schema based on site type
export const getFormSchema = (siteType: string) => {
  switch (siteType) {
    case "saas":
      return saasSchema;
    case "ecommerce":
      return ecommerceSchema;
    case "business":
      return businessSchema;
    case "portfolio":
      return portfolioSchema;
    default:
      return baseSchema;
  }
};

// Get default values based on site type and existing form data
export const getDefaultValues = (siteType: string, formData: IntakeFormData) => {
  const baseValues = {
    mainFeatures: formData.mainFeatures || "",
    competitors: formData.competitors || "",
  };

  switch (siteType) {
    case "saas":
      return {
        ...baseValues,
        userAccountsRequired: formData.userAccountsRequired === undefined ? true : !!formData.userAccountsRequired,
        pricingTiers: formData.pricingTiers || "",
        freeTrialOffered: formData.freeTrialOffered === undefined ? false : !!formData.freeTrialOffered,
      };
    case "ecommerce":
      return {
        ...baseValues,
        estimatedProducts: formData.estimatedProducts || "",
        paymentProcessors: formData.paymentProcessors || "",
        shippingIntegration: formData.shippingIntegration === undefined ? false : !!formData.shippingIntegration,
        customQuestions: formData.customQuestions || [],
      };
    case "business":
      return {
        ...baseValues,
        serviceOfferings: formData.serviceOfferings || "",
        contactFormRequired: formData.contactFormRequired === undefined ? true : !!formData.contactFormRequired,
        hasPhysicalLocation: formData.hasPhysicalLocation === undefined ? false : !!formData.hasPhysicalLocation,
      };
    case "portfolio":
      return {
        ...baseValues,
        projectCategories: formData.projectCategories || "",
        contactInformation: formData.contactInformation || "",
        resumeUploadRequired: formData.resumeUploadRequired === undefined ? false : !!formData.resumeUploadRequired,
      };
    default:
      return baseValues;
  }
};
