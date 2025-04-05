import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function StyleGuideImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGenerateStyleGuide = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use the AI style guide generator.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-style-guide", {
        body: { userId: user.id },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Style guide generated",
        description: "Your AI style guide has been generated successfully.",
      });

      // In a real app, you might want to return the generated style guide URL
      // and open it in a new tab or display it in a modal
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error generating style guide:", error);
      toast({
        title: "Failed to generate style guide",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerateStyleGuide}
      disabled={isGenerating}
    >
      <Sparkles className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Generate Style Guide"}
    </Button>
  );
}
