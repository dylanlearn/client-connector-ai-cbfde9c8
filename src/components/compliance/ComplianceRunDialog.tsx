
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
import { CompliancePolicy } from "@/types/compliance";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ComplianceRunDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (policyId: string, resourceType: string, resourceId: string) => void;
  policies: CompliancePolicy[];
}

const checkSchema = z.object({
  policy_id: z.string().min(1, "Policy selection is required"),
  resource_type: z.string().min(1, "Resource type is required"),
  resource_id: z.string().min(1, "Resource ID is required"),
});

type FormValues = z.infer<typeof checkSchema>;

export function ComplianceRunDialog({ open, onOpenChange, onSubmit, policies }: ComplianceRunDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(checkSchema),
    defaultValues: {
      policy_id: "",
      resource_type: "wireframe",
      resource_id: "",
    }
  });
  
  const handleSubmit = (values: FormValues) => {
    onSubmit(values.policy_id, values.resource_type, values.resource_id);
    form.reset();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Run Compliance Check</DialogTitle>
          <DialogDescription>
            Validate a resource against a compliance policy
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="policy_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compliance Policy</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {policies.map((policy) => (
                        <SelectItem key={policy.id} value={policy.id}>
                          {policy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="resource_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resource type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wireframe">Wireframe</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="component">Component</SelectItem>
                      <SelectItem value="page">Page</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="resource_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter resource ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Run Check</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
