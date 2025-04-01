
import { z } from "zod";

// Base fields that all site types have
export const baseSchema = {
  mainFeatures: z.string().min(1, "Please list your main features"),
  competitors: z.string().optional(),
};

// Create a proper Zod object for the base schema to use for type inference
export const baseObjectSchema = z.object(baseSchema);

// SaaS specific schema
export const saasSchema = z.object({
  ...baseSchema,
  userAccountsRequired: z.boolean().default(true),
  pricingTiers: z.string().min(1, "Please describe your pricing tiers"),
  freeTrialOffered: z.boolean().default(false),
});

// E-commerce specific schema
export const ecommerceSchema = z.object({
  ...baseSchema,
  estimatedProducts: z.string().min(1, "Please specify how many products"),
  paymentProcessors: z.string().min(1, "Please specify payment processors"),
  shippingIntegration: z.boolean().default(false),
});

// Business specific schema
export const businessSchema = z.object({
  ...baseSchema,
  serviceOfferings: z.string().min(1, "Please list your services"),
  contactFormRequired: z.boolean().default(true),
  hasPhysicalLocation: z.boolean().default(false),
});

// Portfolio specific schema
export const portfolioSchema = z.object({
  ...baseSchema,
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
      return baseObjectSchema;
  }
};

// Export schema types
export type SaasFormSchema = z.infer<typeof saasSchema>;
export type EcommerceFormSchema = z.infer<typeof ecommerceSchema>;
export type BusinessFormSchema = z.infer<typeof businessSchema>;
export type PortfolioFormSchema = z.infer<typeof portfolioSchema>;
export type BaseFormSchema = z.infer<typeof baseObjectSchema>;

// Get type-safe default values based on site type and existing data
export const getDefaultValues = (siteType: string, formData: any) => {
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
