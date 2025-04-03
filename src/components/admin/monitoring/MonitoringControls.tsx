
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMonitoringConfig } from "@/hooks/use-monitoring-config";
import { ConfigurationItem } from "./controls/ConfigurationItem";
import { SaveButton } from "./controls/SaveButton";
import { LoadingState } from "./controls/LoadingState";
import { ErrorMessage } from "./controls/ErrorMessage";

interface MonitoringControlsProps {
  onConfigUpdate?: () => void;
}

export function MonitoringControls({ onConfigUpdate }: MonitoringControlsProps) {
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
        <CardTitle>Monitoring Configuration</CardTitle>
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
