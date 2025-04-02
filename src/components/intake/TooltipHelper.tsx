
import React, { useState, useEffect, useRef } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Cleanup function to handle component unmounting
    return () => {
      mountedRef.current = false;
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Reset state when aiPowered or field changes
    if (!aiPowered) {
      setAiContent(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Only fetch AI content if tooltip is open, aiPowered is true, and we have a field name
    if (aiPowered && field && isOpen) {
      setIsLoading(true);
      setError(null);
      
      // Set a timeout to handle long-running requests
      requestTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current && isLoading) {
          setIsLoading(false);
          setError("Request took too long. Try again later.");
        }
      }, 8000); // 8 second timeout
      
      const generateAIExample = async () => {
        try {
          // Generate a stable caching key based on the field
          const cacheKey = `tooltip-example-${field.toLowerCase().replace(/\s+/g, '-')}`;
          
          const aiExample = await AIGeneratorService.generateContent({
            type: 'description',
            context: `Example answer for the field: ${field}`,
            maxLength: 150,
            tone: 'helpful',
            cacheKey // Add cache key for efficient caching
          });
          
          if (mountedRef.current) {
            setAiContent(aiExample);
            setError(null);
          }
        } catch (error) {
          console.error("Error generating AI example:", error);
          if (mountedRef.current) {
            setError("Could not generate example. Using default.");
          }
        } finally {
          if (mountedRef.current) {
            setIsLoading(false);
          }
          if (requestTimeoutRef.current) {
            clearTimeout(requestTimeoutRef.current);
            requestTimeoutRef.current = null;
          }
        }
      };

      generateAIExample();
    }
  }, [aiPowered, field, isOpen]);

  // Determine what content to show
  const displayContent = () => {
    if (aiPowered) {
      if (isLoading) {
        return (
          <div className="flex flex-col space-y-2 w-full max-w-[220px]">
            <div className="flex items-center space-x-2 mb-1">
              <div className="animate-pulse h-2 w-2 rounded-full bg-primary"></div>
              <span className="block font-semibold text-primary text-xs">AI generating suggestion...</span>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        );
      }
      
      if (error) {
        // Show static content if there's an error
        return (
          <div className="font-normal text-xs">
            <span className="block text-destructive mb-1">{error}</span>
            {content}
          </div>
        );
      }
      
      if (aiContent) {
        return (
          <div className="font-normal text-xs max-w-[250px]">
            <div className="flex items-center space-x-1.5 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="block font-semibold text-primary">AI Suggestion</span>
            </div>
            <p className="leading-relaxed">{aiContent}</p>
          </div>
        );
      }
    }
    
    // Default to static content
    return content;
  };
  
  // Handle open/close state
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300} onOpenChange={handleOpenChange}>
        <TooltipTrigger type="button" className="ml-1.5 inline-flex">
          <Info 
            className={`h-4 w-4 ${aiPowered 
              ? 'text-primary animate-pulse' 
              : 'text-muted-foreground'} hover:text-primary transition-colors`} 
          />
        </TooltipTrigger>
        <TooltipContent 
          side={position} 
          className="max-w-xs p-3 text-sm bg-white border-slate-200 shadow-lg"
        >
          {displayContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipHelper;
