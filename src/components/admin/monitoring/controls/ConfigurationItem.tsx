
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MonitoringConfiguration } from "@/utils/monitoring/types";

interface ConfigurationItemProps {
  config: MonitoringConfiguration;
  onConfigChange: (field: keyof MonitoringConfiguration, value: any) => void;
}

export function ConfigurationItem({ config, onConfigChange }: ConfigurationItemProps) {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium capitalize mb-4">{config.component} Monitoring</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor={`warning-${config.id}`}>Warning Threshold (%)</Label>
          <Input 
            id={`warning-${config.id}`}
            type="number" 
            min="0" 
            max="100"
            value={config.warning_threshold} 
            onChange={(e) => onConfigChange('warning_threshold', Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`critical-${config.id}`}>Critical Threshold (%)</Label>
          <Input 
            id={`critical-${config.id}`}
            type="number" 
            min="0" 
            max="100"
            value={config.critical_threshold} 
            onChange={(e) => onConfigChange('critical_threshold', Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`interval-${config.id}`}>Check Interval (seconds)</Label>
          <Input 
            id={`interval-${config.id}`}
            type="number" 
            min="5"
            value={config.check_interval} 
            onChange={(e) => onConfigChange('check_interval', Number(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`enabled-${config.id}`}>Monitoring Enabled</Label>
            <Switch 
              id={`enabled-${config.id}`}
              checked={config.enabled} 
              onCheckedChange={(checked) => onConfigChange('enabled', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <Label htmlFor={`notifications-${config.id}`}>Notifications Enabled</Label>
            <Switch 
              id={`notifications-${config.id}`}
              checked={config.notification_enabled ?? true} 
              onCheckedChange={(checked) => onConfigChange('notification_enabled', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
