
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BaseFormSchema } from "../schema/formSchemas";

interface BaseFieldsProps {
  form: UseFormReturn<any>;
}

const BaseFields = ({ form }: BaseFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="mainFeatures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Features</FormLabel>
            <FormControl>
              <Textarea
                placeholder="What are the key features you need for your site?"
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
    </>
  );
};

export default BaseFields;
