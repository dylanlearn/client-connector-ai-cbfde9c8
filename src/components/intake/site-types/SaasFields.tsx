
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import BaseFields from "./BaseFields";
import TooltipHelper from "../TooltipHelper";

interface SaasFieldsProps {
  form: UseFormReturn<any>;
  showTooltips?: boolean;
  aiPowered?: boolean;
}

const SaasFields = ({ form, showTooltips = false, aiPowered = false }: SaasFieldsProps) => {
  const exampleAnswers = {
    pricingTiers: "Free: Basic features, Pro ($29/mo): Advanced features, Enterprise ($99/mo): Custom solutions and priority support"
  };

  return (
    <>
      <BaseFields form={form} showTooltips={showTooltips} aiPowered={aiPowered} />
      
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
                checked={!!field.value}
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
            <div className="flex items-center">
              <FormLabel>Pricing Tiers</FormLabel>
              {showTooltips && (
                <TooltipHelper 
                  content={<div className="font-normal italic text-xs">Example: {exampleAnswers.pricingTiers}</div>}
                  field="Pricing Tiers"
                  aiPowered={aiPowered}
                />
              )}
            </div>
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

export default SaasFields;
