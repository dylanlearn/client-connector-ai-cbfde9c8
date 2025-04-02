
import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AIGeneratorService } from "@/services/ai";
import { Skeleton } from "@/components/ui/skeleton";

interface TooltipHelperProps {
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  field?: string;
  aiPowered?: boolean;
}

const TooltipHelper = ({ content, position = "top", field, aiPowered = false }: TooltipHelperProps) => {
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only fetch AI content if aiPowered is true and we have a field name
    if (aiPowered && field) {
      setIsLoading(true);
      
      const generateAIExample = async () => {
        try {
          const aiExample = await AIGeneratorService.generateContent({
            type: 'description',
            context: `Example answer for the field: ${field}`,
            maxLength: 150,
            tone: 'helpful'
          });
          
          setAiContent(aiExample);
        } catch (error) {
          console.error("Error generating AI example:", error);
          // Fallback to static content if AI generation fails
          setAiContent(null);
        } finally {
          setIsLoading(false);
        }
      };

      generateAIExample();
    }
  }, [aiPowered, field]);

  // Determine what content to show
  const displayContent = () => {
    if (aiPowered) {
      if (isLoading) {
        return (
          <div className="flex flex-col space-y-2 w-full max-w-[200px]">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        );
      }
      if (aiContent) {
        return (
          <div className="font-normal text-xs">
            <span className="block font-semibold text-primary mb-1">AI Suggestion:</span>
            {aiContent}
          </div>
        );
      }
    }
    
    // Default to static content
    return content;
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger type="button" className="ml-1.5 inline-flex">
          <Info className={`h-4 w-4 ${aiPowered ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`} />
        </TooltipTrigger>
        <TooltipContent side={position} className="max-w-xs text-sm">
          {displayContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipHelper;
