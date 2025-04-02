
import { z } from "zod";
import { IntakeFormData } from "@/types/intake-form";

/**
 * Returns a human-readable name for the site type
 */
export const getSiteTypeName = (siteType: string): string => {
  switch (siteType) {
    case "saas":
      return "SaaS";
    case "ecommerce":
      return "E-commerce";
    case "business":
      return "Business";
    case "portfolio":
      return "Portfolio";
    default:
      return "Website";
  }
};

/**
 * Returns the form schema for the specific site type
 */
export const getFormSchema = (siteType: string): any => {
  // Base schema for all site types
  const baseSchema = z.object({
    mainFeatures: z.string().optional(),
    competitors: z.string().optional(),
  });

  // Add fields based on site type
  switch (siteType) {
    case "saas":
      return baseSchema.extend({
        userAccountsRequired: z.boolean().optional(),
        pricingTiers: z.string().optional(),
        freeTrialOffered: z.boolean().optional(),
      });
    case "ecommerce":
      return baseSchema.extend({
        estimatedProducts: z.string().optional(),
        paymentProcessors: z.string().optional(),
        shippingIntegration: z.boolean().optional(),
      });
    case "business":
      return baseSchema.extend({
        serviceOfferings: z.string().optional(),
        contactFormRequired: z.boolean().optional(),
        hasPhysicalLocation: z.boolean().optional(),
      });
    case "portfolio":
      return baseSchema.extend({
        projectCategories: z.string().optional(),
        contactInformation: z.string().optional(),
        resumeUploadRequired: z.boolean().optional(),
      });
    default:
      return baseSchema;
  }
};

/**
 * Returns default values for the form based on site type and existing form data
 */
export const getDefaultValues = (siteType: string, formData: IntakeFormData): any => {
  // Base default values for all site types
  const baseDefaults = {
    mainFeatures: formData.mainFeatures || "",
    competitors: formData.competitors || "",
  };

  // Add fields based on site type
  switch (siteType) {
    case "saas":
      return {
        ...baseDefaults,
        userAccountsRequired: formData.userAccountsRequired !== undefined ? formData.userAccountsRequired : false,
        pricingTiers: formData.pricingTiers || "",
        freeTrialOffered: formData.freeTrialOffered !== undefined ? formData.freeTrialOffered : false,
      };
    case "ecommerce":
      return {
        ...baseDefaults,
        estimatedProducts: formData.estimatedProducts || "",
        paymentProcessors: formData.paymentProcessors || "",
        shippingIntegration: formData.shippingIntegration !== undefined ? formData.shippingIntegration : false,
      };
    case "business":
      return {
        ...baseDefaults,
        serviceOfferings: formData.serviceOfferings || "",
        contactFormRequired: formData.contactFormRequired !== undefined ? formData.contactFormRequired : false,
        hasPhysicalLocation: formData.hasPhysicalLocation !== undefined ? formData.hasPhysicalLocation : false,
      };
    case "portfolio":
      return {
        ...baseDefaults,
        projectCategories: formData.projectCategories || "",
        contactInformation: formData.contactInformation || "",
        resumeUploadRequired: formData.resumeUploadRequired !== undefined ? formData.resumeUploadRequired : false,
      };
    default:
      return baseDefaults;
  }
};
