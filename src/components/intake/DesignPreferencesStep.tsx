
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IntakeFormData } from "@/types/intake-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { StyleGuideImageGenerator } from "@/components/design/StyleGuideImageGenerator";

interface DesignPreferencesStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isSaving?: boolean;
}

const formSchema = z.object({
  designStyle: z.enum(["minimal", "bold", "classic", "custom"], {
    required_error: "Please select a design style",
  }),
  colorPreferences: z.string().optional(),
  logoUpload: z.boolean().default(false),
  existingBranding: z.boolean().default(false),
  inspiration: z.string().optional(),
  additionalNotes: z.string().optional(),
});

const DesignPreferencesStep = ({ formData, updateFormData, onNext, onPrevious, isSaving }: DesignPreferencesStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      designStyle: (formData.designStyle as any) || "minimal",
      colorPreferences: formData.colorPreferences || "",
      logoUpload: formData.logoUpload !== undefined ? formData.logoUpload : false,
      existingBranding: formData.existingBranding !== undefined ? formData.existingBranding : false,
      inspiration: formData.inspiration || "",
      additionalNotes: formData.additionalNotes || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).some(v => v !== undefined)) {
        updateFormData(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values);
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Design Preferences</h2>
          <StyleGuideImageGenerator />
        </div>

        <FormField
          control={form.control}
          name="designStyle"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Design Style</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="minimal" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Minimal & Modern - Clean, spacious, with plenty of whitespace
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="bold" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Bold & Dynamic - Eye-catching, vibrant, with strong visual elements
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="classic" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Professional & Classic - Timeless, refined, and trusted feel
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="custom" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Completely Custom - I'll describe my preferences below
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Preferences</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your color preferences (e.g., 'blues and grays' or specific hex codes)"
                  className="resize-none"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any specific colors you want to use or avoid?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="logoUpload"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Logo</FormLabel>
                  <FormDescription>
                    Do you have a logo to upload?
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
            name="existingBranding"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Existing Branding</FormLabel>
                  <FormDescription>
                    Do you have existing brand guidelines?
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
        </div>

        <FormField
          control={form.control}
          name="inspiration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inspiration</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share URLs of websites you like the look and feel of"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Examples help us understand your visual preferences
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Design Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any other design preferences not covered above?"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default DesignPreferencesStep;
