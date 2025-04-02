
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateMonitoringData, clearMonitoringData } from "@/services/monitoring-service";

export function MonitoringControls() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleGenerateData = async () => {
    setIsGenerating(true);
    try {
      await generateMonitoringData();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      await clearMonitoringData();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Monitoring Controls</h3>
          <p className="text-sm text-muted-foreground">
            Generate or clear simulated monitoring data
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateData}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Data"}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleClearData}
            disabled={isClearing}
          >
            {isClearing ? "Clearing..." : "Clear Data"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
