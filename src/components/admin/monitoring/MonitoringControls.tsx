
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringConfig } from "@/hooks/use-monitoring-config";
import { ConfigurationItem } from "./controls/ConfigurationItem";
import { SaveButton } from "./controls/SaveButton";
import { LoadingState } from "./controls/LoadingState";
import { ErrorMessage } from "./controls/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";

interface MonitoringControlsProps {
  onConfigUpdate?: () => void;
  redisConnected?: boolean;
}

export function MonitoringControls({ onConfigUpdate, redisConnected }: MonitoringControlsProps) {
  const {
    configurations,
    isLoading,
    isSaving,
    error,
    updateConfigField,
    saveConfigurations
  } = useMonitoringConfig(onConfigUpdate);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monitoring Configuration</CardTitle>
          {redisConnected !== undefined && (
            <Badge className={redisConnected ? "bg-green-500" : "bg-red-500"}>
              <Database className="h-3 w-3 mr-1" />
              Redis {redisConnected ? "Connected" : "Disconnected"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && <ErrorMessage message={error} />}
          
          {configurations.map((config, index) => (
            <ConfigurationItem 
              key={config.id}
              config={config}
              onConfigChange={(field, value) => updateConfigField(index, field, value)}
            />
          ))}
          
          <SaveButton 
            isSaving={isSaving}
            onSave={saveConfigurations}
          />
        </div>
      </CardContent>
    </Card>
  );
}
