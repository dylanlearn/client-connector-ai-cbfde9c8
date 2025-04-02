
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface AIFollowUpProps {
  followUpQuestion: string | null;
  followUpAnswer: string;
  setFollowUpAnswer: (answer: string) => void;
}

const AIFollowUp = ({ followUpQuestion, followUpAnswer, setFollowUpAnswer }: AIFollowUpProps) => {
  if (!followUpQuestion) return null;
  
  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="bg-indigo-100 p-2 rounded-full">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-600" fill="currentColor">
              <path d="M19.044 7.921c0 2.935-2.377 5.313-5.313 5.313s-5.313-2.378-5.313-5.313c0-2.936 2.377-5.314 5.313-5.314s5.313 2.378 5.313 5.314zm-13.698 12.47h16.812c-1.692-3.604-6.558-6.25-8.405-6.25-1.846 0-6.713 2.646-8.407 6.25z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-indigo-500 mb-1">AI Assistant</p>
            <p className="text-sm text-indigo-900">{followUpQuestion}</p>
          </div>
        </div>
      </div>
      
      <Textarea
        value={followUpAnswer}
        onChange={(e) => setFollowUpAnswer(e.target.value)}
        placeholder="Your response..."
        rows={3}
        className="w-full"
      />
    </div>
  );
};

export default AIFollowUp;
