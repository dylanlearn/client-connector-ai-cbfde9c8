
import { IntakeFormData } from "@/types/intake-form";
import { 
  baseObjectSchema, 
  saasSchema, 
  ecommerceSchema, 
  businessSchema, 
  portfolioSchema 
} from "../schema/formSchemas";

/**
 * Returns the appropriate Zod schema based on site type
 */
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

/**
 * Returns default values for the form based on site type and existing data
 */
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

/**
 * Returns a human-readable site type name
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
