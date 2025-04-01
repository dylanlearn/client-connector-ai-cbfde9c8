
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import BaseFields from "./BaseFields";

interface EcommerceFieldsProps {
  form: UseFormReturn<any>;
}

const EcommerceFields = ({ form }: EcommerceFieldsProps) => {
  return (
    <>
      <BaseFields form={form} />
      
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

export default EcommerceFields;
