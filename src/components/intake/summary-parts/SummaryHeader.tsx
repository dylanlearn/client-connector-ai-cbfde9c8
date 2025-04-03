
import React from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, RefreshCw } from "lucide-react";

interface SummaryHeaderProps {
  title: string;
  isLoading: boolean;
  onRegenerate: () => void;
}

const SummaryHeader = ({ title, isLoading, onRegenerate }: SummaryHeaderProps) => {
  return (
    <CardHeader className="border-b border-zinc-800 pb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRegenerate}
          disabled={isLoading}
          className="text-sm bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <CardDescription className="text-zinc-400">
        Based on your intake form responses
      </CardDescription>
    </CardHeader>
  );
};

export default SummaryHeader;
