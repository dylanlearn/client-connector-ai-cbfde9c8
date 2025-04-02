
import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipHelperProps {
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const TooltipHelper = ({ content, position = "top" }: TooltipHelperProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger type="button" className="ml-1.5 inline-flex">
          <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
        </TooltipTrigger>
        <TooltipContent side={position} className="max-w-xs text-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipHelper;
