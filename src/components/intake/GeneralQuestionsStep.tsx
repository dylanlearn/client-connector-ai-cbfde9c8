
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IntakeFormData } from "@/types/intake-form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Improved props with canProceed/setCanProceed for validation and navigation
interface GeneralQuestionsStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isSaving?: boolean;
  canProceed: boolean;
  setCanProceed: (valid: boolean) => void;
}

// Validation schema for form
const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  projectDescription: z.string().min(10, {
    message: "Please provide a more detailed description (at least 10 characters).",
  }),
  targetAudience: z.string().min(5, {
    message: "Please describe your target audience (at least 5 characters).",
  }),
  launchDate: z.string().optional(),
});

const GeneralQuestionsStep = ({ formData, updateFormData, onNext, onPrevious, isSaving, canProceed, setCanProceed }: GeneralQuestionsStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: formData.projectName || "",
      projectDescription: formData.projectDescription || "",
      targetAudience: formData.targetAudience || "",
      launchDate: formData.launchDate || "",
    },
    mode: "onChange"
  });

  // Update formData and canProceed state as values change
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      updateFormData(value);
      // Validation logic
      const valid = formSchema.safeParse(value).success;
      setCanProceed(valid);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, [form, updateFormData, setCanProceed]);

  // On initial mount, set validity
  useEffect(() => {
    setCanProceed(form.formState.isValid);
    // eslint-disable-next-line
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData(values);
    toast({
      description: "General project details have been updated."
    });
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-label="General Project Details">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Website" {...field} aria-required="true" aria-label="Project Name" />
              </FormControl>
              <FormDescription>
                What would you like to call your project?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what you're trying to achieve with this website..."
                  className="resize-none"
                  rows={4}
                  {...field}
                  aria-required="true"
                  aria-label="Project Description"
                />
              </FormControl>
              <FormDescription>
                Provide a brief overview of your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Who will be using your website? What are their needs?"
                  className="resize-none"
                  rows={3}
                  {...field}
                  aria-required="true"
                  aria-label="Target Audience"
                />
              </FormControl>
              <FormDescription>
                Understanding your audience helps us tailor the design.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="launchDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Launch Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} aria-label="Expected Launch Date" />
              </FormControl>
              <FormDescription>
                When are you planning to launch your website?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row justify-between pt-4 gap-2" role="group" aria-label="Navigation">
          <Button type="button" variant="outline" onClick={onPrevious} aria-label="Back">
            Back
          </Button>
          <Button type="submit" disabled={!canProceed || isSaving} aria-label="Continue to next step">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralQuestionsStep;
