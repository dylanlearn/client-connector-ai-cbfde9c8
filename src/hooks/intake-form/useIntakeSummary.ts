
import { useState, useCallback } from "react";
import { IntakeSummaryResult, IntakeSummaryService } from "@/services/ai/summary/intake-summary-service";
import { IntakeFormData } from "@/types/intake-form";
import { useToast } from "@/components/ui/use-toast";

export const useIntakeSummary = (formData: IntakeFormData) => {
  const [summaryResult, setSummaryResult] = useState<IntakeSummaryResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSummary = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const result = await IntakeSummaryService.summarizeIntakeForm(formData);
      setSummaryResult(result);
      return result;
    } catch (error) {
      console.error("Error generating intake summary:", error);
      toast({
        variant: "destructive",
        title: "Summary Generation Failed",
        description: "We couldn't generate your summary. Please try again later."
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [formData, toast]);

  const regenerateSummary = useCallback(async () => {
    const toastId = toast({
      title: "Regenerating Summary",
      description: "Processing intake data with AI...",
    });

    const result = await generateSummary();
    
    if (result) {
      toast({
        title: "Summary Regenerated",
        description: "Your AI-generated summary has been updated.",
      });
    }
  }, [generateSummary, toast]);

  return {
    summaryResult,
    isGenerating,
    generateSummary,
    regenerateSummary
  };
};
