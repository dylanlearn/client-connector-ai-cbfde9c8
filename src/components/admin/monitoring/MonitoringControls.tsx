
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { MonitoringConfiguration } from "@/utils/monitoring/types";
import { useToast } from "@/components/ui/use-toast";

interface MonitoringControlsProps {
  onConfigUpdate?: () => void;
}

export function MonitoringControls({ onConfigUpdate }: MonitoringControlsProps) {
  const [configurations, setConfigurations] = useState<MonitoringConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch monitoring configurations
  useEffect(() => {
    const fetchConfigurations = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await (supabase
          .from('monitoring_configuration' as any)
          .select('*')
          .order('component')) as any;
          
        if (error) {
          throw error;
        }
        
        setConfigurations(data || []);
      } catch (error) {
        console.error('Error fetching monitoring configurations:', error);
        toast({
          title: "Error loading configurations",
          description: "There was a problem loading the monitoring configurations.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfigurations();
  }, [toast]);

  // Update a specific field in a configuration
  const handleConfigChange = (index: number, field: keyof MonitoringConfiguration, value: any) => {
    const updatedConfigs = [...configurations];
    updatedConfigs[index] = {
      ...updatedConfigs[index],
      [field]: value
    };
    setConfigurations(updatedConfigs);
  };

  // Save updated configurations to the database
  const saveConfigurations = async () => {
    setIsSaving(true);
    
    try {
      // Update each configuration in sequence
      for (const config of configurations) {
        const { error } = await (supabase
          .from('monitoring_configuration' as any)
          .update({
            warning_threshold: config.warning_threshold,
            critical_threshold: config.critical_threshold,
            check_interval: config.check_interval,
            enabled: config.enabled,
            notification_enabled: config.notification_enabled
          })
          .eq('id', config.id)) as any;
          
        if (error) throw error;
      }
      
      toast({
        title: "Configurations saved",
        description: "Monitoring configurations have been updated successfully.",
        variant: "default"
      });
      
      // Notify parent component if callback provided
      if (onConfigUpdate) {
        onConfigUpdate();
      }
    } catch (error) {
      console.error('Error saving monitoring configurations:', error);
      toast({
        title: "Error saving configurations",
        description: "There was a problem saving the monitoring configurations.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Monitoring Configuration</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monitoring Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        {configurations.length === 0 ? (
          <p className="text-center text-muted-foreground">No monitoring components configured</p>
        ) : (
          <div className="space-y-6">
            {configurations.map((config, index) => (
              <div key={config.id} className="border rounded-md p-4">
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
                      onChange={(e) => handleConfigChange(index, 'warning_threshold', Number(e.target.value))}
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
                      onChange={(e) => handleConfigChange(index, 'critical_threshold', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`interval-${config.id}`}>Check Interval (seconds)</Label>
                    <Input 
                      id={`interval-${config.id}`}
                      type="number" 
                      min="5"
                      value={config.check_interval} 
                      onChange={(e) => handleConfigChange(index, 'check_interval', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`enabled-${config.id}`}>Monitoring Enabled</Label>
                      <Switch 
                        id={`enabled-${config.id}`}
                        checked={config.enabled} 
                        onCheckedChange={(checked) => handleConfigChange(index, 'enabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Label htmlFor={`notifications-${config.id}`}>Notifications Enabled</Label>
                      <Switch 
                        id={`notifications-${config.id}`}
                        checked={config.notification_enabled ?? true} 
                        onCheckedChange={(checked) => handleConfigChange(index, 'notification_enabled', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={saveConfigurations} 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Configurations
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
