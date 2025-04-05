import { useProfile } from "@/contexts/ProfileContext";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CardContent } from "@/components/ui/card";
import { useIntakeForm } from "@/hooks/intake/use-intake-form";
import { ProFeatureMessage } from "@/components/shared/ProFeatureMessage";

export function EcommerceFields() {
  const { profile } = useProfile();
  const { form } = useIntakeForm();
  
  // Fix TypeScript error by comparing with proper type
  // (assuming the role field is defined as a string in the UserRole type)
  const isPro = profile?.role === "pro" || profile?.role === "admin";
  
  return (
    <CardContent className="space-y-4">
      <FormField
        control={form.control}
        name="ecommerce.productCount"
        label="How many products do you plan to sell?"
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
          />
        )}
      />
      
      <FormField
        control={form.control}
        name="ecommerce.targetAudience"
        label="Who is your target audience?"
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Describe your ideal customer"
          />
        )}
      />
      
      <FormField
        control={form.control}
        name="ecommerce.emailMarketing"
        label="Do you plan to use email marketing?"
        render={({ field }) => (
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
        )}
      />
    </CardContent>
  );
}
