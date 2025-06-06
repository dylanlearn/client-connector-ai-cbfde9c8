
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  hasFollowUp: boolean;
  isThinking: boolean;
}

const NavigationButtons = ({ 
  onPrevious, 
  onNext, 
  isFirstQuestion,
  isLastQuestion,
  hasFollowUp,
  isThinking
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between border-t pt-6">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={isFirstQuestion && !hasFollowUp}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Button 
        onClick={onNext}
        disabled={isThinking}
      >
        {isThinking ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Thinking...
          </>
        ) : isLastQuestion && !hasFollowUp ? (
          <>
            Submit
            <Send className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default NavigationButtons;
