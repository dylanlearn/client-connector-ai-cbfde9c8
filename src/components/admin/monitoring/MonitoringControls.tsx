
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { MonitoringConfiguration } from "@/utils/monitoring/types";
import { useToast } from "@/components/ui/use-toast";
import { ConfigurationItem } from "./controls/ConfigurationItem";
import { SaveButton } from "./controls/SaveButton";

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
              <ConfigurationItem
                key={config.id}
                config={config}
                onConfigChange={(field, value) => handleConfigChange(index, field, value)}
              />
            ))}
            
            <SaveButton onSave={saveConfigurations} isSaving={isSaving} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
