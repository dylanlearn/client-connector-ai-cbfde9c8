
import React from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { formatText } from "../utils/text-formatter";

interface SummaryTabProps {
  summaryText: string;
  onCopy: (text: string, label: string) => void;
}

const SummaryTab = ({ summaryText, onCopy }: SummaryTabProps) => {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="text-zinc-300 leading-relaxed">
          {formatText(summaryText)}
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onCopy(summaryText, "Summary")}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </Button>
        </div>
      </div>
    </CardContent>
  );
};

export default SummaryTab;
