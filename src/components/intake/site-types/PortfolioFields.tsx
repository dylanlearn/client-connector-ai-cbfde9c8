
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import BaseFields from "./BaseFields";

interface PortfolioFieldsProps {
  form: UseFormReturn<any>;
}

const PortfolioFields = ({ form }: PortfolioFieldsProps) => {
  return (
    <>
      <BaseFields form={form} />
      
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

export default PortfolioFields;
