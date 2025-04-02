
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import TooltipHelper from "../TooltipHelper";

interface BaseFieldsProps {
  form: UseFormReturn<any>;
  showTooltips?: boolean;
  aiPowered?: boolean;
}

const BaseFields = ({ form, showTooltips = false, aiPowered = false }: BaseFieldsProps) => {
  const exampleAnswers = {
    mainFeatures: "User authentication, profile management, content publishing, analytics dashboard, social sharing capabilities",
    competitors: "Website A offers similar services but lacks mobile responsiveness. Website B has better analytics but their UI is more complex."
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="mainFeatures"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
              <FormLabel>Main Features</FormLabel>
              {showTooltips && (
                <TooltipHelper 
                  content={<div className="font-normal italic text-xs">Example: {exampleAnswers.mainFeatures}</div>}
                  field="Main Features"
                  aiPowered={aiPowered}
                />
              )}
            </div>
            <FormDescription>
              What are the key features or functionality you want on your website?
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="List the most important features..."
                className="resize-none"
                rows={4}
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
            <div className="flex items-center">
              <FormLabel>Competitors</FormLabel>
              {showTooltips && (
                <TooltipHelper 
                  content={<div className="font-normal italic text-xs">Example: {exampleAnswers.competitors}</div>}
                  field="Competitors"
                  aiPowered={aiPowered}
                />
              )}
            </div>
            <FormDescription>
              List any competitors or similar websites that you like or want to reference.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Enter competitors or reference websites..."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BaseFields;
