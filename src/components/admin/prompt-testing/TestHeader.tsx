
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface TestHeaderProps {
  onRefresh: () => void;
}

export function TestHeader({ onRefresh }: TestHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Prompt A/B Testing Analytics</h2>
      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
}
