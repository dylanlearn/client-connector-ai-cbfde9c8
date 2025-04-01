
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IntakeFormData } from "@/types/intake-form";

interface SpecificQuestionsStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Dynamic schema based on site type
const getFormSchema = (siteType: string) => {
  const baseSchema = {
    mainFeatures: z.string().min(1, "Please list your main features"),
    competitors: z.string().optional(),
  };

  switch (siteType) {
    case "saas":
      return z.object({
        ...baseSchema,
        userAccountsRequired: z.boolean().default(true),
        pricingTiers: z.string().min(1, "Please describe your pricing tiers"),
        freeTrialOffered: z.boolean().default(false),
      });
    case "ecommerce":
      return z.object({
        ...baseSchema,
        estimatedProducts: z.string().min(1, "Please specify how many products"),
        paymentProcessors: z.string().min(1, "Please specify payment processors"),
        shippingIntegration: z.boolean().default(false),
      });
    case "business":
      return z.object({
        ...baseSchema,
        contactFormRequired: z.boolean().default(true),
        hasPhysicalLocation: z.boolean().default(false),
        serviceOfferings: z.string().min(1, "Please list your services"),
      });
    case "portfolio":
      return z.object({
        ...baseSchema,
        projectCategories: z.string().min(1, "Please list your project categories"),
        contactInformation: z.string().min(1, "Please provide contact information"),
        resumeUploadRequired: z.boolean().default(false),
      });
    default:
      return z.object(baseSchema);
  }
};

const SpecificQuestionsStep = ({ formData, updateFormData, onNext, onPrevious }: SpecificQuestionsStepProps) => {
  const siteType = formData.siteType || "business";
  const schema = getFormSchema(siteType);
  
  // Dynamically set default values based on site type and existing data
  const getDefaultValues = () => {
    const baseValues = {
      mainFeatures: formData.mainFeatures || "",
      competitors: formData.competitors || "",
    };

    switch (siteType) {
      case "saas":
        return {
          ...baseValues,
          userAccountsRequired: formData.userAccountsRequired !== undefined ? formData.userAccountsRequired : true,
          pricingTiers: formData.pricingTiers || "",
          freeTrialOffered: formData.freeTrialOffered !== undefined ? formData.freeTrialOffered : false,
        };
      case "ecommerce":
        return {
          ...baseValues,
          estimatedProducts: formData.estimatedProducts || "",
          paymentProcessors: formData.paymentProcessors || "",
          shippingIntegration: formData.shippingIntegration !== undefined ? formData.shippingIntegration : false,
        };
      case "business":
        return {
          ...baseValues,
          contactFormRequired: formData.contactFormRequired !== undefined ? formData.contactFormRequired : true,
          hasPhysicalLocation: formData.hasPhysicalLocation !== undefined ? formData.hasPhysicalLocation : false,
          serviceOfferings: formData.serviceOfferings || "",
        };
      case "portfolio":
        return {
          ...baseValues,
          projectCategories: formData.projectCategories || "",
          contactInformation: formData.contactInformation || "",
          resumeUploadRequired: formData.resumeUploadRequired !== undefined ? formData.resumeUploadRequired : false,
        };
      default:
        return baseValues;
    }
  };

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
  });

  // Save form data in real-time as fields change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).some(v => v !== undefined)) {
        updateFormData(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  function onSubmit(values: any) {
    updateFormData(values);
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-sm text-gray-600 mb-4">
          These questions are tailored to your {getSiteTypeName(siteType)} project. Please provide as much detail as possible.
        </div>
        
        <FormField
          control={form.control}
          name="mainFeatures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Features</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`What are the key features you need for your ${getSiteTypeName(siteType)}?`}
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="competitors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Competitors or Inspiration</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Are there any similar websites you like or want to compete with?"
                  className="resize-none"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional fields based on site type */}
        {siteType === "saas" && (
          <>
            <FormField
              control={form.control}
              name="userAccountsRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">User Accounts</FormLabel>
                    <FormDescription>
                      Will users need to create accounts?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricingTiers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Tiers</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your pricing structure (e.g., Free, Pro, Enterprise)"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="freeTrialOffered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Free Trial</FormLabel>
                    <FormDescription>
                      Will you offer a free trial period?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {siteType === "ecommerce" && (
          <>
            <FormField
              control={form.control}
              name="estimatedProducts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Products</FormLabel>
                  <FormControl>
                    <Input placeholder="How many products will you sell?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentProcessors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Processors</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Stripe, PayPal, Square" {...field} />
                  </FormControl>
                  <FormDescription>
                    Which payment processors would you like to use?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingIntegration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Shipping Integration</FormLabel>
                    <FormDescription>
                      Do you need real-time shipping calculations?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {siteType === "business" && (
          <>
            <FormField
              control={form.control}
              name="serviceOfferings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Offerings</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the services your business provides"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactFormRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Contact Form</FormLabel>
                    <FormDescription>
                      Do you need a contact form?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasPhysicalLocation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Physical Location</FormLabel>
                    <FormDescription>
                      Does your business have a physical location?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {siteType === "portfolio" && (
          <>
            <FormField
              control={form.control}
              name="projectCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Categories</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Design, Photography, Development"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How would you like to categorize your work?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInformation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What contact information would you like to display?"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resumeUploadRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Resume/CV</FormLabel>
                    <FormDescription>
                      Do you want to include your resume or CV?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

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

function getSiteTypeName(siteType: string): string {
  switch (siteType) {
    case "saas":
      return "SaaS Product";
    case "ecommerce":
      return "E-Commerce";
    case "business":
      return "Business Website";
    case "portfolio":
      return "Portfolio";
    default:
      return "Website";
  }
}

export default SpecificQuestionsStep;
