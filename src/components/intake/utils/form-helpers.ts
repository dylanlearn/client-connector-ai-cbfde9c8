
import { z } from "zod";
import { IntakeFormData } from "@/types/intake-form";

// Define the schema for different site types
export const getFormSchema = (siteType: string) => {
  const baseSchema = z.object({
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    industry: z.string().min(2, "Industry must be at least 2 characters"),
    targetAudience: z.string().min(2, "Target audience must be at least 2 characters"),
  });

  switch (siteType) {
    case "saas":
      return baseSchema.extend({
        productFeatures: z.string().min(10, "Please describe your product features"),
        subscriptionModel: z.string().optional(),
        competitorUrls: z.string().optional(),
        demoAccount: z.boolean().optional(),
      });
    case "ecommerce":
      return baseSchema.extend({
        productCategories: z.string().min(2, "Product categories must be at least 2 characters"),
        shippingDetails: z.string().optional(),
        paymentOptions: z.string().optional(),
        inventorySize: z.string().optional(),
      });
    case "business":
      return baseSchema.extend({
        services: z.string().min(10, "Please describe your services"),
        companyHistory: z.string().optional(),
        teamSize: z.string().optional(),
        locationsServed: z.string().optional(),
      });
    case "portfolio":
      return baseSchema.extend({
        workCategories: z.string().min(2, "Work categories must be at least 2 characters"),
        projectHighlights: z.string().optional(),
        careerGoals: z.string().optional(),
        awards: z.string().optional(),
      });
    default:
      return baseSchema;
  }
};

// Get default values for the form based on site type and existing form data
export const getDefaultValues = (siteType: string, formData: IntakeFormData) => {
  const baseDefaults = {
    businessName: formData.businessName || "",
    industry: formData.industry || "",
    targetAudience: formData.targetAudience || "",
  };

  switch (siteType) {
    case "saas":
      return {
        ...baseDefaults,
        productFeatures: formData.productFeatures || "",
        subscriptionModel: formData.subscriptionModel || "",
        competitorUrls: formData.competitorUrls || "",
        demoAccount: formData.demoAccount || false,
      };
    case "ecommerce":
      return {
        ...baseDefaults,
        productCategories: formData.productCategories || "",
        shippingDetails: formData.shippingDetails || "",
        paymentOptions: formData.paymentOptions || "",
        inventorySize: formData.inventorySize || "",
      };
    case "business":
      return {
        ...baseDefaults,
        services: formData.services || "",
        companyHistory: formData.companyHistory || "",
        teamSize: formData.teamSize || "",
        locationsServed: formData.locationsServed || "",
      };
    case "portfolio":
      return {
        ...baseDefaults,
        workCategories: formData.workCategories || "",
        projectHighlights: formData.projectHighlights || "",
        careerGoals: formData.careerGoals || "",
        awards: formData.awards || "",
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
