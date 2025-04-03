
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnimationPreferences } from "@/hooks/use-animation-preferences";
import { AnimationCategory } from "@/types/animations";
import { toast } from "sonner";

const AnimationPreferencesManager = () => {
  const { 
    preferences, 
    loading, 
    updatePreference 
  } = useAnimationPreferences();
  
  const [saving, setSaving] = useState(false);

  const handleToggleAnimation = async (type: AnimationCategory, enabled: boolean) => {
    setSaving(true);
    try {
      await updatePreference(type, { enabled });
      toast.success(`${formatAnimationType(type)} animations ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error("Failed to update preference");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSpeedChange = async (type: AnimationCategory, speed: string) => {
    setSaving(true);
    try {
      await updatePreference(type, { speed_preference: speed as 'slow' | 'normal' | 'fast' });
      toast.success(`${formatAnimationType(type)} animation speed updated`);
    } catch (error) {
      toast.error("Failed to update speed preference");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleIntensityChange = async (type: AnimationCategory, intensity: number) => {
    setSaving(true);
    try {
      await updatePreference(type, { intensity_preference: intensity });
      toast.success(`${formatAnimationType(type)} animation intensity updated`);
    } catch (error) {
      toast.error("Failed to update intensity preference");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleReducedMotionToggle = async (type: AnimationCategory, reduced: boolean) => {
    setSaving(true);
    try {
      await updatePreference(type, { reduced_motion_preference: reduced });
      toast.success(`Reduced motion ${reduced ? 'enabled' : 'disabled'} for ${formatAnimationType(type)}`);
    } catch (error) {
      toast.error("Failed to update reduced motion preference");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  
  // Format animation type for display
  const formatAnimationType = (type: AnimationCategory): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get preference or default for an animation type
  const getPreferenceOrDefault = (type: AnimationCategory) => {
    const pref = preferences.find(p => p.animation_type === type);
    if (!pref) {
      return {
        enabled: true,
        speed_preference: 'normal' as const,
        intensity_preference: 5,
        reduced_motion_preference: false
      };
    }
    return pref;
  };
  
  // All animation categories
  const animationTypes: AnimationCategory[] = [
    'morphing_shape',
    'progressive_disclosure',
    'intent_based_motion',
    'glassmorphism',
    'hover_effect',
    'modal_dialog',
    'custom_cursor',
    'scroll_animation',
    'drag_interaction',
    'magnetic_element',
    'color_shift',
    'parallax_tilt'
  ];

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading animation preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Animation Preferences</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {animationTypes.map(type => {
          const pref = getPreferenceOrDefault(type);
          return (
            <Card key={type} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{formatAnimationType(type)}</CardTitle>
                <CardDescription>Customize animation behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormItem className="flex flex-row items-center justify-between space-y-0 space-x-2">
                  <FormLabel>Enable {formatAnimationType(type)}</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={pref.enabled}
                      onCheckedChange={(checked) => handleToggleAnimation(type, checked)}
                      disabled={saving}
                    />
                  </FormControl>
                </FormItem>
                
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Animation Speed</FormLabel>
                    <Select 
                      value={pref.speed_preference}
                      onValueChange={(value) => handleSpeedChange(type, value)}
                      disabled={!pref.enabled || saving}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select speed" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                
                  <FormItem>
                    <FormLabel>Animation Intensity ({pref.intensity_preference})</FormLabel>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[pref.intensity_preference]}
                      onValueChange={([value]) => handleIntensityChange(type, value)}
                      disabled={!pref.enabled || saving}
                    />
                    <FormDescription>Adjust intensity from subtle to dramatic</FormDescription>
                  </FormItem>
                
                  <FormItem className="flex flex-row items-center justify-between space-y-0 space-x-2">
                    <FormLabel>Reduced Motion</FormLabel>
                    <FormControl>
                      <Switch 
                        checked={pref.reduced_motion_preference}
                        onCheckedChange={(checked) => handleReducedMotionToggle(type, checked)}
                        disabled={saving}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">
                      Enable for accessibility needs
                    </FormDescription>
                  </FormItem>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AnimationPreferencesManager;
