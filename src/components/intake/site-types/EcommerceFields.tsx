
import { useProfile } from "@/contexts/ProfileContext";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";

// Create a simple ProFeatureMessage component
const ProFeatureMessage = () => (
  <span className="text-xs text-amber-600 ml-2">(Pro feature)</span>
);

export function EcommerceFields({ showTooltips = false, aiPowered = false }) {
  const { profile } = useProfile();
  const form = useFormContext();
  
  // Use a type assertion to ensure proper comparison
  const isPro = profile?.role === "pro" || profile?.role === "admin" || (profile?.role as string) === "sync-pro";
  
  return (
    <CardContent className="space-y-4">
      <FormField
        control={form.control}
        name="ecommerce.productCount"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>How many products do you plan to sell?</Label>
            <Input
              {...field}
              type="number"
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          </div>
        )}
      />
      
      <FormField
        control={form.control}
        name="ecommerce.targetAudience"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Who is your target audience?</Label>
            <Textarea
              {...field}
              placeholder="Describe your ideal customer"
            />
          </div>
        )}
      />
      
      <FormField
        control={form.control}
        name="ecommerce.emailMarketing"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Do you plan to use email marketing?</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!isPro}
              />
              <Label htmlFor="emailMarketing" className="cursor-pointer">
                {field.value ? "Yes" : "No"}
              </Label>
              {!isPro && <ProFeatureMessage />}
            </div>
          </div>
        )}
      />
    </CardContent>
  );
}
