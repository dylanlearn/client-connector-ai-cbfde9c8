
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { FormValues } from "./types";
import { INDUSTRY_OPTIONS, STYLE_OPTIONS } from "./constants";

interface SuggestionFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isLoading: boolean;
}

const SuggestionForm = ({ onSubmit, isLoading }: SuggestionFormProps) => {
  const [showIndustryCustom, setShowIndustryCustom] = useState(false);
  const [showStyleCustom, setShowStyleCustom] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      prompt: "",
      industry: "",
      industryCustom: "",
      style: "",
      styleCustom: "",
    },
  });

  // Watch the industry and style fields to determine whether to show custom inputs
  const watchedIndustry = form.watch("industry");
  const watchedStyle = form.watch("style");

  useEffect(() => {
    setShowIndustryCustom(watchedIndustry === "other");
  }, [watchedIndustry]);

  useEffect(() => {
    setShowStyleCustom(watchedStyle === "other");
  }, [watchedStyle]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What design help do you need?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="E.g., I need a color scheme for a tech startup website that conveys innovation and trust."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showIndustryCustom && (
              <FormField
                control={form.control}
                name="industryCustom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe your industry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Design Style (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STYLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showStyleCustom && (
              <FormField
                control={form.control}
                name="styleCustom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Style</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe your design style" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating suggestions...
            </>
          ) : (
            "Generate Design Suggestions"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SuggestionForm;
