
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Plus, Code, MobileIcon, MonitorIcon, TabletIcon } from 'lucide-react';
import { PlatformOutputService } from '@/services/platform-output/platform-output-service';
import type { PlatformConfiguration } from '@/types/platform-output';

interface PlatformConfigurationsProps {
  platforms: PlatformConfiguration[];
  isLoading: boolean;
  selectedPlatformId: string | null;
  onPlatformSelect: (id: string) => void;
  onPlatformCreated: (platform: PlatformConfiguration) => void;
  onGenerate: (platformId: string) => void;
  onRefresh: () => void;
  wireframeId?: string;
}

export function PlatformConfigurations({ 
  platforms, 
  isLoading, 
  selectedPlatformId,
  onPlatformSelect,
  onPlatformCreated,
  onGenerate,
  onRefresh,
  wireframeId
}: PlatformConfigurationsProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [platformName, setPlatformName] = useState('');
  const [platformType, setPlatformType] = useState('web');
  const [configSchema, setConfigSchema] = useState('{}');
  const [defaultSettings, setDefaultSettings] = useState('{}');

  const createPlatform = async () => {
    if (!platformName) return;

    let parsedConfigSchema: Record<string, any>;
    let parsedDefaultSettings: Record<string, any>;

    try {
      parsedConfigSchema = JSON.parse(configSchema);
      parsedDefaultSettings = JSON.parse(defaultSettings);
    } catch (e) {
      console.error("Invalid JSON configuration");
      return;
    }

    setIsCreating(true);
    try {
      const newPlatform = await PlatformOutputService.createPlatformConfig(
        platformName,
        platformType,
        parsedConfigSchema,
        parsedDefaultSettings
      );
      
      setShowDialog(false);
      resetForm();
      onPlatformCreated(newPlatform);
    } catch (error) {
      console.error("Error creating platform configuration:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setPlatformName('');
    setPlatformType('web');
    setConfigSchema('{}');
    setDefaultSettings('{}');
  };

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'ios':
      case 'android':
      case 'react-native':
      case 'flutter':
        return <MobileIcon className="h-4 w-4" />;
      case 'desktop':
        return <MonitorIcon className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Platform Configurations</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Platform
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Platform Configuration</DialogTitle>
                <DialogDescription>
                  Configure a target platform for generating output from your wireframes.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input 
                      id="platformName" 
                      value={platformName} 
                      onChange={(e) => setPlatformName(e.target.value)}
                      placeholder="React Web App"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="platformType">Platform Type</Label>
                    <select
                      id="platformType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={platformType}
                      onChange={(e) => setPlatformType(e.target.value)}
                    >
                      <option value="web">Web</option>
                      <option value="ios">iOS</option>
                      <option value="android">Android</option>
                      <option value="react-native">React Native</option>
                      <option value="flutter">Flutter</option>
                      <option value="desktop">Desktop</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="configSchema">Configuration Schema (JSON)</Label>
                  <Textarea 
                    id="configSchema" 
                    value={configSchema} 
                    onChange={(e) => setConfigSchema(e.target.value)}
                    placeholder="{}"
                    className="font-mono text-sm h-20"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="defaultSettings">Default Settings (JSON)</Label>
                  <Textarea 
                    id="defaultSettings" 
                    value={defaultSettings} 
                    onChange={(e) => setDefaultSettings(e.target.value)}
                    placeholder="{}"
                    className="font-mono text-sm h-20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button 
                  onClick={createPlatform} 
                  disabled={isCreating || !platformName}
                >
                  {isCreating ? "Creating..." : "Create Platform"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : platforms.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No platform configurations found. Add a platform to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {platforms.map(platform => (
            <Card 
              key={platform.id} 
              className={`overflow-hidden cursor-pointer hover:bg-gray-50 transition ${
                selectedPlatformId === platform.id ? 'border-primary' : ''
              }`}
              onClick={() => onPlatformSelect(platform.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(platform.platform_type)}
                      <h3 className="font-semibold">{platform.platform_name}</h3>
                      <Badge variant="outline">
                        {platform.platform_type.charAt(0).toUpperCase() + platform.platform_type.slice(1)}
                      </Badge>
                      <Badge variant={platform.is_active ? "default" : "outline"}>
                        {platform.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created on {new Date(platform.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <Button 
                    size="sm"
                    disabled={!wireframeId}
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerate(platform.id);
                    }}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
