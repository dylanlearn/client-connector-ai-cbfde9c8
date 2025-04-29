
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CompliancePolicy } from "@/types/compliance";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CompliancePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (policy: Partial<CompliancePolicy>) => void;
}

const policySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  policy_type: z.enum(['accessibility', 'brand', 'regulatory', 'security', 'custom']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  is_active: z.boolean().default(true),
  rules: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional()
  })).default([])
});

type FormValues = z.infer<typeof policySchema>;

export function CompliancePolicyDialog({ open, onOpenChange, onSubmit }: CompliancePolicyDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: "",
      description: "",
      policy_type: "accessibility",
      severity: "medium",
      is_active: true,
      rules: [
        { id: "rule-1", name: "Rule 1", description: "Description of Rule 1" }
      ]
    }
  });
  
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Compliance Policy</DialogTitle>
          <DialogDescription>
            Create a new policy to enforce compliance standards
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Name</FormLabel>
                  <FormControl>
                    <Input placeholder="WCAG 2.1 AA Compliance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Web Content Accessibility Guidelines 2.1 Level AA compliance checks" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="policy_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="accessibility">Accessibility</SelectItem>
                        <SelectItem value="brand">Brand</SelectItem>
                        <SelectItem value="regulatory">Regulatory</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Policy</FormLabel>
                    <FormDescription>
                      Should this policy be active immediately?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Policy</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
