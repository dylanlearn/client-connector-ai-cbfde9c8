
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import BaseFields from "./BaseFields";
import TooltipHelper from "../TooltipHelper";

interface BusinessFieldsProps {
  form: UseFormReturn<any>;
  showTooltips?: boolean;
  aiPowered?: boolean;
}

const BusinessFields = ({ form, showTooltips = false, aiPowered = false }: BusinessFieldsProps) => {
  const exampleAnswers = {
    serviceOfferings: "Website design, SEO optimization, content creation, branding, logo design, monthly website maintenance"
  };

  return (
    <>
      <BaseFields form={form} showTooltips={showTooltips} aiPowered={aiPowered} />
      
      <FormField
        control={form.control}
        name="serviceOfferings"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
              <FormLabel>Service Offerings</FormLabel>
              {showTooltips && (
                <TooltipHelper 
                  content={<div className="font-normal italic text-xs">Example: {exampleAnswers.serviceOfferings}</div>}
                  field="Service Offerings"
                  aiPowered={aiPowered}
                />
              )}
            </div>
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
                checked={!!field.value}
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
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default BusinessFields;
