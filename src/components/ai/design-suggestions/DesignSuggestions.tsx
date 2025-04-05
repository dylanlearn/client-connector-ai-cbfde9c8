
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StyleGuideImageGenerator } from "@/components/design/StyleGuideImageGenerator";
import SuggestionForm from "./SuggestionForm";
import SuggestionResult from "./SuggestionResult";
import { FormValues, SuggestionsResponse } from "./types";

const DesignSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use the AI design suggestions feature.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuggestions(null);
    setCurrentPrompt(values.prompt);

    try {
      // Determine the actual industry and style to send to the API
      const finalIndustry = values.industry === "other" ? values.industryCustom : values.industry;
      const finalStyle = values.style === "other" ? values.styleCustom : values.style;

      const { data, error } = await supabase.functions.invoke<SuggestionsResponse>("design-suggestions", {
        body: {
          prompt: values.prompt,
          industry: finalIndustry || undefined,
          style: finalStyle || undefined,
        },
      });

      if (error) {
        throw error;
      }

      setSuggestions(data.suggestions);
      toast({
        title: "Suggestions generated",
        description: "AI design suggestions have been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Failed to generate suggestions",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI Design Suggestions</CardTitle>
          <CardDescription>
            Get intelligent design recommendations for your project by describing what you need.
          </CardDescription>
        </div>
        <StyleGuideImageGenerator />
      </CardHeader>
      <CardContent>
        <SuggestionForm onSubmit={handleSubmit} isLoading={isLoading} />
        <SuggestionResult suggestions={suggestions} prompt={currentPrompt || undefined} />
      </CardContent>
    </Card>
  );
};

export default DesignSuggestions;
